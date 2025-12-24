import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { jwtVerify } from 'jose';

const intlMiddleware = createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
});

const JWT_SECRET = process.env.JWT_SECRET;
const isBuild = process.env.NEXT_PHASE === 'phase-production-build' || process.env.CI === 'true';

if (!JWT_SECRET && !isBuild) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const secret = new TextEncoder().encode(JWT_SECRET || 'placeholder-secret-for-build');

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Auth Protection for Admin Pages
  // Match paths like /admin, /en/admin, /zh/admin
  const isAdminPage = pathname.match(/^\/(?:en|zh)?\/admin/);
  
  // 2. Auth Protection for sensitive API routes
  const isProtectedApi = pathname.startsWith('/api/articles') || 
                         pathname.startsWith('/api/upload');

  if (isAdminPage || isProtectedApi) {
    const token = request.cookies.get('admin_token')?.value;
    let authenticated = false;
    let payload: any = null;

    if (token) {
      try {
        const { payload: verifiedPayload } = await jwtVerify(token, secret);
        payload = verifiedPayload;
        authenticated = true;
      } catch (e) {
        console.error('Middleware JWT verification failed:', e);
      }
    }

    if (!authenticated) {
      if (isProtectedApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const locale = pathname.split('/')[1] || 'en';
      const hasLocale = ['en', 'zh'].includes(locale);
      const loginPath = hasLocale ? `/${locale}/login` : '/login';
      
      const url = request.nextUrl.clone();
      url.pathname = loginPath;
      return NextResponse.redirect(url);
    }

    // SLIDING SESSION: If less than 6 hours remaining, renew the token
    const now = Math.floor(Date.now() / 1000);
    const exp = payload?.exp || 0;
    const response = isAdminPage ? intlMiddleware(request) : NextResponse.next();

    if (exp - now < 6 * 60 * 60) {
      const { SignJWT } = await import('jose');
      const newToken = await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('12h')
        .sign(secret);

      response.cookies.set('admin_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 12,
        path: '/',
      });
    }

    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Include the routes we want to protect
    '/admin/:path*',
    '/en/admin/:path*',
    '/zh/admin/:path*',
    '/api/articles/:path*',
    '/api/upload/:path*',
    // Internationalization matcher
    '/((?!api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
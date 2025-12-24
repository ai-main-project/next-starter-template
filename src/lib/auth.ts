import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { env } from './config/env';

const secret = new TextEncoder().encode(env.JWT_SECRET);
const COOKIE_NAME = 'admin_token';

export async function encryptPayload(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret);
}

export async function decryptPayload(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 12, // 12 hours
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function verifyAuth() {
  const token = await getAuthToken();
  if (!token) return null;
  return await decryptPayload(token);
}

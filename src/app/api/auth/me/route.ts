import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const payload = await verifyAuth();
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: payload });
}

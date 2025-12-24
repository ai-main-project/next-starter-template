import { NextRequest, NextResponse } from 'next/server';
import { encryptPayload, setAuthCookie } from '@/lib/auth';
import { env } from '@/lib/config/env';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as any;
    const { password } = body;

    if (password !== env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = await encryptPayload({ role: 'admin' });
    await setAuthCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const billing = await queryOne<{ plan: string; expiration: string; canceled: boolean }>(
    'SELECT plan, expiration, canceled FROM billing_accounts WHERE user_id = $1', [auth.sub]
  );

  return NextResponse.json(billing || { plan: 'FREE', expiration: '', canceled: false });
}

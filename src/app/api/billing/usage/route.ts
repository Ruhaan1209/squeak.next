import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const usage = await queryOne(
    'SELECT natural_tts_usage, max_natural_tts_usage, premium_stt_usage, max_premium_stt_usage, premium_audiobooks_usage, max_premium_audiobooks_usage FROM billing_usage WHERE user_id = $1',
    [auth.sub]
  );

  return NextResponse.json(usage || {
    natural_tts_usage: 0, max_natural_tts_usage: 10,
    premium_stt_usage: 0, max_premium_stt_usage: 10,
    premium_audiobooks_usage: 0, max_premium_audiobooks_usage: 5,
  });
}

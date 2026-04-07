import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const streak = await queryOne<{ streak: number; completed_today: boolean }>(
    `SELECT
       (SELECT COUNT(*) FROM (
         SELECT date FROM daily_progress WHERE user_id = $1 AND goal_met = true
         AND date >= CURRENT_DATE - INTERVAL '365 days'
         ORDER BY date DESC
       ) sub WHERE date >= CURRENT_DATE - (row_number() OVER (ORDER BY date DESC) - 1) * INTERVAL '1 day') as streak,
       EXISTS(SELECT 1 FROM daily_progress WHERE user_id = $1 AND date = CURRENT_DATE AND goal_met = true) as completed_today`,
    [auth.sub]
  );

  return NextResponse.json({ streak: streak?.streak || 0, completed_today: streak?.completed_today || false });
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const progress = await queryOne<{
    user_id: string; date: string; questions_completed: number; goal_met: boolean;
  }>(`SELECT user_id, date, questions_completed, goal_met FROM daily_progress
      WHERE user_id = $1 AND date = CURRENT_DATE`, [auth.sub]);

  if (!progress) {
    return NextResponse.json({ user_id: auth.sub, date: new Date().toISOString(), questions_completed: 0, goal_met: false });
  }

  return NextResponse.json(progress);
}

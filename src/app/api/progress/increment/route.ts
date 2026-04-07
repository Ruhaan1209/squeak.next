import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const amount = Number(request.nextUrl.searchParams.get('amount') || '1');
  if (isNaN(amount) || amount < 1) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  const profile = await queryOne<{ daily_questions_goal: number }>(
    'SELECT daily_questions_goal FROM profiles WHERE user_id = $1', [auth.sub]
  );
  const goal = profile?.daily_questions_goal || 3;

  const result = await queryOne<{ user_id: string; date: string; questions_completed: number; goal_met: boolean }>(
    `INSERT INTO daily_progress (user_id, date, questions_completed, goal_met)
     VALUES ($1, CURRENT_DATE, $2, $2 >= $3)
     ON CONFLICT (user_id, date) DO UPDATE SET
       questions_completed = daily_progress.questions_completed + $2,
       goal_met = (daily_progress.questions_completed + $2) >= $3
     RETURNING user_id, date, questions_completed, goal_met`,
    [auth.sub, amount, goal]
  );

  return NextResponse.json(result);
}

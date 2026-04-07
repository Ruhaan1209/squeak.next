import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const body = await request.json();
  const { username, learning_language, skill_level, interested_topics, daily_questions_goal } = body;

  if (!username || !learning_language || !skill_level) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const result = await queryOne<{ id: number }>(
    `INSERT INTO profiles (user_id, email, username, learning_language, skill_level, interested_topics, daily_questions_goal)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id) DO UPDATE SET
       username = EXCLUDED.username,
       learning_language = EXCLUDED.learning_language,
       skill_level = EXCLUDED.skill_level,
       interested_topics = EXCLUDED.interested_topics,
       daily_questions_goal = EXCLUDED.daily_questions_goal
     RETURNING id`,
    [auth.sub, auth.email, username, learning_language, skill_level, interested_topics, daily_questions_goal || 3]
  );

  return NextResponse.json({ message: 'Profile updated successfully', id: result?.id });
}

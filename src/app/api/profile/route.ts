import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const profile = await queryOne<{
    username: string; learning_language: string; skill_level: string;
    interested_topics: string[]; daily_questions_goal: number;
  }>('SELECT username, learning_language, skill_level, interested_topics, daily_questions_goal FROM profiles WHERE user_id = $1', [auth.sub]);

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found', code: 'PROFILE_NOT_FOUND' }, { status: 404 });
  }

  return NextResponse.json(profile);
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const { name } = await request.json();
  if (!name) return NextResponse.json({ error: 'Missing classroom name' }, { status: 400 });

  const teacher = await queryOne<{ teacher_id: string }>('SELECT teacher_id FROM teachers WHERE user_id = $1', [auth.sub]);
  if (!teacher) return NextResponse.json({ error: 'Not a teacher' }, { status: 403 });

  const result = await queryOne<{ classroom_id: string }>(
    'INSERT INTO classrooms (teacher_id, name) VALUES ($1, $2) RETURNING classroom_id',
    [teacher.teacher_id, name]
  );

  return NextResponse.json({ classroom_id: result?.classroom_id });
}

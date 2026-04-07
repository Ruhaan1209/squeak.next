import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const { classroom_id } = await request.json();
  if (!classroom_id) return NextResponse.json({ error: 'Missing classroom_id' }, { status: 400 });

  const classroom = await queryOne('SELECT classroom_id FROM classrooms WHERE classroom_id = $1', [classroom_id]);
  if (!classroom) return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });

  await queryOne(
    `INSERT INTO students (user_id, classroom_id) VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET classroom_id = $2`,
    [auth.sub, classroom_id]
  );

  return NextResponse.json({ message: 'Student added to classroom successfully' });
}

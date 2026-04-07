import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const info = await queryOne(
    `SELECT c.teacher_id, COUNT(s2.student_id)::int as students_count
     FROM students s
     JOIN classrooms c ON s.classroom_id = c.classroom_id
     LEFT JOIN students s2 ON c.classroom_id = s2.classroom_id
     WHERE s.user_id = $1
     GROUP BY c.teacher_id`, [auth.sub]
  );

  if (!info) return NextResponse.json({ error: 'Not in a classroom' }, { status: 403 });
  return NextResponse.json(info);
}

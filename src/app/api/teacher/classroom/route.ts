import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const classrooms = await query(
    `SELECT c.classroom_id, c.name, COUNT(s.student_id)::int as students_count
     FROM classrooms c
     LEFT JOIN students s ON c.classroom_id = s.classroom_id
     JOIN teachers t ON c.teacher_id = t.teacher_id
     WHERE t.user_id = $1
     GROUP BY c.classroom_id, c.name`, [auth.sub]
  );

  return NextResponse.json({ classrooms });
}

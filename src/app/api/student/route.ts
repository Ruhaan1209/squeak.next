import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const student = await queryOne<{ student_id: string; classroom_id: string; plan: string }>(
    `SELECT s.student_id, s.classroom_id, COALESCE(o.plan, '') as plan
     FROM students s
     LEFT JOIN classrooms c ON s.classroom_id = c.classroom_id
     LEFT JOIN teachers t ON c.teacher_id = t.teacher_id
     LEFT JOIN organizations o ON t.organization_id = o.organization_id
     WHERE s.user_id = $1`, [auth.sub]
  );

  return NextResponse.json(student || { student_id: '', classroom_id: '', plan: '' });
}

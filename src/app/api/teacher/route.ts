import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const teacher = await queryOne<{ teacher_id: string; plan: string }>(
    `SELECT t.teacher_id, COALESCE(o.plan, '') as plan
     FROM teachers t LEFT JOIN organizations o ON t.organization_id = o.organization_id
     WHERE t.user_id = $1`, [auth.sub]
  );

  return NextResponse.json({ exists: !!teacher, plan: teacher?.plan || '' });
}

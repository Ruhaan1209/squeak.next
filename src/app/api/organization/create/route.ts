import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const org = await queryOne<{ organization_id: string }>(
    "INSERT INTO organizations (plan) VALUES ('FREE') RETURNING organization_id", []
  );

  const teacher = await queryOne<{ teacher_id: string }>(
    'INSERT INTO teachers (user_id, organization_id) VALUES ($1, $2) RETURNING teacher_id',
    [auth.sub, org!.organization_id]
  );

  return NextResponse.json({ organization_id: org!.organization_id, teacher_id: teacher!.teacher_id });
}

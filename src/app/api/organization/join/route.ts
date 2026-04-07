import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const { organization_id } = await request.json();
  if (!organization_id) return NextResponse.json({ error: 'Missing organization_id' }, { status: 400 });

  const teacher = await queryOne<{ teacher_id: string }>(
    'INSERT INTO teachers (user_id, organization_id) VALUES ($1, $2) RETURNING teacher_id',
    [auth.sub, organization_id]
  );

  return NextResponse.json({ teacher_id: teacher!.teacher_id });
}

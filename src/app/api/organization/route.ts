import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const org = await queryOne(
    `SELECT o.organization_id, t.teacher_id, o.plan, o.canceled, o.expiration_date
     FROM teachers t JOIN organizations o ON t.organization_id = o.organization_id
     WHERE t.user_id = $1`, [auth.sub]
  );

  if (!org) return NextResponse.json({ error: 'Not in an organization' }, { status: 404 });
  return NextResponse.json(org);
}

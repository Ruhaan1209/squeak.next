import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const { classroom_id, content_id, content_type } = await request.json();
  await queryOne(
    `INSERT INTO classroom_whitelist (classroom_id, content_id, content_type, status)
     VALUES ($1, $2, $3, 'accepted')
     ON CONFLICT (classroom_id, content_id, content_type) DO UPDATE SET status = 'accepted'`,
    [classroom_id, content_id, content_type]
  );

  return NextResponse.json({ message: 'Content accepted successfully' });
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const { classroom_id } = await request.json();
  if (!classroom_id) return NextResponse.json({ error: 'Missing classroom_id' }, { status: 400 });

  await queryOne('DELETE FROM classrooms WHERE classroom_id = $1', [classroom_id]);
  return NextResponse.json({ message: 'Classroom deleted successfully' });
}

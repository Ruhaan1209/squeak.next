import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const { classroom_id, name } = await request.json();
  if (!classroom_id || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  await queryOne('UPDATE classrooms SET name = $1 WHERE classroom_id = $2', [name, classroom_id]);
  return NextResponse.json({ message: 'Classroom updated successfully' });
}

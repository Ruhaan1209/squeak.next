import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });

  const context = await queryOne<{ context: string }>(
    'SELECT context FROM story_contexts WHERE story_id = $1', [id]
  );

  if (!context) return NextResponse.json({ error: 'Story context not found' }, { status: 404 });

  return NextResponse.json(context);
}

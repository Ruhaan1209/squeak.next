import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const id = request.nextUrl.searchParams.get('id');
  const page = request.nextUrl.searchParams.get('page') || '1';
  if (!id) return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });

  const story = await queryOne(
    `SELECT id, title, content, content_type, language, cefr_level, topic, date_created, preview_text, pages
     FROM story_pages WHERE story_id = $1 AND page_number = $2`, [id, parseInt(page)]
  );

  if (!story) return NextResponse.json({ error: 'Story page not found' }, { status: 404 });

  return NextResponse.json(story);
}

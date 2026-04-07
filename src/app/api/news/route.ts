import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });

  const news = await queryOne(
    `SELECT id, title, content, content_type, language, cefr_level, topic, date_created, preview_text, dictionary, sources
     FROM news WHERE id = $1`, [id]
  );

  if (!news) return NextResponse.json({ error: 'News not found' }, { status: 404 });

  return NextResponse.json(news);
}

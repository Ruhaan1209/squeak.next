import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const sp = request.nextUrl.searchParams;
  const classroomId = sp.get('classroom_id');
  const page = parseInt(sp.get('page') || '1');
  const pagesize = parseInt(sp.get('pagesize') || '20');
  const offset = (page - 1) * pagesize;

  if (!classroomId) return NextResponse.json({ error: 'Missing classroom_id' }, { status: 400 });

  const rows = await query(
    `SELECT id, title, preview_text, content_type, language, cefr_level, topic, pages, date_created, created_at, audiobook_tier
     FROM classroom_content WHERE classroom_id = $1
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [classroomId, pagesize, offset]
  );

  return NextResponse.json(rows);
}

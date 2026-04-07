import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const sp = request.nextUrl.searchParams;
  const language = sp.get('language') || 'French';
  const cefr = sp.get('cefr') || 'B1';
  const subject = sp.get('subject') || 'any';
  const page = parseInt(sp.get('page') || '1');
  const pagesize = parseInt(sp.get('pagesize') || '10');
  const offset = (page - 1) * pagesize;

  let sql = `SELECT id, title, preview_text, language, cefr_level, topic, date_created, created_at, audiobook_tier
             FROM stories WHERE language = $1`;
  const params: unknown[] = [language];
  let idx = 2;

  if (cefr !== 'any') { sql += ` AND cefr_level = $${idx}`; params.push(cefr); idx++; }
  if (subject !== 'any') { sql += ` AND topic = $${idx}`; params.push(subject); idx++; }

  sql += ` ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
  params.push(pagesize, offset);

  const rows = await query(sql, params);
  return NextResponse.json(rows);
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { getPresignedUrl } from '@/lib/s3';

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const sp = request.nextUrl.searchParams;
  const type = sp.get('type');
  const newsId = sp.get('news_id');
  const storyId = sp.get('story_id');
  const page = sp.get('page') || '1';

  let key: string;
  if (type === 'story') {
    key = `audiobooks/stories/${storyId}/page${page}.mp3`;
  } else {
    key = `audiobooks/news/${newsId}.mp3`;
  }

  try {
    const url = await getPresignedUrl(key);
    return NextResponse.json({ url, expires_in: 300 });
  } catch {
    return NextResponse.json({ error: 'Audiobook not found' }, { status: 404 });
  }
}

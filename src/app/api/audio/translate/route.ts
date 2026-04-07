import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { generateContent } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const { sentence, source, target } = await request.json();
  if (!sentence || !source || !target) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const prompt = `Translate the following text from ${source} to ${target}. Respond with ONLY the translation, nothing else.\n\nText: ${sentence}`;
  const translation = await generateContent(prompt);
  return NextResponse.json({ sentence: translation.trim() });
}

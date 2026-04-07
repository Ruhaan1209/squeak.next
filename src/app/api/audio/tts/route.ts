import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const { text, language_code, voice_name } = await request.json();
  if (!text || !language_code) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: language_code, name: voice_name || undefined },
          audioConfig: { audioEncoding: 'MP3' },
        }),
      }
    );

    const data = await response.json();
    return NextResponse.json({ audio_content: data.audioContent });
  } catch {
    return NextResponse.json({ error: 'TTS service error' }, { status: 500 });
  }
}

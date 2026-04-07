import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const { audio_content, language_code } = await request.json();
  if (!audio_content || !language_code) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: { encoding: 'WEBM_OPUS', sampleRateHertz: 48000, languageCode: language_code },
          audio: { content: audio_content },
        }),
      }
    );

    const data = await response.json();
    const transcript = data.results?.[0]?.alternatives?.[0]?.transcript || '';
    return NextResponse.json({ transcript });
  } catch {
    return NextResponse.json({ error: 'STT service error' }, { status: 500 });
  }
}

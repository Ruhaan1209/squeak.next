import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { generateContent } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const { question, answer, content, cefr } = await request.json();
  if (!question || !answer || !content || !cefr) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const prompt = `You are a language teacher evaluating a ${cefr}-level student's answer.\n\nText: ${content}\nQuestion: ${question}\nStudent's answer: ${answer}\n\nEvaluate whether the answer is correct. Respond in EXACTLY this JSON format:\n{"evaluation": "PASS" or "FAIL", "explanation": "brief explanation"}`;

  const result = await generateContent(prompt);
  try {
    const parsed = JSON.parse(result.trim());
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ evaluation: 'FAIL', explanation: 'Could not evaluate the answer. Please try again.' });
  }
}

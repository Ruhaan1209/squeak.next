import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { generateContent } from '@/lib/gemini';
import { queryOne } from '@/lib/db';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (isAuthError(auth)) return auth;

  const { id, content_type, cefr_level, question_type } = await request.json();
  if (!id || !content_type || !cefr_level || !question_type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  let content: string | undefined;
  if (content_type === 'News') {
    const row = await queryOne<{ content: string }>('SELECT content FROM news WHERE id = $1', [id]);
    content = row?.content;
  } else {
    const row = await queryOne<{ context: string }>('SELECT context FROM story_contexts WHERE story_id = $1', [id]);
    content = row?.context;
  }

  if (!content) return NextResponse.json({ error: 'Content not found' }, { status: 404 });

  const typeInstruction = question_type === 'vocab'
    ? 'Ask a vocabulary question about a specific word or phrase from the text.'
    : 'Ask a comprehension/understanding question about the text.';

  const prompt = `You are a language teacher. Given this ${cefr_level}-level text, generate one question for the student.\n\n${typeInstruction}\n\nText:\n${content}\n\nRespond with ONLY the question, nothing else.`;

  const question = await generateContent(prompt);
  return NextResponse.json({ question: question.trim() });
}

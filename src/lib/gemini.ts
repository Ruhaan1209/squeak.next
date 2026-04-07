import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }
  return genAI;
}

export async function generateContent(prompt: string, model = 'gemini-pro'): Promise<string> {
  const ai = getGenAI();
  const genModel = ai.getGenerativeModel({ model });
  const result = await genModel.generateContent(prompt);
  return result.response.text();
}

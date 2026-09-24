import { NextRequest, NextResponse } from 'next/server';
import { RAGService } from '@/services/rag.service';

export async function POST(request: NextRequest) {
  try {
    // In production, we might want to rate limit or require auth for AI chat
    // const session = await auth();
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { question, countryId, jurisdictionId, locale } = body;

    if (!question || !countryId || !jurisdictionId || !locale) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const answer = await RAGService.askLegalAssistant(question, countryId, jurisdictionId, locale);

    return NextResponse.json(answer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: 'Failed to generate answer' }, { status: 500 });
  }
}

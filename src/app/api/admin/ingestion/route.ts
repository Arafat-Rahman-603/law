import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { IngestionService } from '@/services/ingestion.service';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Authorization: Only ADMIN
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sourceId } = body;

    if (!sourceId) {
      return NextResponse.json({ error: 'sourceId is required' }, { status: 400 });
    }

    // 10. MANUAL RUN: Admin can click "Run Ingestion"
    // 11. SCHEDULING: This runs in the background (we await it here for the UI feedback, but in a real prod environment this might enqueue a job)
    const job = await IngestionService.runIngestion(sourceId);

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    console.error('Ingestion API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

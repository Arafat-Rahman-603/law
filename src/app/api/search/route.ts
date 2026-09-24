import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/services/search.service';
import dbConnect from '@/lib/db';
import SearchLog from '@/models/SearchLog';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const countryId = searchParams.get('countryId') || undefined;
  const jurisdictionId = searchParams.get('jurisdictionId') || undefined;
  const locale = searchParams.get('locale') || 'en';

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await SearchService.search({
      query,
      countryId,
      jurisdictionId,
      verifiedOnly: true, // Always true for public search
    });

    // Fire and forget logging
    dbConnect().then(() => {
      SearchLog.create({
        query,
        countryId,
        jurisdictionId,
        resultCount: results.length,
        isZeroResult: results.length === 0,
        locale
      }).catch(console.error);
    });

    return NextResponse.json({ results });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

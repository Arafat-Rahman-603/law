import dbConnect from '@/lib/db';
import Law from '@/models/Law';
import LegalProcedure from '@/models/LegalProcedure';
import { SearchProvider, SearchFilters, SearchResult } from './types';
import { isRagEligible } from '../rag/policy';

export class MongoRegexProvider implements SearchProvider {
  async search(filters: SearchFilters): Promise<SearchResult[]> {
    await dbConnect();
    const { query, countryId, jurisdictionId, verifiedOnly = true } = filters;
    const results: SearchResult[] = [];

    if (!query || query.trim().length === 0) return [];
    
    // We use a regex for fallback if Atlas is not configured.
    const searchRegex = new RegExp(query.trim(), 'i');

    // 1. Search Laws
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lawQuery: any = { 
      $or: [{ title: searchRegex }, { summary: searchRegex }, { plainLanguageExplanation: searchRegex }],
    };
    if (countryId) lawQuery.country = countryId;

    const laws = await Law.find(lawQuery)
      .populate('jurisdiction', 'name slug level')
      .limit(20)
      .lean();

    for (const law of laws) {
      if (verifiedOnly && !isRagEligible(law)) continue;

      let score = 0;
      if (jurisdictionId && law.jurisdiction?._id?.toString() === jurisdictionId) score += 10;
      else if (countryId && law.country?.toString() === countryId) score += 5;

      results.push({
        type: 'law',
        id: law._id.toString(),
        canonicalRef: `law:${law._id.toString()}`,
        title: law.title,
        description: law.summary,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jurisdiction: (law.jurisdiction as any)?.name || 'Unknown',
        jurisdictionId: law.jurisdiction?._id?.toString() || '',
        countryId: law.country?.toString() || '',
        url: `/law/${law.slug}`,
        score,
        verificationStatus: law.verificationStatus,
      });
    }

    // 2. Search Procedures
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const procedureQuery: any = { 
      $or: [{ title: searchRegex }, { requirements: searchRegex }, { processSteps: searchRegex }],
    };
    if (countryId) procedureQuery.country = countryId;

    const procedures = await LegalProcedure.find(procedureQuery)
      .populate('jurisdiction', 'name slug level')
      .limit(10)
      .lean();

    for (const proc of procedures) {
      if (verifiedOnly && !isRagEligible(proc)) continue;

      let score = 0;
      if (jurisdictionId && proc.jurisdiction?._id?.toString() === jurisdictionId) score += 10;
      else if (countryId && proc.country?.toString() === countryId) score += 5;

      results.push({
        type: 'procedure',
        id: proc._id.toString(),
        canonicalRef: `procedure:${proc._id.toString()}`,
        title: proc.title,
        description: proc.processSteps?.[0] || 'Legal procedure guide',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jurisdiction: (proc.jurisdiction as any)?.name || 'Unknown',
        jurisdictionId: proc.jurisdiction?._id?.toString() || '',
        countryId: proc.country?.toString() || '',
        url: `/procedures/${proc.slug}`,
        score,
        verificationStatus: proc.verificationStatus,
      });
    }

    // Sort by score (jurisdiction relevance)
    return results.sort((a, b) => b.score - a.score);
  }
}

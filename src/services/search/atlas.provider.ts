import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Law from '@/models/Law';
import { SearchProvider, SearchFilters, SearchResult } from './types';
import { isRagEligible } from '../rag/policy';

export class AtlasSearchProvider implements SearchProvider {
  async search(filters: SearchFilters): Promise<SearchResult[]> {
    await dbConnect();
    const { query, countryId, jurisdictionId, verifiedOnly = true } = filters;
    const results: SearchResult[] = [];

    if (!query || query.trim().length === 0) return [];

    /* 
      ATLAS SEARCH CONFIGURATION (Requires MongoDB Atlas):
      
      Index Name: "default"
      Definition:
      {
        "mappings": {
          "dynamic": false,
          "fields": {
            "title": { "type": "string", "analyzer": "lucene.standard", "multi": { "keyword": { "type": "string", "analyzer": "lucene.keyword" } } },
            "summary": { "type": "string", "analyzer": "lucene.standard" },
            "country": { "type": "objectId" },
            "jurisdiction": { "type": "objectId" }
          }
        }
      }
    */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const atlasMust: any[] = [];
    
    // Fuzzy matching on text
    atlasMust.push({
      text: {
        query: query,
        path: ["title", "summary", "plainLanguageExplanation"],
        fuzzy: { maxEdits: 1 }
      }
    });

    if (countryId) {
      atlasMust.push({ equals: { path: "country", value: new mongoose.Types.ObjectId(countryId) } });
    }

    // 1. Search Laws via Atlas $search
    const laws = await Law.aggregate([
      {
        $search: {
          index: "default",
          compound: { must: atlasMust }
        }
      },
      { $limit: 20 }
    ]);

    // Populate missing jurisdiction (aggregate doesn't populate automatically)
    await Law.populate(laws, { path: 'jurisdiction', select: 'name slug level' });

    for (const law of laws) {
      if (verifiedOnly && !isRagEligible(law)) continue;

      let score = law.score || 0; // In a real atlas query with { $meta: "searchScore" }, we use that
      if (jurisdictionId && law.jurisdiction?._id?.toString() === jurisdictionId) score += 10;
      else if (countryId && law.country?.toString() === countryId) score += 5;

      results.push({
        type: 'law',
        id: law._id.toString(),
        canonicalRef: `law:${law._id.toString()}`,
        title: law.title,
        description: law.summary,
        jurisdiction: law.jurisdiction?.name || 'Unknown',
        jurisdictionId: law.jurisdiction?._id?.toString() || '',
        countryId: law.country?.toString() || '',
        url: `/law/${law.slug}`,
        score,
        verificationStatus: law.verificationStatus,
      });
    }

    // Procedures omitted for brevity, would follow the same pattern

    return results.sort((a, b) => b.score - a.score);
  }
}

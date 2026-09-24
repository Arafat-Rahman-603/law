export interface SearchFilters {
  query: string;
  countryId?: string;
  jurisdictionId?: string;
  categoryId?: string;
  verifiedOnly?: boolean;
}

export interface SearchResult {
  type: 'law' | 'procedure' | 'person' | 'organization';
  id: string; // Database ID
  canonicalRef: string; // e.g., "law:<id>" or "procedure:<id>"
  title: string;
  description: string;
  jurisdiction: string;
  jurisdictionId: string;
  countryId: string;
  url: string; // Deprecated for AI usage, but useful for UI fallback
  score: number;
  verificationStatus: string;
  lastVerifiedAt?: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any; // e.g. section IDs, version info
}

export interface SearchProvider {
  search(filters: SearchFilters): Promise<SearchResult[]>;
}

import { SearchFilters, SearchResult, SearchProvider } from './search/types';
import { MongoRegexProvider } from './search/mongo.provider';

import { AtlasSearchProvider } from './search/atlas.provider';

export class SearchServiceEngine implements SearchProvider {
  private activeProvider: SearchProvider;
  private fallbackProvider: SearchProvider;
  private isAtlasMode: boolean;

  constructor() {
    const providerConfig = process.env.SEARCH_PROVIDER || 'mongo';
    
    this.fallbackProvider = new MongoRegexProvider();
    this.isAtlasMode = providerConfig === 'atlas';
    
    if (this.isAtlasMode) {
      this.activeProvider = new AtlasSearchProvider();
    } else {
      this.activeProvider = this.fallbackProvider;
    }
  }

  async search(filters: SearchFilters): Promise<SearchResult[]> {
    if (this.isAtlasMode) {
      try {
        return await this.activeProvider.search(filters);
      } catch (error) {
        console.warn('Atlas Search failed, falling back to Mongo Regex Provider:', error);
        return this.fallbackProvider.search(filters);
      }
    }
    return this.activeProvider.search(filters);
  }
}

// Singleton instance
export const SearchService = new SearchServiceEngine();

export interface FetchResult {
  content: string;
  hash: string;
  fetchedAt: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}

export interface SourceFetcher {
  fetch(url: string): Promise<FetchResult>;
}

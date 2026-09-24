import crypto from 'crypto';
import { FetchResult, SourceFetcher } from './types';

export class HTTPFetcher implements SourceFetcher {
  async fetch(url: string): Promise<FetchResult> {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'AxiomixsLegalBot/1.0' }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }

      const content = await response.text();
      const hash = crypto.createHash('sha256').update(content).digest('hex');

      return {
        content,
        hash,
        fetchedAt: new Date(),
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`HTTPFetcher Error: ${error.message}`);
    }
  }
}

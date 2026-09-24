import { ILegalSource } from '@/models/LegalSource';

export interface FetchResult {
  contentHash: string;
  rawText?: string;
  documentUrl?: string;
  format: 'HTML' | 'PDF' | 'XML' | 'JSON' | 'TEXT';
  fetchMetadata?: any;
}

export interface NormalizedRecord {
  title: string;
  legalIdentifier: string;
  slug: string;
  summary: string;
  officialText: string;
  effectiveDate?: Date;
  status: string;
  language?: string;
  // If undefined, it means parser couldn't confidently extract it
}

export interface ParseResult {
  records: NormalizedRecord[];
  isPartial: boolean;
}

export interface SourceAdapter {
  /**
   * Identifies the parser version (e.g., '1.0.0'). Used to track changes in extraction logic.
   */
  parserVersion: string;

  /**
   * Validates if this adapter can handle the given source.
   */
  validateSource(source: ILegalSource): boolean;

  /**
   * Fetches the raw content from the official source.
   */
  fetch(source: ILegalSource): Promise<FetchResult>;

  /**
   * Computes a content hash from the raw text or document buffer.
   * Useful to detect if the source changed since the last fetch.
   */
  detectChanges(rawText: string, previousHash?: string): boolean;

  /**
   * Parses the raw content and extracts legal records.
   */
  parse(rawText: string, fetchMetadata?: any): Promise<ParseResult>;

  /**
   * Normalizes the parsed records into the platform schema format.
   * In many implementations, parse() and normalize() can be combined.
   */
  normalize(records: any[]): NormalizedRecord[];
}

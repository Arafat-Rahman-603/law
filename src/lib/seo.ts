import { VerificationStatus } from '@/models/LegalSource';

export interface SeoQualityCheck {
  isIndexable: boolean;
  reasons: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkSeoQualityGate(record: any): SeoQualityCheck {
  const reasons: string[] = [];

  if (!record) {
    return { isIndexable: false, reasons: ['Record is null or undefined'] };
  }

  // 1. Must be explicitly published
  if (record.verificationStatus !== VerificationStatus.PUBLISHED) {
    reasons.push(`Invalid verification status: ${record.verificationStatus}. Must be PUBLISHED.`);
  }

  // 2. Must not be a demo
  if (record.isDemo) {
    reasons.push('Record is flagged as demo content.');
  }

  // 3. Must not be superseded or archived
  if (record.isSuperseded || record.isArchived) {
    reasons.push('Record is superseded or archived.');
  }

  // 4. Meaningful content check (rough heuristic)
  const contentLen = (record.title?.length || 0) + (record.summary?.length || 0) + (record.plainLanguageExplanation?.length || 0);
  if (contentLen < 50) {
    reasons.push('Content is too thin to be indexable.');
  }

  // 5. Jurisdiction binding
  if (!record.country) {
    reasons.push('Record is missing country binding.');
  }

  // 6. Private fields check
  if (record.adminNotes || record.reviewerIdentity || record.evidenceUrls) {
    reasons.push('Record contains private admin/evidence fields.');
  }

  return {
    isIndexable: reasons.length === 0,
    reasons
  };
}

export function generateCanonical(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://law.axiomixs.com';
  // Strip trailing slashes and normalize
  const normalizedPath = path.replace(/\/+$/, '');
  return `${baseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
}

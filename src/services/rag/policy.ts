import { VerificationStatus } from '@/models/LegalSource';

export interface JurisdictionResolution {
  countryId: string;
  countryCode: string;
  jurisdictionId: string;
  jurisdictionPath?: string;
  locale: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRagEligible(record: any): boolean {
  if (!record) return false;

  const validStatuses = [
    VerificationStatus.PUBLISHED,
    VerificationStatus.APPROVED,
    VerificationStatus.SOURCE_VERIFIED,
    VerificationStatus.LEGAL_REVIEWED
  ];

  // 1. Must have a valid verification status
  if (!record.verificationStatus || !validStatuses.includes(record.verificationStatus)) {
    return false;
  }

  // 2. Must not be a draft or pending moderation
  if (record.verificationStatus === VerificationStatus.DRAFT || record.verificationStatus === VerificationStatus.REJECTED) {
    return false;
  }

  // 3. Prevent private admin notes/evidence from leaking
  if (record.adminNotes || record.evidenceUrls) {
    // If it's a complaint or review record that shouldn't be RAG sourced
    if (record.targetType || record.status === 'PENDING' || record.status === 'UNDER_REVIEW') {
      return false;
    }
  }

  // 4. Must not be marked as a demo fixture
  if (record.isDemo === true) {
    return false;
  }

  // 5. Must not be archived or superseded (unless explicitly building a historical feature)
  if (record.isArchived || record.isSuperseded) {
    return false;
  }

  return true;
}

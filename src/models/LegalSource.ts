import mongoose, { Document, Model, Schema } from 'mongoose';

export enum VerificationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  SOURCE_VERIFIED = 'SOURCE_VERIFIED',
  LEGAL_REVIEWED = 'LEGAL_REVIEWED',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  NEEDS_MORE_EVIDENCE = 'NEEDS_MORE_EVIDENCE',
  EXPIRED = 'EXPIRED',
  SUPERSEDED = 'SUPERSEDED',
  ARCHIVED = 'ARCHIVED',
  SOURCE_CONFLICT = 'SOURCE_CONFLICT',
  NEEDS_MORE_INFORMATION = 'NEEDS_MORE_INFORMATION',
}

export enum SourceStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  FAILED = 'FAILED',
  DISABLED = 'DISABLED',
  REQUIRES_REVIEW = 'REQUIRES_REVIEW',
}

export enum SourceType {
  GOVERNMENT = 'GOVERNMENT',
  MINISTRY = 'MINISTRY',
  COURT = 'COURT',
  OFFICIAL_GAZETTE = 'OFFICIAL_GAZETTE',
  REGULATORY_AUTHORITY = 'REGULATORY_AUTHORITY',
  OFFICIAL_LEGAL_DATABASE = 'OFFICIAL_LEGAL_DATABASE',
  OTHER = 'OTHER',
}

export interface ILegalSource extends Document {
  name: string;
  country: mongoose.Types.ObjectId;
  jurisdiction?: mongoose.Types.ObjectId;
  sourceType: SourceType;
  officialDomain: string;
  baseUrl: string;
  sourceUrl: string;
  authorityName: string;
  publicationFrequency?: string;
  lastCheckedAt?: Date;
  lastSuccessfulFetchAt?: Date;
  lastChangedAt?: Date;
  status: SourceStatus;
  verificationStatus: VerificationStatus;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  notes?: string;
  contentHash?: string;
  parserType?: string;
  ingestionEnabled: boolean;
  documentUrl?: string; // Cloudinary snapshot fallback
  createdAt: Date;
  updatedAt: Date;
}

const legalSourceSchema = new Schema<ILegalSource>(
  {
    name: { type: String, required: true },
    country: { type: Schema.Types.ObjectId, ref: 'Country', required: true, index: true },
    jurisdiction: { type: Schema.Types.ObjectId, ref: 'Jurisdiction', index: true },
    sourceType: { type: String, enum: Object.values(SourceType), required: true },
    officialDomain: { type: String, required: true },
    baseUrl: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    authorityName: { type: String, required: true },
    publicationFrequency: { type: String },
    lastCheckedAt: { type: Date },
    lastSuccessfulFetchAt: { type: Date },
    lastChangedAt: { type: Date },
    status: { type: String, enum: Object.values(SourceStatus), default: SourceStatus.REQUIRES_REVIEW },
    verificationStatus: { type: String, enum: Object.values(VerificationStatus), default: VerificationStatus.DRAFT },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    notes: { type: String },
    contentHash: { type: String },
    parserType: { type: String },
    ingestionEnabled: { type: Boolean, default: false },
    documentUrl: { type: String },
  },
  { timestamps: true }
);

const LegalSource: Model<ILegalSource> =
  mongoose.models.LegalSource || mongoose.model<ILegalSource>('LegalSource', legalSourceSchema);

export default LegalSource;


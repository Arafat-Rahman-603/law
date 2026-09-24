import mongoose, { Document, Model, Schema } from 'mongoose';
import { VerificationStatus } from './LegalSource';

export interface ILaw extends Document {
  legalIdentifier: string; // e.g. "Act No. 5 of 2006"
  title: string;
  slug: string;
  country: mongoose.Types.ObjectId;
  jurisdiction: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  summary: string;
  officialText: string;
  plainLanguageExplanation?: string;
  effectiveDate?: Date;
  amendmentDate?: Date;
  status: string; // e.g., "Active", "Repealed"
  source: mongoose.Types.ObjectId;
  verificationStatus: VerificationStatus;
  verifiedBy?: mongoose.Types.ObjectId;
  lastVerifiedAt?: Date;
  nextReviewAt?: Date;
  supersededBy?: mongoose.Types.ObjectId;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const lawSchema = new Schema<ILaw>(
  {
    legalIdentifier: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    country: { type: Schema.Types.ObjectId, ref: 'Country', required: true, index: true },
    jurisdiction: { type: Schema.Types.ObjectId, ref: 'Jurisdiction', required: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: 'LegalCategory', required: true, index: true },
    summary: { type: String, required: true },
    officialText: { type: String, required: true },
    plainLanguageExplanation: { type: String },
    effectiveDate: { type: Date },
    amendmentDate: { type: Date },
    status: { type: String, default: 'Active' },
    source: { type: Schema.Types.ObjectId, ref: 'LegalSource', required: true },
    verificationStatus: { type: String, enum: Object.values(VerificationStatus), default: VerificationStatus.DRAFT },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    lastVerifiedAt: { type: Date },
    nextReviewAt: { type: Date },
    supersededBy: { type: Schema.Types.ObjectId, ref: 'Law' },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Ensure a unique slug per jurisdiction
lawSchema.index({ jurisdiction: 1, slug: 1 }, { unique: true });

const Law: Model<ILaw> = mongoose.models.Law || mongoose.model<ILaw>('Law', lawSchema);

export default Law;

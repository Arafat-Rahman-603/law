import mongoose, { Document, Model, Schema } from 'mongoose';
import { VerificationStatus } from './LegalSource';

export interface ILegalProcedure extends Document {
  title: string;
  slug: string;
  country: mongoose.Types.ObjectId;
  jurisdiction: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  relatedLaws: mongoose.Types.ObjectId[];
  authority: mongoose.Types.ObjectId; // Organization (e.g. Police, Court)
  requirements: string[];
  processSteps: string[];
  documentsRequired: string[];
  fees?: string;
  source: mongoose.Types.ObjectId;
  verificationStatus: VerificationStatus;
  verifiedBy?: mongoose.Types.ObjectId;
  lastVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const legalProcedureSchema = new Schema<ILegalProcedure>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    country: { type: Schema.Types.ObjectId, ref: 'Country', required: true, index: true },
    jurisdiction: { type: Schema.Types.ObjectId, ref: 'Jurisdiction', required: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: 'LegalCategory', required: true },
    relatedLaws: [{ type: Schema.Types.ObjectId, ref: 'Law' }],
    authority: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    requirements: [{ type: String }],
    processSteps: [{ type: String }],
    documentsRequired: [{ type: String }],
    fees: { type: String },
    source: { type: Schema.Types.ObjectId, ref: 'LegalSource', required: true },
    verificationStatus: { type: String, enum: Object.values(VerificationStatus), default: VerificationStatus.DRAFT },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    lastVerifiedAt: { type: Date },
  },
  { timestamps: true }
);

legalProcedureSchema.index({ jurisdiction: 1, slug: 1 }, { unique: true });

const LegalProcedure: Model<ILegalProcedure> =
  mongoose.models.LegalProcedure || mongoose.model<ILegalProcedure>('LegalProcedure', legalProcedureSchema);

export default LegalProcedure;

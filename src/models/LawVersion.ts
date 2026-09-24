import mongoose, { Document, Model, Schema } from 'mongoose';
import { VerificationStatus } from './LegalSource';

export interface ILawVersion extends Document {
  law: mongoose.Types.ObjectId;
  version: number;
  officialText: string;
  summary: string;
  plainLanguageExplanation?: string;
  effectiveDate?: Date;
  amendmentDate?: Date;
  source: mongoose.Types.ObjectId;
  verificationStatus: VerificationStatus;
  verifiedBy?: mongoose.Types.ObjectId;
  changeSummary?: string; // What changed from the previous version
  createdAt: Date;
}

const lawVersionSchema = new Schema<ILawVersion>(
  {
    law: { type: Schema.Types.ObjectId, ref: 'Law', required: true, index: true },
    version: { type: Number, required: true },
    officialText: { type: String, required: true },
    summary: { type: String, required: true },
    plainLanguageExplanation: { type: String },
    effectiveDate: { type: Date },
    amendmentDate: { type: Date },
    source: { type: Schema.Types.ObjectId, ref: 'LegalSource', required: true },
    verificationStatus: { type: String, enum: Object.values(VerificationStatus), required: true },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    changeSummary: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

lawVersionSchema.index({ law: 1, version: 1 }, { unique: true });

const LawVersion: Model<ILawVersion> =
  mongoose.models.LawVersion || mongoose.model<ILawVersion>('LawVersion', lawVersionSchema);

export default LawVersion;

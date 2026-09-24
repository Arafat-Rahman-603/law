import mongoose, { Document, Model, Schema } from 'mongoose';

export enum DocumentPurpose {
  OFFICIAL_TEXT = 'OFFICIAL_TEXT',
  EVIDENCE = 'EVIDENCE',
  PROFILE_IMAGE = 'PROFILE_IMAGE',
  SOURCE_SNAPSHOT = 'SOURCE_SNAPSHOT',
}

export interface ILegalDocument extends Document {
  lawId?: mongoose.Types.ObjectId;
  versionId?: mongoose.Types.ObjectId;
  sourceId?: mongoose.Types.ObjectId;
  complaintId?: mongoose.Types.ObjectId;
  personId?: mongoose.Types.ObjectId;
  purpose: DocumentPurpose;
  isPublic: boolean;
  cloudinaryPublicId: string;
  secureUrl: string;
  format: string;
  size: number;
  hash: string;
  uploadedAt: Date;
  uploadedBy: mongoose.Types.ObjectId;
  verified: boolean;
  verifiedAt?: Date;
}

const legalDocumentSchema = new Schema<ILegalDocument>(
  {
    lawId: { type: Schema.Types.ObjectId, ref: 'Law' },
    versionId: { type: Schema.Types.ObjectId, ref: 'LawVersion' },
    sourceId: { type: Schema.Types.ObjectId, ref: 'LegalSource' },
    complaintId: { type: Schema.Types.ObjectId, ref: 'Complaint' },
    personId: { type: Schema.Types.ObjectId, ref: 'Person' },
    purpose: { type: String, enum: Object.values(DocumentPurpose), required: true },
    isPublic: { type: Boolean, default: false },
    cloudinaryPublicId: { type: String, required: true },
    secureUrl: { type: String, required: true },
    format: { type: String, required: true },
    size: { type: Number, required: true },
    hash: { type: String, required: true }, // For duplication check
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

const LegalDocument: Model<ILegalDocument> =
  mongoose.models.LegalDocument || mongoose.model<ILegalDocument>('LegalDocument', legalDocumentSchema);

export default LegalDocument;

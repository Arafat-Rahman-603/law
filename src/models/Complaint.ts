import mongoose, { Document, Model, Schema } from 'mongoose';

export enum ComplaintStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  NEEDS_EVIDENCE = 'NEEDS_EVIDENCE',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED',
  PUBLIC_REVIEWED = 'PUBLIC_REVIEWED',
}

export enum ComplaintCategory {
  INACCURATE_LEGAL_CONTENT = 'INACCURATE_LEGAL_CONTENT',
  OUTDATED_INFORMATION = 'OUTDATED_INFORMATION',
  FAKE_PROFESSIONAL = 'FAKE_PROFESSIONAL',
  IMPERSONATION = 'IMPERSONATION',
  MISCONDUCT = 'MISCONDUCT',
  SPAM = 'SPAM',
  PRIVACY_ISSUE = 'PRIVACY_ISSUE',
  INCORRECT_CONTACT = 'INCORRECT_CONTACT',
  OTHER = 'OTHER',
}

export interface IComplaint extends Document {
  reporter: mongoose.Types.ObjectId; // User making the complaint
  targetType: 'Law' | 'Person' | 'Organization' | 'LegalSource' | 'Review' | 'LegalProcedure' | 'Other';
  targetId?: mongoose.Types.ObjectId; // ID of the reported entity
  category: ComplaintCategory;
  jurisdiction: mongoose.Types.ObjectId;
  description: string;
  sanitizedDescription?: string; // Admin approved public description
  evidenceUrls: string[]; // Private Cloudinary URLs
  status: ComplaintStatus;
  isPubliclyVisible: boolean; // Only true if admin approves
  adminNotes?: string;
  reviewer?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new Schema<IComplaint>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetType: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId, index: true },
    category: { type: String, enum: Object.values(ComplaintCategory), required: true },
    jurisdiction: { type: Schema.Types.ObjectId, ref: 'Jurisdiction', required: true, index: true },
    description: { type: String, required: true },
    sanitizedDescription: { type: String },
    evidenceUrls: [{ type: String }],
    status: { type: String, enum: Object.values(ComplaintStatus), default: ComplaintStatus.SUBMITTED },
    isPubliclyVisible: { type: Boolean, default: false },
    adminNotes: { type: String, select: false }, // Keep private by default
    reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Complaint: Model<IComplaint> = mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', complaintSchema);

export default Complaint;

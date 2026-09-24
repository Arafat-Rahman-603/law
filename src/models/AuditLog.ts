import mongoose, { Document, Model, Schema } from 'mongoose';

export enum AuditAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REQUEST_CHANGES = 'REQUEST_CHANGES',
  REQUEST_EVIDENCE = 'REQUEST_EVIDENCE',
  REASSIGN = 'REASSIGN',
  MARK_CONFLICT = 'MARK_CONFLICT',
  SCHEDULE_REVIEW = 'SCHEDULE_REVIEW',
  PUBLISH = 'PUBLISH',
}

export interface IAuditLog extends Document {
  targetId: mongoose.Types.ObjectId;
  targetModel: 'Law' | 'LegalSource' | 'LegalProcedure' | 'Person' | 'Organization';
  action: AuditAction;
  userId: mongoose.Types.ObjectId; // The reviewer
  reason?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    targetModel: { type: String, required: true },
    action: { type: String, enum: Object.values(AuditAction), required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

export default AuditLog;

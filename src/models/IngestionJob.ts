import mongoose, { Document, Model, Schema } from 'mongoose';

export enum IngestionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  NO_CHANGES = 'NO_CHANGES',
  PARTIAL_PARSE = 'PARTIAL_PARSE',
}

export interface IIngestionJob extends Document {
  source: mongoose.Types.ObjectId;
  status: IngestionStatus;
  startedAt: Date;
  completedAt?: Date;
  contentHash?: string;
  previousContentHash?: string;
  parserVersion: string;
  recordsDiscovered: number;
  draftsCreated: number;
  errorMessage?: string;
  errorDetails?: any;
  rawSnapshot?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ingestionJobSchema = new Schema<IIngestionJob>(
  {
    source: { type: Schema.Types.ObjectId, ref: 'LegalSource', required: true, index: true },
    status: { type: String, enum: Object.values(IngestionStatus), default: IngestionStatus.PENDING },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    contentHash: { type: String },
    previousContentHash: { type: String },
    parserVersion: { type: String, required: true },
    recordsDiscovered: { type: Number, default: 0 },
    draftsCreated: { type: Number, default: 0 },
    errorMessage: { type: String },
    errorDetails: { type: Schema.Types.Mixed },
    rawSnapshot: { type: Schema.Types.ObjectId, ref: 'RawSnapshot' },
  },
  { timestamps: true }
);

const IngestionJob: Model<IIngestionJob> =
  mongoose.models.IngestionJob || mongoose.model<IIngestionJob>('IngestionJob', ingestionJobSchema);

export default IngestionJob;

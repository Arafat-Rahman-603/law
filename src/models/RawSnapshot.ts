import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRawSnapshot extends Document {
  source: mongoose.Types.ObjectId;
  ingestionJob: mongoose.Types.ObjectId;
  sourceUrl: string;
  contentHash: string;
  format: string; // 'HTML', 'PDF', 'XML'
  parserVersion: string;
  rawText?: string; // For small HTML/Text payloads
  storageUrl?: string; // For Cloudinary/S3 references if large
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const rawSnapshotSchema = new Schema<IRawSnapshot>(
  {
    source: { type: Schema.Types.ObjectId, ref: 'LegalSource', required: true, index: true },
    ingestionJob: { type: Schema.Types.ObjectId, ref: 'IngestionJob', required: true },
    sourceUrl: { type: String, required: true },
    contentHash: { type: String, required: true, index: true },
    format: { type: String, required: true },
    parserVersion: { type: String, required: true },
    rawText: { type: String }, // Can be very large, exclude from default queries if needed
    storageUrl: { type: String },
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const RawSnapshot: Model<IRawSnapshot> =
  mongoose.models.RawSnapshot || mongoose.model<IRawSnapshot>('RawSnapshot', rawSnapshotSchema);

export default RawSnapshot;

import mongoose, { Document, Model, Schema } from 'mongoose';

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED',
  REMOVED = 'REMOVED',
}

export interface IReview extends Document {
  reviewer: mongoose.Types.ObjectId; // User leaving review
  targetPerson: mongoose.Types.ObjectId; // Verified professional being reviewed
  rating: number; // 1 to 5
  title?: string;
  comment?: string;
  dimensions?: {
    communication?: number;
    responsiveness?: number;
    professionalism?: number;
  };
  experienceDate?: Date;
  isAnonymous: boolean;
  status: ReviewStatus;
  moderatorNotes?: string;
  moderatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetPerson: { type: Schema.Types.ObjectId, ref: 'Person', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String },
    dimensions: {
      communication: { type: Number, min: 1, max: 5 },
      responsiveness: { type: Number, min: 1, max: 5 },
      professionalism: { type: Number, min: 1, max: 5 },
    },
    experienceDate: { type: Date },
    isAnonymous: { type: Boolean, default: true },
    status: { type: String, enum: Object.values(ReviewStatus), default: ReviewStatus.PENDING },
    moderatorNotes: { type: String, select: false },
    moderatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: 'submittedAt', updatedAt: 'updatedAt' } }
);

// Allow one review per professional per user
reviewSchema.index({ reviewer: 1, targetPerson: 1 }, { unique: true });

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;

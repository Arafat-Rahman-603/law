import mongoose, { Document, Model, Schema } from 'mongoose';

export enum NotificationType {
  LAW_UPDATED = 'LAW_UPDATED',
  LAW_REVIEWED = 'LAW_REVIEWED',
  COMPLAINT_UPDATED = 'COMPLAINT_UPDATED',
  REVIEW_MODERATED = 'REVIEW_MODERATED',
  PROFESSIONAL_VERIFIED = 'PROFESSIONAL_VERIFIED',
  SOURCE_CHANGED = 'SOURCE_CHANGED',
  AI_REPORT_RECEIVED = 'AI_REPORT_RECEIVED',
}

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId; // The recipient
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  targetId?: mongoose.Types.ObjectId;
  targetUrl?: string;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false, index: true },
    targetId: { type: Schema.Types.ObjectId },
    targetUrl: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;

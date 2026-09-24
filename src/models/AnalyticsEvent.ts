import mongoose, { Document, Model, Schema } from 'mongoose';

export enum AnalyticsEventType {
  PAGE_VIEW = 'PAGE_VIEW',
  LAW_VIEW = 'LAW_VIEW',
  SECTION_VIEW = 'SECTION_VIEW',
  CATEGORY_VIEW = 'CATEGORY_VIEW',
  SEARCH = 'SEARCH',
  SEARCH_RESULT_CLICK = 'SEARCH_RESULT_CLICK',
  AI_QUESTION = 'AI_QUESTION',
  AI_REPORT = 'AI_REPORT',
  PROFESSIONAL_PROFILE_VIEW = 'PROFESSIONAL_PROFILE_VIEW',
  PROCEDURE_VIEW = 'PROCEDURE_VIEW',
  COUNTRY_SELECTION = 'COUNTRY_SELECTION',
  JURISDICTION_SELECTION = 'JURISDICTION_SELECTION',
  REVIEW = 'REVIEW',
  COMPLAINT_SUBMISSION = 'COMPLAINT_SUBMISSION',
}

export interface IAnalyticsEvent extends Document {
  eventType: AnalyticsEventType;
  countryId?: mongoose.Types.ObjectId;
  jurisdictionId?: mongoose.Types.ObjectId;
  locale: string;
  targetId?: mongoose.Types.ObjectId; // E.g., LawId, ProcedureId
  targetModel?: string; // 'Law', 'LegalProcedure', etc.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  timestamp: Date;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    eventType: { type: String, enum: Object.values(AnalyticsEventType), required: true, index: true },
    countryId: { type: Schema.Types.ObjectId, ref: 'Country', index: true },
    jurisdictionId: { type: Schema.Types.ObjectId, ref: 'Jurisdiction', index: true },
    locale: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId },
    targetModel: { type: String },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timeseries: { timeField: 'timestamp', metaField: 'metadata', granularity: 'hours' } }
);

const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent || mongoose.model<IAnalyticsEvent>('AnalyticsEvent', analyticsEventSchema);

export default AnalyticsEvent;

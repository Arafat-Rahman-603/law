import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISearchLog extends Document {
  query: string;
  countryId?: mongoose.Types.ObjectId;
  jurisdictionId?: mongoose.Types.ObjectId;
  resultCount: number;
  isZeroResult: boolean;
  locale: string;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const searchLogSchema = new Schema<ISearchLog>(
  {
    query: { type: String, required: true, index: true },
    countryId: { type: Schema.Types.ObjectId, ref: 'Country' },
    jurisdictionId: { type: Schema.Types.ObjectId, ref: 'Jurisdiction' },
    resultCount: { type: Number, required: true },
    isZeroResult: { type: Boolean, required: true, index: true },
    locale: { type: String, default: 'en' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const SearchLog: Model<ISearchLog> = mongoose.models.SearchLog || mongoose.model<ISearchLog>('SearchLog', searchLogSchema);

export default SearchLog;

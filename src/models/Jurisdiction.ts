import mongoose, { Document, Model, Schema } from 'mongoose';

export enum JurisdictionLevel {
  STATE = 'STATE', // State/Region/Province
  DISTRICT = 'DISTRICT', // District/County
  CITY = 'CITY', // City/Municipality
}

export interface IJurisdiction extends Document {
  country: mongoose.Types.ObjectId;
  parentJurisdiction?: mongoose.Types.ObjectId; // For hierarchy
  name: string;
  slug: string;
  level: JurisdictionLevel;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const jurisdictionSchema = new Schema<IJurisdiction>(
  {
    country: { type: Schema.Types.ObjectId, ref: 'Country', required: true, index: true },
    parentJurisdiction: { type: Schema.Types.ObjectId, ref: 'Jurisdiction', index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    level: { type: String, enum: Object.values(JurisdictionLevel), required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Ensure unique slug per country
jurisdictionSchema.index({ country: 1, slug: 1 }, { unique: true });

const Jurisdiction: Model<IJurisdiction> =
  mongoose.models.Jurisdiction || mongoose.model<IJurisdiction>('Jurisdiction', jurisdictionSchema);

export default Jurisdiction;

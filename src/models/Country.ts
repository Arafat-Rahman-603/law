import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICountry extends Document {
  code: string; // e.g. "bd", "es"
  name: string; // e.g. "Bangladesh", "Spain"
  defaultLanguage: string; // e.g. "es", "en", "bn"
  supportedLanguages: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const countrySchema = new Schema<ICountry>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    name: { type: String, required: true },
    defaultLanguage: { type: String, default: 'es' },
    supportedLanguages: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Country: Model<ICountry> = mongoose.models.Country || mongoose.model<ICountry>('Country', countrySchema);

export default Country;

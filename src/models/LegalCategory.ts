import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILegalCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parentCategory?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const legalCategorySchema = new Schema<ILegalCategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'LegalCategory' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const LegalCategory: Model<ILegalCategory> =
  mongoose.models.LegalCategory || mongoose.model<ILegalCategory>('LegalCategory', legalCategorySchema);

export default LegalCategory;

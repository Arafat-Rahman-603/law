import mongoose, { Document, Model, Schema } from 'mongoose';
import { VerificationStatus } from './LegalSource';

export enum ContactType {
  OFFICIAL_PHONE = 'OFFICIAL_PHONE',
  OFFICIAL_EMAIL = 'OFFICIAL_EMAIL',
  OFFICIAL_WEBSITE = 'OFFICIAL_WEBSITE',
  PUBLIC_OFFICE_ADDRESS = 'PUBLIC_OFFICE_ADDRESS',
}

export interface IPerson extends Document {
  firstName: string;
  lastName: string;
  slug: string;
  profession: string;
  organization?: mongoose.Types.ObjectId;
  country: mongoose.Types.ObjectId;
  jurisdiction: mongoose.Types.ObjectId;
  languages: string[];
  services: string[];
  contacts: {
    type: ContactType;
    value: string;
  }[];
  userId?: mongoose.Types.ObjectId;
  verificationStatus: VerificationStatus;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  verificationSource?: string;
  bio?: string;
  ratingAverage: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const personSchema = new Schema<IPerson>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    profession: { type: String, required: true },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
    country: { type: Schema.Types.ObjectId, ref: 'Country', required: true, index: true },
    jurisdiction: { type: Schema.Types.ObjectId, ref: 'Jurisdiction', required: true, index: true },
    languages: [{ type: String }],
    services: [{ type: String }],
    contacts: [
      {
        type: { type: String, enum: Object.values(ContactType), required: true },
        value: { type: String, required: true },
      },
    ],
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    verificationStatus: { type: String, enum: Object.values(VerificationStatus), default: VerificationStatus.DRAFT },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    verificationSource: { type: String },
    bio: { type: String },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Person: Model<IPerson> = mongoose.models.Person || mongoose.model<IPerson>('Person', personSchema);

export default Person;


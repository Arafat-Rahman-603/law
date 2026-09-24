import mongoose, { Document, Model, Schema } from 'mongoose';
import { VerificationStatus } from './LegalSource';
import { ContactType } from './Person';

export interface IOrganization extends Document {
  name: string;
  slug: string;
  type: string; // e.g. "Law Firm", "Legal Aid", "Government Ministry", "Court", "Police"
  country: mongoose.Types.ObjectId;
  jurisdiction: mongoose.Types.ObjectId;
  contacts: {
    type: ContactType;
    value: string;
  }[];
  services: string[];
  verificationStatus: VerificationStatus;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  verificationSource?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true },
    country: { type: Schema.Types.ObjectId, ref: 'Country', required: true, index: true },
    jurisdiction: { type: Schema.Types.ObjectId, ref: 'Jurisdiction', required: true, index: true },
    contacts: [
      {
        type: { type: String, enum: Object.values(ContactType), required: true },
        value: { type: String, required: true },
      },
    ],
    services: [{ type: String }],
    verificationStatus: { type: String, enum: Object.values(VerificationStatus), default: VerificationStatus.DRAFT },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    verificationSource: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

const Organization: Model<IOrganization> =
  mongoose.models.Organization || mongoose.model<IOrganization>('Organization', organizationSchema);

export default Organization;


import mongoose, { Document, Model, Schema } from 'mongoose';

export enum Role {
  USER = 'USER',
  VERIFIED_PROFESSIONAL = 'VERIFIED_PROFESSIONAL',
  MODERATOR = 'MODERATOR',
  LEGAL_REVIEWER = 'LEGAL_REVIEWER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface IUser extends Document {
  email: string;
  password?: string;
  name?: string;
  role: Role;
  countryPreference?: mongoose.Types.ObjectId;
  jurisdictionPreference?: mongoose.Types.ObjectId;
  languagePreference: string;
  isPublicProfile: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, select: false },
    name: { type: String },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    countryPreference: { type: Schema.Types.ObjectId, ref: 'Country' },
    jurisdictionPreference: { type: Schema.Types.ObjectId, ref: 'Jurisdiction' },
    languagePreference: { type: String, default: 'es' },
    isPublicProfile: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent re-compilation of the model if it already exists
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;

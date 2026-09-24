import { v2 as cloudinary } from 'cloudinary';
import { DocumentPurpose } from '@/models/LegalDocument';
import crypto from 'crypto';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const getCloudinaryFolder = (purpose: DocumentPurpose): string => {
  const baseFolder = process.env.CLOUDINARY_FOLDER || 'axiomixs-law';
  switch (purpose) {
    case DocumentPurpose.OFFICIAL_TEXT:
      return `${baseFolder}/official-text`;
    case DocumentPurpose.SOURCE_SNAPSHOT:
      return `${baseFolder}/source-snapshots`;
    case DocumentPurpose.EVIDENCE:
      return `${baseFolder}/evidence`;
    default:
      return `${baseFolder}/misc`;
  }
};

export const generateSignedUpload = (userId: string, purpose: DocumentPurpose) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = getCloudinaryFolder(purpose);
  
  // Enforce access control mapping (handled via signed preset or strict DB access)

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
      context: `uploader=${userId}|purpose=${purpose}`,
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
  };
};

export const deleteCloudinaryAsset = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary deletion failed:', error);
    throw error;
  }
};

export const verifyCloudinaryHash = (secureUrl: string): string => {
  return crypto.createHash('sha256').update(secureUrl).digest('hex');
};

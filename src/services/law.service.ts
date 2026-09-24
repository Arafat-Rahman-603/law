import dbConnect from '@/lib/db';
import Law, { ILaw } from '@/models/Law';
import LegalCategory, { ILegalCategory } from '@/models/LegalCategory';

export async function getCategories(): Promise<ILegalCategory[]> {
  await dbConnect();
  const categories = await LegalCategory.find({ isActive: true }).lean().exec();
  return JSON.parse(JSON.stringify(categories));
}

export async function getLawsByJurisdiction(jurisdictionId: string): Promise<ILaw[]> {
  await dbConnect();
  const laws = await Law.find({ jurisdiction: jurisdictionId })
    .populate('category')
    .lean()
    .exec();
  return JSON.parse(JSON.stringify(laws));
}

export async function getLawBySlug(jurisdictionId: string, slug: string): Promise<ILaw | null> {
  await dbConnect();
  const law = await Law.findOne({ jurisdiction: jurisdictionId, slug })
    .populate('category')
    .populate('source')
    .lean()
    .exec();
  if (!law) return null;
  return JSON.parse(JSON.stringify(law));
}

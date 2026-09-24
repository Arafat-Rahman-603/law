import dbConnect from '@/lib/db';
import Country, { ICountry } from '@/models/Country';
import Jurisdiction, { IJurisdiction } from '@/models/Jurisdiction';

export async function getCountries(): Promise<ICountry[]> {
  await dbConnect();
  // Using lean() for faster read-only execution since we pass this to Client Components
  const countries = await Country.find({ isActive: true }).lean().exec();
  return JSON.parse(JSON.stringify(countries)); // Serialize ObjectIds
}

export async function getCountryByCode(code: string): Promise<ICountry | null> {
  await dbConnect();
  const country = await Country.findOne({ code: code.toUpperCase(), isActive: true }).lean().exec();
  if (!country) return null;
  return JSON.parse(JSON.stringify(country));
}

export async function getJurisdictionsByCountry(countryId: string): Promise<IJurisdiction[]> {
  await dbConnect();
  const jurisdictions = await Jurisdiction.find({ country: countryId, isActive: true })
    .lean()
    .exec();
  return JSON.parse(JSON.stringify(jurisdictions));
}

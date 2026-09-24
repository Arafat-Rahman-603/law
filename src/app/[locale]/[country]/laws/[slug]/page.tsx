import { notFound, permanentRedirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Law from '@/models/Law';

interface Props {
  params: Promise<{ locale: string; country: string; slug: string }>;
}

export default async function LegacyLawRedirectPage({ params }: Props) {
  const { locale, country, slug } = await params;
  await dbConnect();

  const law = await Law.findOne({ slug })
    .populate('jurisdiction')
    .lean();

  if (!law) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jurSlug = (law.jurisdiction as any)?.slug;
  
  if (jurSlug) {
    permanentRedirect(`/${locale}/${country}/${jurSlug}/laws/${slug}`);
  } else {
    // If it's truly a country-wide law without a specific jurisdiction
    // It should theoretically still have a jurisdiction object (e.g. "national")
    // If not, we might need to handle it or redirect to a default
    permanentRedirect(`/${locale}/${country}/national/laws/${slug}`);
  }
}


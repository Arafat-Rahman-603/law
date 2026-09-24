import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Law from '@/models/Law';
import { VerificationStatus } from '@/models/LegalSource';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://law.axiomixs.com';
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let publishedLaws: any[] = [];
  try {
    await dbConnect();
    publishedLaws = await Law.find({
      verificationStatus: VerificationStatus.PUBLISHED,
      isDemo: { $ne: true }
    })
      .populate('country')
      .populate('jurisdiction')
      .lean();
  } catch (err) {
    console.warn('Sitemap generation bypassed DB connection (likely during build)', err);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sitemapEntries = publishedLaws.map((law: any) => {
    const countrySlug = law.country?.slug || 'unknown';
    const jurSlug = law.jurisdiction?.slug;
    
    const url = jurSlug 
      ? `${baseUrl}/en/${countrySlug}/${jurSlug}/laws/${law.slug}` 
      : `${baseUrl}/en/${countrySlug}/national/laws/${law.slug}`;

    return {
      url,
      lastModified: law.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en/chat`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...sitemapEntries,
  ];
}

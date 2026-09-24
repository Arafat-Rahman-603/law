import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Law from '@/models/Law';
import Jurisdiction from '@/models/Jurisdiction';
import { VerificationStatus } from '@/models/LegalSource';
import { CheckCircle, ArrowRight, ExternalLink, Calendar, MapPin, Scale } from 'lucide-react';
import Link from 'next/link';
import { checkSeoQualityGate, generateCanonical } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string; country: string; jurisdiction: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country, jurisdiction, slug } = await params;
  await dbConnect();

  const jurDoc = await Jurisdiction.findOne({ slug: jurisdiction }).lean();
  if (!jurDoc) return {};

  const law = await Law.findOne({ 
    slug, 
    jurisdiction: jurDoc._id,
    verificationStatus: VerificationStatus.PUBLISHED 
  }).lean();

  if (!law) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://law.axiomixs.com';
  const canonicalUrl = generateCanonical(`/${locale}/${country}/${jurisdiction}/laws/${slug}`);
  const seoCheck = checkSeoQualityGate(law);

  return {
    title: `${law.title} | ${jurDoc.name} | Axiomixs Law`,
    description: law.summary || law.title,
    robots: seoCheck.isIndexable ? 'index, follow' : 'noindex, nofollow',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'es': `${baseUrl}/es/${country}/${jurisdiction}/laws/${slug}`,
        'en': `${baseUrl}/en/${country}/${jurisdiction}/laws/${slug}`,
        'bn': `${baseUrl}/bn/${country}/${jurisdiction}/laws/${slug}`,
        'x-default': `${baseUrl}/es/${country}/${jurisdiction}/laws/${slug}`,
      }
    },
    openGraph: {
      title: `${law.title} - ${jurDoc.name}`,
      description: law.summary || law.title,
      url: canonicalUrl,
      type: 'article',
    }
  };
}

export default async function JurisdictionLawDetailPage({ params }: Props) {
  const { locale, country, jurisdiction, slug } = await params;
  await dbConnect();

  const jurDoc = await Jurisdiction.findOne({ slug: jurisdiction }).lean();
  if (!jurDoc) notFound();

  // SEO QUALITY GATE
  const law = await Law.findOne({ 
    slug, 
    jurisdiction: jurDoc._id,
    verificationStatus: VerificationStatus.PUBLISHED,
    isDemo: { $ne: true } 
  })
    .populate('jurisdiction')
    .lean();

  if (!law) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b py-6 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <nav className="flex text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href={`/${locale}/${country}`} className="hover:text-blue-600 transition-colors">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2">/</span>
                  <Link href={`/${locale}/${country}`} className="hover:text-blue-600 transition-colors uppercase">{country}</Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2">/</span>
                  <Link href={`/${locale}/${country}/${jurisdiction}`} className="hover:text-blue-600 transition-colors capitalize">{jurDoc.name}</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2">/</span>
                  <span className="text-gray-900 font-medium truncate max-w-[200px]">{law.title}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{law.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><MapPin size={16}/> {(law.jurisdiction as unknown as { name: string })?.name || jurDoc.name}</span>
                <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded font-medium"><CheckCircle size={16}/> Current Law</span>
                <span className="flex items-center gap-1"><Calendar size={16}/> Last verified: {new Date(law.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <Link 
              href={`/${locale}/chat?q=${encodeURIComponent('Explain ' + law.title + ' in ' + jurDoc.name)}`}
              className="shrink-0 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Ask AI <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Scale size={20} className="text-blue-600"/> Overview
            </h2>
            <div className="prose text-gray-700 leading-relaxed max-w-none">
              <p>{law.summary || 'No summary available.'}</p>
              
              {law.plainLanguageExplanation && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-2">Plain Language Explanation</h3>
                  <p className="text-blue-800">{law.plainLanguageExplanation}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
               Official Source
            </h3>
            <div className="text-sm text-gray-600 space-y-3">
              <p>This information is backed by verified official sources.</p>
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                 <span className="text-gray-500">Status</span>
                 <span className="font-medium text-green-700 flex items-center gap-1"><CheckCircle size={14}/> Verified</span>
              </div>
              <a href="#" className="flex items-center justify-center gap-2 w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors font-medium">
                View Official Document <ExternalLink size={14}/>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

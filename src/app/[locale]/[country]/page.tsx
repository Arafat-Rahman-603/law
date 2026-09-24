import { notFound } from 'next/navigation';
import { Scale, BookOpen, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import GlobalSearch from '@/components/search/GlobalSearch';
import dbConnect from '@/lib/db';
import Country from '@/models/Country';

interface Props {
  params: Promise<{
    locale: string;
    country: string;
  }>;
}

export default async function CountryHomepage({ params }: Props) {
  const resolvedParams = await params;
  const { locale, country } = resolvedParams;

  // Validate locale (Phase 6)
  if (!['es', 'en', 'bn'].includes(locale)) {
    notFound();
  }

  await dbConnect();
  const dbCountry = await Country.findOne({ code: country.toUpperCase(), isActive: true }).lean();
  const countryName = dbCountry ? dbCountry.name : 'Unknown';

  if (countryName === 'Unknown') {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar Mock */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container-page h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="text-gray-900" size={24} />
            <span className="font-bold text-lg tracking-tight">Axiomixs Law</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
              <span className="w-4 h-4 rounded-full bg-blue-600 inline-block"></span>
              {countryName}
            </div>
            <select className="bg-transparent border-none outline-none cursor-pointer hover:text-gray-900">
              <option value="es" selected={locale === 'es'}>ES</option>
              <option value="en" selected={locale === 'en'}>EN</option>
              <option value="bn" selected={locale === 'bn'}>BN</option>
            </select>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pb-24">
        {/* Search Hero */}
        <section className="bg-white py-16 md:py-24 border-b">
          <div className="container-page max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
              Verified legal information for {countryName}.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Search laws, legal problems, rights, or procedures. Source-grounded and jurisdiction-specific.
            </p>
            
            <GlobalSearch locale={locale} />
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-page">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Legal Categories in {countryName}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {['Criminal Law', 'Civil Law', 'Family Law', 'Property Law', 'Employment & Labor', 'Cyber Law', 'Consumer Rights', 'Legal Aid'].map((category) => (
                <a key={category} href={`/${locale}/${country}/${category.toLowerCase().replace(/ /g, '-')}`} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-900">{category}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Laws / Procedures */}
        <section className="py-16 bg-white border-t">
          <div className="container-page grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <FileText className="text-gray-900" />
                <h2 className="text-2xl font-bold text-gray-900">Popular Laws</h2>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Example Law Title {i}</h3>
                      <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">This is a summary of the law. It contains important verified information regarding rights and procedures...</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="text-gray-900" />
                <h2 className="text-2xl font-bold text-gray-900">Legal Procedures</h2>
              </div>
              <div className="space-y-4">
                {['How to file a police complaint', 'How to apply for legal aid', 'How to report cybercrime'].map((procedure, i) => (
                  <div key={i} className="group p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{procedure}</h3>
                      <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant CTA */}
        <section className="py-16 bg-gray-900 text-white my-8 mx-4 md:mx-auto max-w-6xl rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-blue-600/10 pointer-events-none"></div>
          <div className="container-page relative z-10 text-center py-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Have a specific legal question?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
              Our AI assistant can help you find and understand verified legal information specific to {countryName}.
            </p>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-blue-500 transition-colors shadow-lg hover:shadow-blue-600/25">
              Ask AI Assistant
            </button>
            <p className="text-xs text-gray-500 mt-6">
              This assistant provides legal information, not a substitute for a licensed legal professional.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12 text-center text-sm text-gray-500">
        <div className="container-page">
          <p>© {new Date().getFullYear()} Axiomixs Law. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <a href="#" className="hover:text-gray-900">Submit Information</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

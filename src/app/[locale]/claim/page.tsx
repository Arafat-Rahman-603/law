import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ClaimProfilePage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Claim Your Official Profile</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Axiomixs Law verifies all public legal professionals and government authorities to prevent impersonation and ensure public trust.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 md:p-8 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">The Verification Process</h2>
            <p className="text-gray-600 mb-6">Claiming a profile does not automatically grant access. Every request undergoes a manual identity and authority check.</p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Identity Submission</h3>
                  <p className="text-sm text-gray-600 mt-1">Submit your official bar association number, government ID, or official public office email address.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Evidence Review</h3>
                  <p className="text-sm text-gray-600 mt-1">Our moderation team securely reviews the provided evidence against official state/country registries.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Verified Access</h3>
                  <p className="text-sm text-gray-600 mt-1">Once approved, you gain control over your public information, services, and can respond to public reviews.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-900">Ready to begin verification?</p>
              <p className="text-sm text-gray-500">Requires a registered user account.</p>
            </div>
            <Link 
              href={`/${locale}/register?intent=claim`} 
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-center"
            >
              Start Verification
            </Link>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
           Your uploaded evidence is securely handled via Cloudinary signed-uploads and is strictly categorized as PRIVATE. It is never exposed on your public profile.
        </div>
      </div>
    </div>
  );
}

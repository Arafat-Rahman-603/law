import { Upload, Database, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminImportPage() {
  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Legal Data Onboarding</h2>
        <p className="text-gray-500">Import real, authoritative legal information from verified sources.</p>
        
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-amber-800">
          <AlertTriangle className="shrink-0" size={20} />
          <div>
            <h4 className="font-semibold text-sm">Strict Data Policy</h4>
            <p className="text-sm mt-1">
              Do not import fabricated, synthetic, or unverified legal information. Every import is explicitly marked as DRAFT and requires manual verification against its source authority before becoming searchable or accessible by RAG models.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link href="/admin/import/manual" className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileText size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Manual Entry</h3>
          <p className="text-sm text-gray-500">Create a single legal record via forms.</p>
        </Link>
        
        <button className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group text-left">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <Upload size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Bulk CSV / JSON</h3>
          <p className="text-sm text-gray-500">Import structured tabular legal data.</p>
        </button>

        <button className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group text-left">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <FileText size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">PDF Ingestion</h3>
          <p className="text-sm text-gray-500">Extract sections from official gazettes.</p>
        </button>

        <button className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group text-left">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <Database size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">API Source Sync</h3>
          <p className="text-sm text-gray-500">Pull from verified LegalSource endpoints.</p>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Coverage & Verification Queue</h3>
        <p className="text-sm text-gray-500 mb-6">Imported records await duplicate detection and source authority linkage.</p>
        
        <div className="space-y-4">
          {/* Example static dashboard */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
             <div className="flex items-center gap-3">
               <CheckCircle className="text-green-600" size={20}/>
               <div>
                 <p className="font-medium text-gray-900">24 Laws Pending Verification</p>
                 <p className="text-xs text-gray-500">From recent bulk import: Constitution of Bangladesh</p>
               </div>
             </div>
             <Link href="/admin/verification-queue" className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
               Review Pipeline
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

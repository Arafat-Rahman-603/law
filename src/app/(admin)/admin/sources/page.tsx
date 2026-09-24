import { ShieldCheck, Server, Globe, AlertTriangle } from 'lucide-react';
import dbConnect from '@/lib/db';
import LegalSource from '@/models/LegalSource';
import Link from 'next/link';

export default async function AdminSourcesPage() {
  await dbConnect();
  
  const sources = await LegalSource.find({}).sort({ updatedAt: -1 }).lean();

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real Legal Source Registry</h2>
          <p className="text-gray-500">Manage, verify, and test authoritative data sources.</p>
        </div>
        <Link href="/admin/sources/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
          + Add New Source
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Source Authority</th>
                <th className="px-6 py-4 font-semibold">Domain</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Health</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sources.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <ShieldCheck className="text-gray-300 mb-2" size={32} />
                      <p className="font-medium text-gray-900">No Authoritative Sources Configured</p>
                      <p className="text-xs mt-1 max-w-sm">You must configure and explicitly verify an official government or court source before any legal data can be imported or queried.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sources.map((source: any) => (
                  <tr key={source._id.toString()} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{source.name}</p>
                      <p className="text-xs text-gray-500">{source.authority} • {source.sourceType}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-gray-400" />
                        <span className="text-blue-600">{source.officialDomain}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {source.verificationStatus === 'VERIFIED' ? (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                           <ShieldCheck size={12}/> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                           Pending Verification
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Server size={14}/> Not Tested
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm text-blue-600 font-medium hover:text-blue-800">Manage</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 flex gap-3 text-sm">
         <AlertTriangle className="shrink-0" size={20}/>
         <p><strong>Security Notice:</strong> A source cannot become ingestion-enabled until a verified Administrator manually validates the official domain and sets the verification status. Do not allow arbitrary websites to become authoritative.</p>
      </div>
    </div>
  );
}

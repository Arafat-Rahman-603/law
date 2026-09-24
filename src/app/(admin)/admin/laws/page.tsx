import dbConnect from '@/lib/db';
import Law from '@/models/Law';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { VerificationStatus } from '@/models/LegalSource';

export default async function AdminLawsPage() {
  await dbConnect();
  
  // Note: Pagination and search params would be processed here in a full implementation.
  const laws = await Law.find({})
    .populate('jurisdiction', 'name')
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Legal Data CMS</h2>
          <p className="text-gray-500">Manage laws, sections, and legal records.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/laws/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={18} /> Add Law
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between bg-gray-50">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search laws by title, ID, or keyword..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2">
            <Filter size={18}/> Filters
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Jurisdiction</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Verification</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {laws.map((law: any) => (
                <tr key={law._id.toString()} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{law.title}</p>
                        <p className="text-xs text-gray-500">ID: {law._id.toString().substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{law.jurisdiction?.name || 'National'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">Active</span>
                  </td>
                  <td className="px-6 py-4">
                    {law.verificationStatus === VerificationStatus.PUBLISHED ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">Published</span>
                    ) : law.verificationStatus === VerificationStatus.DRAFT ? (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-medium">Draft</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">{law.verificationStatus}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/laws/${law._id.toString()}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {laws.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No legal records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

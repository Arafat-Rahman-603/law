import { Search, AlertTriangle, ChevronRight } from 'lucide-react';
import dbConnect from '@/lib/db';
import SearchLog from '@/models/SearchLog';

export default async function ZeroResultsDashboard() {
  await dbConnect();
  
  // Aggregate most common zero-result queries
  const commonZeroResults = await SearchLog.aggregate([
    { $match: { isZeroResult: true } },
    { $group: { _id: { query: "$query", locale: "$locale" }, count: { $sum: 1 }, lastSeen: { $max: "$createdAt" } } },
    { $sort: { count: -1 } },
    { $limit: 50 }
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Zero-Result Searches</h2>
        <p className="text-gray-500">Track what users are searching for when no verified information exists.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <AlertTriangle className="text-orange-500" size={20} />
            Missing Legal Content Queue
          </h3>
          <span className="text-sm text-gray-500">Prioritize based on search volume</span>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failed Query</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locale</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failed Attempts</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {commonZeroResults.map((log: any, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Search size={14} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">&quot;{log._id.query}&quot;</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                  {log._id.locale}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700">
                    {log.count} times
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.lastSeen).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  <button className="flex items-center hover:text-blue-800 transition-colors">
                    Add Content <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {commonZeroResults.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No zero-result searches recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

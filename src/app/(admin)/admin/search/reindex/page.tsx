import { RefreshCcw, Database, AlertTriangle } from 'lucide-react';

export default function SearchReindexPage() {
  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Search Index Synchronization</h2>
        <p className="text-gray-500">Manage vector and keyword index states across Search Providers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Database size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Atlas Search Provider</h3>
              <p className="text-xs text-gray-500">Vector & Keyword Hybrid</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Index Status</span>
              <span className="font-medium text-green-600">Connected (Auto-Sync)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pending Syncs</span>
              <span className="font-medium text-gray-900">0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sync Failures</span>
              <span className="font-medium text-gray-900">0</span>
            </div>
          </div>

          <button className="w-full py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <RefreshCcw size={16} /> Force Reindex All
          </button>
        </div>

        <div className="p-6 bg-amber-50 rounded-xl border border-amber-200 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-amber-800 mb-2">
            <AlertTriangle size={20} />
            <h3 className="font-bold">Index Failure Handling</h3>
          </div>
          <p className="text-sm text-amber-700 leading-relaxed mb-4">
            If a legal record successfully publishes to the MongoDB cluster but the search index fails to update, <strong>the database state is strictly preserved.</strong> The search pipeline will flag the record as <code>INDEX_SYNC_FAILED</code> and will retry automatically. 
          </p>
          <p className="text-sm text-amber-700 font-medium">
             Do not rollback the database record manually.
          </p>
        </div>
      </div>
    </div>
  );
}

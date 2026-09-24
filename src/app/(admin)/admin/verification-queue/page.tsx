import dbConnect from '@/lib/db';
import Law from '@/models/Law';
import LegalSource from '@/models/LegalSource';
import { VerificationStatus } from '@/models/LegalSource';
import { FileText, Database, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

export default async function VerificationQueuePage() {
  await dbConnect();
  
  // Aggregate pending items
  const pendingLaws = await Law.find({ 
    verificationStatus: { 
      $in: [VerificationStatus.SUBMITTED, VerificationStatus.UNDER_REVIEW, VerificationStatus.SOURCE_CONFLICT] 
    } 
  })
  .populate('jurisdiction', 'name')
  .limit(20)
  .lean();

  const pendingSources = await LegalSource.find({
    verificationStatus: { 
      $in: [VerificationStatus.SUBMITTED, VerificationStatus.UNDER_REVIEW] 
    }
  })
  .populate('jurisdiction', 'name')
  .limit(20)
  .lean();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Verification Queue</h2>
          <p className="text-gray-500">Human review required for pending legal data before publication.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center gap-1">
            <Clock size={14} />
            {pendingLaws.length + pendingSources.length} Pending
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LAWS QUEUE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              Pending Laws & Updates
            </h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {pendingLaws.map((law: any) => (
              <div key={law._id.toString()} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-900">{law.title}</h4>
                  {law.verificationStatus === VerificationStatus.SOURCE_CONFLICT ? (
                    <span className="px-2.5 py-0.5 rounded bg-red-100 text-red-800 text-xs font-semibold flex items-center gap-1"><ShieldAlert size={12}/> Conflict</span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">Review</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mb-3 flex gap-2">
                  <span>{law.jurisdiction?.name || 'Unknown'}</span> &bull; 
                  <span>Submitted: {new Date(law.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-end">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Review</button>
                </div>
              </div>
            ))}
            {pendingLaws.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                No pending laws
              </div>
            )}
          </div>
        </div>

        {/* SOURCES QUEUE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Database size={18} className="text-purple-600" />
              Pending Sources
            </h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {pendingSources.map((source: any) => (
              <div key={source._id.toString()} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-900">{source.name}</h4>
                  <span className="px-2.5 py-0.5 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">Review</span>
                </div>
                <div className="text-xs text-gray-500 mb-3 flex gap-2">
                  <span>{source.jurisdiction?.name || 'Unknown'}</span> &bull; 
                  <span>Type: {source.sourceType}</span>
                </div>
                <div className="flex justify-end">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Review</button>
                </div>
              </div>
            ))}
            {pendingSources.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                No pending sources
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

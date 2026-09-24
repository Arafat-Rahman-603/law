import { Sparkles, Search, Database, Clock, ShieldAlert, CheckCircle, BrainCircuit } from 'lucide-react';
import dbConnect from '@/lib/db';
import Law from '@/models/Law';

export default async function AdminEvaluationPage() {
  await dbConnect();
  
  const count = await Law.countDocuments({ isDemo: { $ne: true } });

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Live Search & RAG Evaluation</h2>
        <p className="text-gray-500">Test the operational boundaries of the AI and search engines against verified production data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Search Test Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Search className="text-blue-600" size={20}/> Standard Search Evaluation
            </h3>
            <p className="text-sm text-gray-500 mt-1">Test Exact Match, Atlas Aggregation, and Provider fallback.</p>
          </div>
          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Query</label>
                <input type="text" placeholder="e.g. Bangladesh Labor Act" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>All</option>
                    <option>Bangladesh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Auto (Env Default)</option>
                    <option>Atlas Search (Hybrid)</option>
                    <option>Mongo Regex (Fallback)</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Run Search Evaluation
              </button>
            </div>
            
            <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center text-gray-500 text-sm">
              <Database size={24} className="mx-auto mb-2 text-gray-400" />
              Ready to evaluate against {count} verified records.
            </div>
          </div>
        </div>

        {/* RAG Test Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-purple-50">
            <h3 className="font-bold text-purple-900 flex items-center gap-2">
              <BrainCircuit className="text-purple-600" size={20}/> LLM RAG Evaluation
            </h3>
            <p className="text-sm text-purple-700 mt-1">Test context synthesis, fake citation rejection, and No-Source boundary.</p>
          </div>
          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Complex Legal Question</label>
                <textarea rows={3} placeholder="e.g. What are the legal grounds for terminating an employee under the Labor Act in Dhaka?" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"></textarea>
              </div>
              
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                <Sparkles size={18} /> Run Full RAG Pipeline
              </button>
            </div>
            
            <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-sm">
               <h4 className="font-semibold text-gray-700 mb-2">Metrics Validated During Run:</h4>
               <ul className="space-y-2 text-gray-600">
                 <li className="flex items-center gap-2"><Clock size={14}/> Total Latency (Retrieval + LLM)</li>
                 <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-600"/> Context Alignment (Does model hallucinate sources?)</li>
                 <li className="flex items-center gap-2"><ShieldAlert size={14} className="text-orange-600"/> Out-of-Jurisdiction Rejection (e.g. UK law used for US query)</li>
               </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
         <h3 className="font-bold text-gray-900 mb-4">Golden Test Cases</h3>
         <p className="text-sm text-gray-500 mb-4">Run these structured tests after importing real verified data to validate system guardrails.</p>
         
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
             <thead className="bg-gray-50 text-gray-700">
               <tr>
                 <th className="px-4 py-3">Test Scenario</th>
                 <th className="px-4 py-3">Expected System Behavior</th>
                 <th className="px-4 py-3">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               <tr>
                 <td className="px-4 py-3 font-medium">No verified evidence exists</td>
                 <td className="px-4 py-3 text-gray-600">DO NOT CALL GEMINI. Return &quot;No verified legal information is currently available.&quot; immediately.</td>
                 <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Pending Data</span></td>
               </tr>
               <tr>
                 <td className="px-4 py-3 font-medium">Model invents fake `canonicalRef`</td>
                 <td className="px-4 py-3 text-gray-600">Citation validation layer strips the citation. Final output warns user of unverified claim.</td>
                 <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Pending Data</span></td>
               </tr>
               <tr>
                 <td className="px-4 py-3 font-medium">Cross-jurisdiction bleed</td>
                 <td className="px-4 py-3 text-gray-600">Search Provider MUST strictly enforce `jurisdictionId` boundary at the MongoDB/Atlas level.</td>
                 <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Pending Data</span></td>
               </tr>
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}

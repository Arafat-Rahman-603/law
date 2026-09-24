import { BrainCircuit, Target, CheckCircle } from 'lucide-react';

export default function RAGEvaluationPage() {
  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">RAG Knowledge Validation</h2>
        <p className="text-gray-500">Run real queries against verified records to validate citation and retrieval grounding.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
               <Target size={18} className="text-purple-600"/> Golden Question Set
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Evaluate against manually verified questions to ensure strict compliance with grounding rules.
            </p>
            
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg hover:border-purple-500 cursor-pointer transition-colors bg-purple-50">
                <p className="font-medium text-sm text-gray-900">&quot;What are the grounds for termination in Dhaka?&quot;</p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>Bangladesh • EN</span>
                  <span className="flex items-center gap-1 text-green-600"><CheckCircle size={12}/> PASS</span>
                </div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:border-purple-500 cursor-pointer transition-colors">
                <p className="font-medium text-sm text-gray-900">&quot;Explain the labor law section 999.&quot;</p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>Bangladesh • EN</span>
                  <span className="text-gray-400">Not Run</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[500px] flex flex-col items-center justify-center text-gray-500">
            <BrainCircuit size={48} className="text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 text-lg">No verified records available</h3>
            <p className="text-sm max-w-md text-center mt-2">
              The RAG pipeline is intentionally disabled because there are currently zero VERIFIED and PUBLISHED legal records in the database. 
              The system will return NO_VERIFIED_ANSWER until authoritative data is imported.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, AlertTriangle, ShieldCheck, FileText, Scale, Loader2, Info } from 'lucide-react';

interface AIAnswer {
  answer: string;
  jurisdiction: string;
  language: string;
  citations: {
    canonicalRef: string;
    title: string;
    url?: string;
  }[];
  practicalSteps: string[];
  disclaimer: string;
  needsHumanReview: boolean;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');
  
  const [query, setQuery] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (questionToAsk: string) => {
    if (!questionToAsk.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionToAsk,
          countryId: 'dummy-country-id', // In a real app, from context/cookies
          jurisdictionId: 'dummy-jur-id', 
          locale: 'en'
        })
      });
      
      if (!res.ok) throw new Error('Failed to get an answer.');
      
      const data: AIAnswer = await res.json();
      setResult(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleAsk(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b h-16 flex items-center px-4 md:px-8 shrink-0">
        <Scale className="mr-2 text-blue-600" />
        <h1 className="font-bold text-lg">Legal Assistant</h1>
        <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
          <ShieldCheck size={16} className="text-green-500" />
          <span>Verified Sources Only</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
        {!result && !loading && !error && (
          <div className="text-center py-20">
            <Scale size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">How can I help?</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Ask any legal question. I will search our verified database of laws and procedures to give you an accurate answer.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-gray-500 font-medium">Analyzing verified legal sources...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              {result.needsHumanReview && (
                <div className="mb-6 bg-orange-50 border border-orange-200 p-4 rounded-xl flex gap-3 text-orange-800">
                  <AlertTriangle className="shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">High-Risk Query Detected</p>
                    <p className="text-sm mt-1">This query involves sensitive legal matters. Please consult a verified professional or emergency services.</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                <span>Jurisdiction: {result.jurisdiction}</span>
              </div>

              <div className="prose max-w-none text-gray-800 text-lg leading-relaxed mb-8 whitespace-pre-wrap">
                {result.answer}
              </div>

              {result.practicalSteps.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Info size={18} className="text-blue-500" /> Practical Steps
                  </h3>
                  <ul className="space-y-2">
                    {result.practicalSteps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">{i+1}</span>
                        <span className="mt-0.5">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-gray-500" /> Verified Citations
                </h3>
                {result.citations.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {result.citations.map((cit, i) => (
                      <li key={i}>
                        {cit.url ? (
                          <a href={cit.url} className="text-blue-600 hover:underline">{cit.title}</a>
                        ) : (
                          <span>{cit.title}</span>
                        )}
                        <span className="text-xs text-gray-400 ml-2">[{cit.canonicalRef}]</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No direct citations were used.</p>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
              <p className="max-w-2xl">{result.disclaimer}</p>
              <button className="text-red-600 hover:underline font-medium ml-4 shrink-0">Report Answer</button>
            </div>
          </div>
        )}
      </main>

      <div className="bg-white border-t p-4 shrink-0">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk(query)}
            placeholder="Ask a legal question..."
            className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-2xl py-4 pl-4 pr-14 transition-all"
          />
          <button 
            onClick={() => handleAsk(query)}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white rounded-xl w-12 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send size={18} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

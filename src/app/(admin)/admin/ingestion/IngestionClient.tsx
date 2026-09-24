'use client';

import { useState } from 'react';

type Source = {
  id: string;
  name: string;
  officialDomain: string;
  status: string;
  verificationStatus: string;
  lastCheckedAt: string | null;
  lastSuccessfulFetchAt: string | null;
  lastChangedAt: string | null;
};

type Job = {
  id: string;
  sourceName: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  recordsDiscovered: number;
  draftsCreated: number;
  parserVersion: string;
  errorMessage?: string;
};

export default function IngestionClient({
  initialSources,
  initialJobs
}: {
  initialSources: Source[];
  initialJobs: Job[];
}) {
  const [sources, setSources] = useState(initialSources);
  const [jobs, setJobs] = useState(initialJobs);
  const [running, setRunning] = useState<Record<string, boolean>>({});

  const handleRunIngestion = async (sourceId: string) => {
    setRunning(prev => ({ ...prev, [sourceId]: true }));
    try {
      const res = await fetch('/api/admin/ingestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId })
      });
      const data = await res.json();
      
      if (!res.ok) {
        alert('Ingestion failed: ' + data.error);
      } else {
        alert(`Ingestion complete! Status: ${data.job.status}`);
        window.location.reload(); // Simple refresh to show new jobs
      }
    } catch (e: any) {
      alert('Error triggering ingestion: ' + e.message);
    } finally {
      setRunning(prev => ({ ...prev, [sourceId]: false }));
    }
  };

  return (
    <div className="space-y-8">
      {/* SOURCES TABLE */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold">Verified Sources</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Last Checked</th>
                <th className="px-4 py-3">Last Changed</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sources.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-4 text-center text-gray-500">No verified sources found.</td></tr>
              ) : sources.map(source => (
                <tr key={source.id} className="border-b">
                  <td className="px-4 py-3 font-medium">{source.name}</td>
                  <td className="px-4 py-3">{source.officialDomain}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {source.lastCheckedAt ? new Date(source.lastCheckedAt).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {source.lastChangedAt ? new Date(source.lastChangedAt).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRunIngestion(source.id)}
                      disabled={running[source.id]}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                    >
                      {running[source.id] ? 'Running...' : 'Run Now'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JOBS TABLE */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold">Recent Ingestion Jobs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Records</th>
                <th className="px-4 py-3">Drafts</th>
                <th className="px-4 py-3">Parser</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-4 text-center text-gray-500">No ingestion jobs run yet.</td></tr>
              ) : jobs.map(job => (
                <tr key={job.id} className="border-b">
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(job.startedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium">{job.sourceName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      job.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      job.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                      job.status === 'NO_CHANGES' ? 'bg-gray-100 text-gray-800' :
                      job.status === 'PARTIAL_PARSE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {job.status}
                    </span>
                    {job.errorMessage && (
                      <p className="text-xs text-red-500 mt-1">{job.errorMessage}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">{job.recordsDiscovered}</td>
                  <td className="px-4 py-3">{job.draftsCreated}</td>
                  <td className="px-4 py-3 text-gray-500">{job.parserVersion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

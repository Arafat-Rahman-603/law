import { aiProviderPool } from '@/lib/ai/providerPool';
import { Activity, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// Notice: In Next.js App Router, importing from lib like this in a server component 
// might instantiate a new pool on cold starts. In production, singleton state in serverless 
// environments is tricky, so this is mostly illustrative of the API contract.

export default function AIHealthDashboard() {
  // We're accessing the private state just for the dashboard view
  // In a real app we'd add a `getHealthStats()` method to the class
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const providers = (aiProviderPool as any).providers;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const failCounts = (aiProviderPool as any).failCounts;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">AI Provider Health</h2>
        <p className="text-gray-500">Monitor the health and fallback status of Gemini API providers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Configured Providers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{providers.length}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Activity size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failures</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {providers.map((provider: any) => {
              const fails = failCounts[provider.id] || 0;
              const isHealthy = fails < 3;
              
              return (
                <tr key={provider.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {provider.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {provider.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {provider.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isHealthy ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 gap-1 items-center">
                        <CheckCircle size={12} /> Healthy
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 gap-1 items-center">
                        <XCircle size={12} /> Failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fails} {fails >= 3 && <AlertTriangle size={14} className="inline text-orange-500 ml-1" />}
                  </td>
                </tr>
              );
            })}
            
            {providers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No Gemini providers configured. Set GEMINI_PROVIDER_1_KEY in environment variables.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

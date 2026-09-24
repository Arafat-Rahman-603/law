import { ShieldCheck, Activity, Globe, Database } from 'lucide-react';

export default async function DataQualityDashboard() {
  // In a real implementation, aggregate from MongoDB
  const mockCoverage = [
    { country: 'Bangladesh', jurisdictions: 1, categories: 0, laws: 0, procedures: 0, sources: 0 },
    { country: 'Spain', jurisdictions: 0, categories: 0, laws: 0, procedures: 0, sources: 0 },
    { country: 'Mexico', jurisdictions: 0, categories: 0, laws: 0, procedures: 0, sources: 0 },
    { country: 'United States', jurisdictions: 0, categories: 0, laws: 0, procedures: 0, sources: 0 }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Coverage & Data Quality Dashboard</h2>
        <p className="text-gray-500">Monitor the health, accuracy, and depth of real verified legal information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Verified Laws</h3>
            <ShieldCheck className="text-blue-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-xs text-gray-500 mt-2">Zero fabricated records</p>
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Authoritative Sources</h3>
            <Globe className="text-green-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-xs text-gray-500 mt-2">Pending ingestion setup</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Active Jurisdictions</h3>
            <Database className="text-purple-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">1</p>
          <p className="text-xs text-gray-500 mt-2">National/Federal tracking</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Data Warnings</h3>
            <Activity className="text-orange-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-xs text-gray-500 mt-2">Missing sources or conflicts</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Geographic Coverage</h3>
          <p className="text-sm text-gray-500">Verified data available per country</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Country</th>
                <th className="px-6 py-4 font-semibold">Coverage Status</th>
                <th className="px-6 py-4 font-semibold text-center">Verified Laws</th>
                <th className="px-6 py-4 font-semibold text-center">Procedures</th>
                <th className="px-6 py-4 font-semibold text-center">Sources</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockCoverage.map((item) => (
                <tr key={item.country}>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.country}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md border border-gray-200">
                      NOT_AVAILABLE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium">{item.laws}</td>
                  <td className="px-6 py-4 text-center font-medium">{item.procedures}</td>
                  <td className="px-6 py-4 text-center font-medium">{item.sources}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

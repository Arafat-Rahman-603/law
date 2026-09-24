import { FileText, Users, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Users', value: '12', icon: Users },
    { name: 'Verified Laws', value: '45', icon: ShieldCheck },
    { name: 'Pending Verification', value: '3', icon: FileText },
    { name: 'Active Complaints', value: '1', icon: AlertTriangle, color: 'text-red-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500">Welcome to the Axiomixs Law administration panel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 bg-gray-50 rounded-lg ${stat.color || 'text-blue-600'}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {/* Mock Activity Items */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {['U', 'L', 'S'][i-1]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {i === 1 ? 'New User Registered' : i === 2 ? 'Law Updated: Penal Code' : 'Source Verification Requested'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {i === 1 ? 'user@example.com' : i === 2 ? 'Section 302 amended' : 'Supreme Court of Bangladesh'}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{i * 2}h ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

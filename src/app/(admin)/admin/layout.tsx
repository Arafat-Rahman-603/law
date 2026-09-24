import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { LayoutDashboard, Users, BookOpen, FileText, Scale, Settings, Flag, LogOut, Activity, Search, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Double check authorization, even though middleware handles it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session.user as any).role;
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-4 h-16 flex items-center border-b border-gray-800">
          <Scale className="mr-2 text-blue-500" />
          <span className="font-bold text-lg">Axiomixs Admin</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800 text-white">
            <LayoutDashboard size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Content</p>
          </div>
          <Link href="/admin/laws" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <BookOpen size={18} />
            <span className="text-sm font-medium">Laws</span>
          </Link>
          <Link href="/admin/verification" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <FileText size={18} />
            <span className="text-sm font-medium">Verification Queue</span>
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Directory</p>
          </div>
          <Link href="/admin/people" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <Users size={18} />
            <span className="text-sm font-medium">People & Orgs</span>
          </Link>
          <Link href="/admin/complaints" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <Flag size={18} />
            <span className="text-sm font-medium">Complaints</span>
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Verification</p>
          </div>
          <Link href="/admin/verification-queue" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <ShieldCheck size={18} />
            <span className="text-sm font-medium">Review Queue</span>
          </Link>

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">System & Data</p>
          </div>
          <Link href="/admin/sources" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <BookOpen size={18} />
            <span className="text-sm font-medium">Data Sources</span>
          </Link>
          <Link href="/admin/ingestion" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <Activity size={18} />
            <span className="text-sm font-medium">Ingestion Engine</span>
          </Link>
          <Link href="/admin/ai-health" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <Activity size={18} />
            <span className="text-sm font-medium">AI Health</span>
          </Link>
          <Link href="/admin/zero-results" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <Search size={18} />
            <span className="text-sm font-medium">Zero Results</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
              {session.user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-400 truncate">{role}</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-gray-900">Admin Control Panel</h1>
        </header>
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEOHead from '@/components/SEO/SEOHead';
import { Search, RefreshCw, Mail, UserCheck, UserX, Calendar } from 'lucide-react';

interface Sub {
  id: string;
  email: string;
  frequency: string;
  active: boolean;
  createdAt: string;
}

interface Stats {
  totalActive: number;
  totalInactive: number;
  thisWeek: number;
  thisMonth: number;
}

const FREQ_LABELS: Record<string, string> = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function AdminNewsletter() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [subs, setSubs] = useState<Sub[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [freqFilter, setFreqFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '25',
      ...(search && { search }),
      ...(statusFilter && { status: statusFilter }),
      ...(freqFilter && { frequency: freqFilter }),
    });
    try {
      const res = await fetch(`/api/admin/newsletter?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSubs(data.subs);
      setTotal(data.total);
      setPages(data.pages);
      setStats(data.stats);
    } catch {
      showToast('Failed to load subscribers', false);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, freqFilter]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/auth/signin'); return; }
    if ((session.user as any)?.role !== 'admin') { router.push('/'); return; }
  }, [session, status, router]);

  useEffect(() => {
    if (session && (session.user as any)?.role === 'admin') fetchData();
  }, [session, fetchData]);

  useEffect(() => { setPage(1); }, [search, statusFilter, freqFilter]);

  const handleToggle = async (sub: Sub) => {
    setActionLoading(sub.id + '-toggle');
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sub.id, active: !sub.active }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.message || 'Error', false); return; }
      setSubs((prev) => prev.map((s) => s.id === sub.id ? { ...s, active: !sub.active } : s));
      fetchData();
      showToast(sub.active ? 'Subscriber deactivated' : 'Subscriber activated');
    } catch {
      showToast('Network error', false);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Permanently delete ${email}?`)) return;
    setActionLoading(id + '-delete');
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) { showToast('Error deleting', false); return; }
      setSubs((prev) => prev.filter((s) => s.id !== id));
      setTotal((t) => t - 1);
      fetchData();
      showToast('Subscriber deleted');
    } catch {
      showToast('Network error', false);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCSV = () => {
    const header = 'Email,Frequency,Status,Joined\n';
    const rows = subs.map((s) =>
      `${s.email},${s.frequency},${s.active ? 'active' : 'inactive'},${new Date(s.createdAt).toLocaleDateString()}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }
  if (!session || (session.user as any)?.role !== 'admin') return null;

  return (
    <>
      <SEOHead title="Admin — Newsletter" description="Manage newsletter subscribers" />

      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.ok ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                <Link href="/admin/users" className="hover:text-indigo-600">User Management</Link>
                <span>/</span>
                <span className="text-gray-600 font-medium">Newsletter</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">Newsletter Subscribers</h1>
              <p className="text-sm text-gray-500 mt-0.5">View and manage all newsletter subscriptions</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                disabled={subs.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40"
              >
                ↓ Export CSV
              </button>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Active Subscribers" value={stats.totalActive} icon={<UserCheck className="w-5 h-5 text-green-600" />} color="bg-green-50" />
              <StatCard label="Inactive" value={stats.totalInactive} icon={<UserX className="w-5 h-5 text-gray-500" />} color="bg-gray-100" />
              <StatCard label="New This Week" value={stats.thisWeek} icon={<Calendar className="w-5 h-5 text-indigo-600" />} color="bg-indigo-50" />
              <StatCard label="New This Month" value={stats.thisMonth} icon={<Mail className="w-5 h-5 text-purple-600" />} color="bg-purple-50" />
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={freqFilter}
              onChange={(e) => setFreqFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All frequencies</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <span className="text-sm text-gray-400 ml-auto">{total} subscriber{total !== 1 ? 's' : ''}</span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600" />
              </div>
            ) : subs.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <Mail className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-gray-400 text-sm">No subscribers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Frequency</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {subs.map((sub) => {
                      const toggleBusy = actionLoading === sub.id + '-toggle';
                      const deleteBusy = actionLoading === sub.id + '-delete';
                      return (
                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">
                                {sub.email[0].toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-gray-800">{sub.email}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                              {FREQ_LABELS[sub.frequency] || sub.frequency}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${sub.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sub.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                              {sub.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                            {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggle(sub)}
                                disabled={!!actionLoading}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                                  sub.active
                                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                }`}
                              >
                                {toggleBusy ? '…' : sub.active ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDelete(sub.id, sub.email)}
                                disabled={!!actionLoading}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-40"
                              >
                                {deleteBusy ? '…' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40">← Prev</button>
              <span className="text-sm text-gray-500">Page {page} of {pages}</span>
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40">Next →</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

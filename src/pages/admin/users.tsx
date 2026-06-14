import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import SEOHead from '@/components/SEO/SEOHead';
import { Search, RefreshCw, ShieldCheck, Users, UserX, UserCheck, AlertTriangle } from 'lucide-react';

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  frozen: boolean;
  emailVerified: string | null;
  createdAt: string;
  image: string | null;
}

interface Stats {
  total: number;
  admins: number;
  authors: number;
  frozen: number;
  unverified: number;
  thisWeek: number;
  dailySignups: { date: string; count: number }[];
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  author: 'bg-blue-100 text-blue-800',
  user: 'bg-gray-100 text-gray-700',
};

function StatCard({ label, value, sub, icon, color }: { label: string; value: number; sub?: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        {sub && <p className="text-xs text-indigo-600 font-semibold mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function MiniBar({ dailySignups }: { dailySignups: { date: string; count: number }[] }) {
  if (!dailySignups.length) return null;
  const max = Math.max(...dailySignups.map((d) => d.count), 1);
  const last7 = dailySignups.slice(-7);
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-semibold text-gray-700 mb-3">Signups — last 30 days</p>
      <div className="flex items-end gap-1 h-16">
        {dailySignups.map((d) => (
          <div
            key={d.date}
            className="flex-1 bg-indigo-100 rounded-t hover:bg-indigo-400 transition-colors relative group"
            style={{ height: `${Math.max(4, (d.count / max) * 100)}%` }}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-800 text-white text-xs rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
              {d.date.slice(5)}: {d.count}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>{dailySignups[0]?.date.slice(5)}</span>
        <span>{dailySignups[dailySignups.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '20',
      ...(search && { search }),
      ...(roleFilter && { role: roleFilter }),
      ...(statusFilter && { status: statusFilter }),
    });
    try {
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      showToast('Failed to load users', false);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) setStats(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/auth/signin'); return; }
    if ((session.user as any)?.role !== 'admin') { router.push('/'); return; }
    fetchStats();
  }, [session, status, router, fetchStats]);

  useEffect(() => {
    if (session && (session.user as any)?.role === 'admin') {
      fetchUsers();
    }
  }, [session, fetchUsers]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, roleFilter, statusFilter]);

  const handleFreeze = async (userId: string, frozen: boolean) => {
    setActionLoading(userId + '-freeze');
    try {
      const res = await fetch('/api/admin/freeze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, frozen }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.message || 'Error', false); return; }
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, frozen } : u));
      fetchStats();
      showToast(frozen ? 'Account frozen' : 'Account unfrozen');
    } catch {
      showToast('Network error', false);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    setActionLoading(userId + '-role');
    try {
      const res = await fetch('/api/admin/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.message || 'Error', false); return; }
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
      fetchStats();
      showToast(`Role changed to ${role}`);
    } catch {
      showToast('Network error', false);
    } finally {
      setActionLoading(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== 'admin') return null;

  const adminId = (session.user as any)?.id;

  return (
    <>
      <SEOHead title="Admin — User Management" description="Manage TrendLensX users" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white transition-all ${toast.ok ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">User Management</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage accounts, roles, and access</p>
            </div>
            <button
              onClick={() => { fetchUsers(); fetchStats(); }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard label="Total Users" value={stats.total} sub={`+${stats.thisWeek} this week`} icon={<Users className="w-5 h-5 text-indigo-600" />} color="bg-indigo-50" />
              <StatCard label="Admins" value={stats.admins} icon={<ShieldCheck className="w-5 h-5 text-purple-600" />} color="bg-purple-50" />
              <StatCard label="Authors" value={stats.authors} icon={<UserCheck className="w-5 h-5 text-blue-600" />} color="bg-blue-50" />
              <StatCard label="Frozen" value={stats.frozen} icon={<UserX className="w-5 h-5 text-red-500" />} color="bg-red-50" />
              <StatCard label="Unverified" value={stats.unverified} icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
            </div>
          )}

          {/* Chart */}
          {stats && <MiniBar dailySignups={stats.dailySignups} />}

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All roles</option>
              <option value="user">User</option>
              <option value="author">Author</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="frozen">Frozen</option>
              <option value="unverified">Unverified</option>
            </select>
            <span className="text-sm text-gray-400 ml-auto">{total} user{total !== 1 ? 's' : ''}</span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => {
                      const isSelf = user.id === adminId;
                      const freezeBusy = actionLoading === user.id + '-freeze';
                      const roleBusy = actionLoading === user.id + '-role';
                      return (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0 overflow-hidden">
                                {user.image ? (
                                  <img src={user.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  (user.name || user.email)[0].toUpperCase()
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{user.name || '—'}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                              </div>
                              {!user.emailVerified && user.role !== 'admin' && (
                                <span className="ml-1 text-xs bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5 font-medium">unverified</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {isSelf ? (
                              <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-700'}`}>
                                {user.role} (you)
                              </span>
                            ) : (
                              <select
                                value={user.role}
                                disabled={roleBusy}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-700'} disabled:opacity-50`}
                              >
                                <option value="user">user</option>
                                <option value="author">author</option>
                                <option value="admin">admin</option>
                              </select>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${user.frozen ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.frozen ? 'bg-red-500' : 'bg-green-500'}`} />
                              {user.frozen ? 'Frozen' : 'Active'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-5 py-4">
                            {isSelf ? (
                              <span className="text-xs text-gray-400 italic">—</span>
                            ) : (
                              <button
                                onClick={() => handleFreeze(user.id, !user.frozen)}
                                disabled={!!actionLoading || user.role === 'admin'}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                                  user.frozen
                                    ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                }`}
                                title={user.role === 'admin' ? 'Cannot freeze another admin' : ''}
                              >
                                {freezeBusy ? '…' : user.frozen ? 'Unfreeze' : 'Freeze'}
                              </button>
                            )}
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
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-500">Page {page} of {pages}</span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

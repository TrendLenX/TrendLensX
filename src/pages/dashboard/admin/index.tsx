import { GetServerSideProps } from 'next';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { prisma } from '@/lib/prisma';
import { UserIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  author: { name ? : string;image ? : string | null;role ? : string | null };
  stats: { users: number;authors: number;posts: number };
  users: any[];
  authors: any[];
}

export default function AdminDashboard({ author, stats, users, authors }: AdminDashboardProps) {
  const pieData = [
    { name: 'Users', value: stats.users },
    { name: 'Authors', value: stats.authors },
    { name: 'Posts', value: stats.posts },
  ];
  const COLORS = ['#6366F1', '#10B981', '#F59E0B'];
  
  return (
    <DashboardLayout author={author}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, authors, and site analytics.</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <UserIcon className="h-8 w-8 text-indigo-600" />
            <div><h2>Total Users</h2><p className="text-2xl font-bold">{stats.users}</p></div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <UserGroupIcon className="h-8 w-8 text-green-600" />
            <div><h2>Total Authors</h2><p className="text-2xl font-bold">{stats.authors}</p></div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <DocumentTextIcon className="h-8 w-8 text-yellow-600" />
            <div><h2>Total Posts</h2><p className="text-2xl font-bold">{stats.posts}</p></div>
          </div>
        </div>

        {/* Pie chart */}
        <section>
          <h2 className="text-xl font-bold mb-4">Site Overview</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Users table */}
        <section>
          <h2 className="text-xl font-bold mb-4">Recent Users</h2>
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead><tr><th>Email</th><th>Claps</th><th>Bookmarks</th></tr></thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.claps.length}</td>
                  <td className="px-4 py-2">{u.bookmarks.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Authors table */}
        <section>
          <h2 className="text-xl font-bold mb-4">Authors Overview</h2>
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead><tr><th>Name</th><th>Posts</th><th>Followers</th></tr></thead>
            <tbody>
              {authors.map((a: any) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2">{a.name}</td>
                  <td className="px-4 py-2">{a.posts.length}</td>
                  <td className="px-4 py-2">{a.followers.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => ctx.req.cookies,
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) => {
            ctx.res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`);
          });
        },
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }
  
  const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
  
  if (!admin || admin.role !== 'ADMIN') {
    return { redirect: { destination: '/dashboard', permanent: false } };
  }
  
  const users = await prisma.user.findMany({ include: { claps: true, bookmarks: true } });
  const authors = await prisma.user.findMany({
    where: { role: 'AUTHOR' },
    include: { posts: true, followers: true },
  });
  
  const stats = {
    users: users.length,
    authors: authors.length,
    posts: authors.reduce((sum, a) => sum + a.posts.length, 0),
  };
  
  return {
    props: {
      author: { name: admin.name, image: admin.image, role: admin.role },
      stats,
      users,
      authors,
    },
  };
};
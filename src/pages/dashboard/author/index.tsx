import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { prisma } from '@/lib/prisma';
import { DocumentTextIcon, EyeIcon, HandThumbUpIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AuthorDashboardProps {
  author: { name?: string; image?: string | null; role?: string | null };
  stats: { totalPosts: number; totalViews: number; totalClaps: number; totalFollowers: number };
  posts: any[];
}

export default function AuthorDashboard({ author, stats, posts }: AuthorDashboardProps) {
  return (
    <DashboardLayout author={author}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Author Dashboard</h1>
          <p className="text-gray-600">Manage your posts and track performance metrics.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
            <div><h2>Total Posts</h2><p className="text-2xl font-bold">{stats.totalPosts}</p></div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <EyeIcon className="h-8 w-8 text-indigo-600" />
            <div><h2>Views</h2><p className="text-2xl font-bold">{stats.totalViews}</p></div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <HandThumbUpIcon className="h-8 w-8 text-indigo-600" />
            <div><h2>Claps</h2><p className="text-2xl font-bold">{stats.totalClaps}</p></div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <UserGroupIcon className="h-8 w-8 text-indigo-600" />
            <div><h2>Followers</h2><p className="text-2xl font-bold">{stats.totalFollowers}</p></div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold mb-4">Views per Post</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={posts.map((p: any) => ({ title: p.title, views: p.views }))}>
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#6366F1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead><tr><th>Title</th><th>Views</th><th>Claps</th><th>Published</th></tr></thead>
            <tbody>
              {posts.map((post: any) => (
                <tr key={post.id} className="border-t">
                  <td className="px-4 py-2">{post.title}</td>
                  <td className="px-4 py-2">{post.views}</td>
                  <td className="px-4 py-2">{post.clapCount}</td>
                  <td className="px-4 py-2">{new Date(post.publishedAt).toLocaleDateString()}</td>
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
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session?.user) return { redirect: { destination: '/auth/signin', permanent: false } };

  const role = (session.user as any).role || '';
  if (role !== 'author' && role !== 'AUTHOR' && role !== 'admin' && role !== 'ADMIN') {
    return { redirect: { destination: '/dashboard', permanent: false } };
  }

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email! } });
  if (!dbUser) return { redirect: { destination: '/auth/signin', permanent: false } };

  const authorRecord = await prisma.author.findFirst({
    where: { email: session.user.email! },
    include: { posts: { orderBy: { publishedAt: 'desc' }, take: 5 }, follows: true },
  });

  const posts = authorRecord?.posts || [];
  const stats = {
    totalPosts: posts.length,
    totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0),
    totalClaps: posts.reduce((sum, p) => sum + (p.clapCount || 0), 0),
    totalFollowers: authorRecord?.follows?.length || 0,
  };

  return {
    props: {
      author: { name: session.user.name, image: session.user.image, role },
      stats,
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};

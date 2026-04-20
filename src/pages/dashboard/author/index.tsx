import { GetServerSideProps } from 'next';
import { createServerClient } from '@supabase/ssr';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { prisma } from '@/lib/prisma';
import { DocumentTextIcon, EyeIcon, HandThumbUpIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AuthorDashboardProps {
  author: { name ? : string;image ? : string | null;role ? : string | null };
  stats: { totalPosts: number;totalViews: number;totalClaps: number;totalFollowers: number };
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

        {/* Stats */}
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

        {/* Chart */}
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

        {/* Recent posts */}
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
  if (!session?.user) return { redirect: { destination: '/auth/signin', permanent: false } };
  
  const author = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { posts: { orderBy: { publishedAt: 'desc' }, take: 5 }, followers: true, claps: true },
  });
  
  if (!author) return { redirect: { destination: '/auth/signin', permanent: false } };
  
  const stats = {
    totalPosts: author.posts.length,
    totalViews: author.posts.reduce((sum, p) => sum + (p.views || 0), 0),
    totalClaps: author.claps.length,
    totalFollowers: author.followers.length,
  };
  
  return {
    props: {
      author: { name: author.name, image: author.image, role: author.role },
      stats,
      posts: author.posts || [],
    },
  };
};
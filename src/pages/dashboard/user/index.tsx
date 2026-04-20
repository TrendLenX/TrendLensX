import { GetServerSideProps } from 'next';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { prisma } from '@/lib/prisma';
import { HandThumbUpIcon, BookmarkIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface UserDashboardProps {
  author: { name ? : string;image ? : string | null;role ? : string | null };
  stats: { claps: number;bookmarks: number };
  goals: any[];
  achievements: any[];
  bookmarks: any[];
}

export default function UserDashboard({ author, stats, goals, achievements, bookmarks }: UserDashboardProps) {
  return (
    <DashboardLayout author={author}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Your Activity</h1>
          <p className="text-gray-600">Track your reading goals, claps, bookmarks, and achievements.</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <HandThumbUpIcon className="h-8 w-8 text-indigo-600" />
            <div><h2>Claps</h2><p className="text-2xl font-bold">{stats.claps}</p></div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <BookmarkIcon className="h-8 w-8 text-indigo-600" />
            <div><h2>Bookmarks</h2><p className="text-2xl font-bold">{stats.bookmarks}</p></div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <TrophyIcon className="h-8 w-8 text-indigo-600" />
            <div><h2>Achievements</h2><p className="text-2xl font-bold">{achievements.length}</p></div>
          </div>
        </div>

        {/* Chart */}
        <section>
          <h2 className="text-xl font-bold mb-4">Engagement Overview</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Claps', value: stats.claps },
                { name: 'Bookmarks', value: stats.bookmarks },
              ]}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Goals */}
        <section>
          <h2 className="text-xl font-bold mb-4">Reading Goals</h2>
          {goals.map((goal: any) => (
            <div key={goal.id} className="bg-white shadow rounded-lg p-6 mb-4">
              <p>{goal.type} goal: {goal.target} {goal.metric}</p>
              <p>Progress: {goal.current}/{goal.target}</p>
            </div>
          ))}
        </section>

        {/* Bookmarks */}
        <section>
          <h2 className="text-xl font-bold mb-4">Bookmarked Posts</h2>
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead><tr><th>Title</th><th>Date</th></tr></thead>
            <tbody>
              {bookmarks.map((b: any) => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-2">{b.post.title}</td>
                  <td className="px-4 py-2">{new Date(b.createdAt).toLocaleDateString()}</td>
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
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { claps: true, bookmarks: { include: { post: true } }, readingGoals: true, achievements: true },
  });
  
  if (!user) return { redirect: { destination: '/auth/signin', permanent: false } };
  
  const stats = { claps: user.claps.length || 0, bookmarks: user.bookmarks.length || 0 };
  
  return {
    props: {
      author: { name: user.name, image: user.image, role: user.role },
      stats,
      goals: user.readingGoals || [],
      achievements: user.achievements || [],
      bookmarks: user.bookmarks || [],
    },
  };
};
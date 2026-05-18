import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { prisma } from '@/lib/prisma';
import { DocumentTextIcon, EyeIcon, HandThumbUpIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Pencil, Trash2, Plus, ExternalLink } from 'lucide-react';

interface AuthorDashboardProps {
  author: { name?: string; image?: string | null; role?: string | null };
  stats: { totalPosts: number; totalViews: number; totalClaps: number; totalFollowers: number };
  posts: any[];
}

export default function AuthorDashboard({ author, stats, posts: initialPosts }: AuthorDashboardProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(p => p.filter(post => post.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <DashboardLayout author={author}>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Author Dashboard</h1>
            <p className="text-gray-600">Manage your posts and track performance metrics.</p>
          </div>
          <Link
            href="/dashboard/author/posts/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
            <div><h2 className="text-sm text-gray-500">Total Posts</h2><p className="text-2xl font-bold">{stats.totalPosts}</p></div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <EyeIcon className="h-8 w-8 text-indigo-600" />
            <div><h2 className="text-sm text-gray-500">Views</h2><p className="text-2xl font-bold">{stats.totalViews}</p></div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <HandThumbUpIcon className="h-8 w-8 text-indigo-600" />
            <div><h2 className="text-sm text-gray-500">Claps</h2><p className="text-2xl font-bold">{stats.totalClaps}</p></div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <UserGroupIcon className="h-8 w-8 text-indigo-600" />
            <div><h2 className="text-sm text-gray-500">Followers</h2><p className="text-2xl font-bold">{stats.totalFollowers}</p></div>
          </div>
        </div>

        {posts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Views per Post</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={posts.map((p: any) => ({ title: p.title.substring(0, 20) + '…', views: p.views }))}>
                  <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#6366F1" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Posts</h2>
            <Link
              href="/dashboard/author/posts/new"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              + Write a new post
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-12 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-6">Get started by writing your first post.</p>
              <Link
                href="/dashboard/author/posts/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" />
                Write First Post
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claps</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post: any) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 max-w-xs truncate">{post.title}</span>
                          {post.featured && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">Featured</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{post.category?.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{post.views ?? 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{post.clapCount ?? 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(post.publishedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/post/${post.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-gray-700 rounded"
                            title="View post"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/author/posts/${post.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 rounded"
                            title="Edit post"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            disabled={deleting === post.id}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded disabled:opacity-40"
                            title="Delete post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session?.user) return { redirect: { destination: '/auth/signin', permanent: false } };

  const role = (session.user as any).role || '';
  if (!['author', 'AUTHOR', 'admin', 'ADMIN'].includes(role)) {
    return { redirect: { destination: '/dashboard', permanent: false } };
  }

  const authorRecord = await prisma.author.findFirst({
    where: { email: session.user.email! },
    include: {
      posts: { orderBy: { publishedAt: 'desc' }, include: { category: true } },
      follows: true,
    },
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
      author: { name: session.user.name || null, image: session.user.image || null, role },
      stats,
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};

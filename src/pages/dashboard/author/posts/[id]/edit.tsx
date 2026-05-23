import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import MarkdownEditor from '@/components/Dashboard/MarkdownEditor';
import { Save, ArrowLeft, Clock, Eye } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { label: 'News', value: 'news' },
  { label: 'Finance', value: 'finance' },
  { label: 'Technology', value: 'technology' },
  { label: 'Education', value: 'education' },
  { label: 'Sports', value: 'sports' },
  { label: 'Lifestyle', value: 'lifestyle' },
  { label: 'Jobs', value: 'jobs' },
  { label: 'Scholarships', value: 'scholarships' },
];

interface EditPostPageProps {
  author: { name?: string; image?: string | null; role?: string | null };
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string | null;
    coverImage: string | null;
    featured: boolean;
    status: string;
    scheduledAt: string | null;
    metaTitle: string | null;
    metaDesc: string | null;
    isPremium: boolean;
    tags: { name: string }[];
    category: { slug: string };
  };
}

export default function EditPostPage({ author, post }: EditPostPageProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [content, setContent] = useState(post.content || '');
  const [coverImage, setCoverImage] = useState(post.coverImage || '');
  const [categorySlug, setCategorySlug] = useState(post.category.slug);
  const [tags, setTags] = useState(post.tags.map(t => t.name).join(', '));
  const [featured, setFeatured] = useState(post.featured);
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>(
    (post.status as any) || 'published'
  );
  const [scheduledAt, setScheduledAt] = useState(
    post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : ''
  );
  const [metaTitle, setMetaTitle] = useState(post.metaTitle || '');
  const [metaDesc, setMetaDesc] = useState(post.metaDesc || '');
  const [isPremium, setIsPremium] = useState(post.isPremium);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError('Title, excerpt, and content are required.');
      return;
    }
    if (status === 'scheduled' && !scheduledAt) {
      setError('Please set a scheduled publish date.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          coverImage,
          categorySlug,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          featured,
          status,
          scheduledAt: status === 'scheduled' ? scheduledAt : null,
          metaTitle: metaTitle || title,
          metaDesc: metaDesc || excerpt,
          isPremium,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update post');
      }

      const updated = await res.json();
      setSuccess('Post updated successfully!');

      if (status !== 'draft') {
        setTimeout(() => router.push(`/post/${updated.slug}`), 1000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout author={author}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/author" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
          </div>
          <button
            form="post-form"
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>}

        <form id="post-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter a compelling title..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt <span className="text-red-500">*</span></label>
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder="A short summary shown in listings..."
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={categorySlug}
                  onChange={e => setCategorySlug(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="AI, Technology, Innovation"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Publishing options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              {status === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="inline w-3.5 h-3.5 mr-1" />
                    Scheduled Date
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={e => setScheduledAt(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100">
              <label className="relative inline-flex items-center cursor-pointer gap-3">
                <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="text-sm font-medium text-gray-700">Featured post</span>
              </label>
              <label className="relative inline-flex items-center cursor-pointer gap-3">
                <input type="checkbox" checked={isPremium} onChange={e => setIsPremium(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                <span className="text-sm font-medium text-gray-700">Premium content</span>
              </label>
              <span className="text-xs text-gray-400 ml-auto">
                <Eye className="inline w-3.5 h-3.5 mr-1" />
                ~{readTime} min read · {wordCount} words
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Content <span className="text-red-500">*</span>
              <span className="ml-2 text-xs text-gray-400 font-normal">Markdown supported · Live preview</span>
            </label>
            <MarkdownEditor value={content} onChange={setContent} height={500} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={e => setMetaTitle(e.target.value)}
                  placeholder={title || 'SEO page title...'}
                  maxLength={60}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <p className="mt-1 text-xs text-gray-400">{(metaTitle || title).length}/60 characters</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                <textarea
                  value={metaDesc}
                  onChange={e => setMetaDesc(e.target.value)}
                  placeholder={excerpt || 'SEO description...'}
                  maxLength={160}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                />
                <p className="mt-1 text-xs text-gray-400">{(metaDesc || excerpt).length}/160 characters</p>
              </div>
            </div>
          </div>
        </form>
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

  const { id } = ctx.params!;
  const post = await prisma.post.findUnique({
    where: { id: id as string },
    include: { category: true, author: true, tags: true },
  });

  if (!post) return { notFound: true };

  const authorRecord = await prisma.author.findFirst({ where: { email: session.user.email! } });
  const isAdmin = ['admin', 'ADMIN'].includes(role);

  if (!isAdmin && post.authorId !== authorRecord?.id) {
    return { redirect: { destination: '/dashboard/author', permanent: false } };
  }

  return {
    props: {
      author: { name: session.user.name || null, image: session.user.image || null, role },
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};

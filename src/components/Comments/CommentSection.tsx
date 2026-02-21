import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: '', email: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: newComment.name,
      content: newComment.content,
      createdAt: new Date().toISOString(),
    };
    
    setComments([...comments, comment]);
    setNewComment({ name: '', email: '', content: '' });
    setIsSubmitting(false);
  };

  return (
    <section className="mt-12 pt-8 border-t">
      <h3 className="flex items-center text-2xl font-bold mb-6">
        <MessageSquare className="w-6 h-6 mr-2" />
        Comments ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your Name"
            value={newComment.name}
            onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
            required
            className="input-field"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={newComment.email}
            onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
            required
            className="input-field"
          />
        </div>
        <textarea
          placeholder="Write your comment..."
          value={newComment.content}
          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
          required
          rows={4}
          className="input-field resize-none"
        />
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Be the first to comment on this article!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

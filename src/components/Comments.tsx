'use client';

import { useEffect, useState } from 'react';

interface Comment {
    id: number;
    content: string;
    created_at: string;
}

interface CommentsProps {
    slug: string;
}

export default function Comments({ slug }: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch(`/api/comment/${slug}`)
            .then((res) => res.json())
            .then((data) => {
                setComments(data as Comment[]);
                setLoading(false);
            })
            .catch(console.error);
    }, [slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/comment/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment }),
            });

            if (res.ok) {
                setNewComment('');
                // Refresh comments
                const updatedComments = await fetch(`/api/comment/${slug}`).then((res) => res.json()) as Comment[];
                setComments(updatedComments);
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-8 border-t pt-8 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-4">Comments</h3>

            <form onSubmit={handleSubmit} className="mb-8">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave a comment..."
                    className="w-full p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    rows={3}
                    required
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {submitting ? 'Posting...' : 'Post Comment'}
                </button>
            </form>

            {loading ? (
                <div className="text-gray-500">Loading comments...</div>
            ) : (
                <div className="space-y-4">
                    {comments.length === 0 ? (
                        <div className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{comment.content}</p>
                                <div className="mt-2 text-xs text-gray-500">
                                    {new Date(comment.created_at).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

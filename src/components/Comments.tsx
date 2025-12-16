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
        <div className="mt-16 pt-12 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    Comments
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        {comments.length}
                    </span>
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="mb-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Leave a thought
                    </label>
                    <textarea
                        id="comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="What are your thoughts?"
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-y min-h-[120px] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Posting...
                            </>
                        ) : (
                            'Post Comment'
                        )}
                    </button>
                </div>
            </form>

            {loading ? (
                <div className="space-y-6 animate-pulse">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full" />
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                                <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-8">
                    {comments.length === 0 ? (
                        <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                            <p className="text-lg mb-2">No comments yet</p>
                            <p className="text-sm opacity-70">Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4 group">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-4 ring-white dark:ring-gray-900">
                                        {comment.content.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl rounded-tl-none hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all shadow-sm hover:shadow-md">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">Anonymous</span>
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-md">
                                                {new Date(comment.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import styles from './Comments.module.css';

interface Comment {
    id: number;
    content: string;
    created_at: string;
}

interface CommentsProps {
    slug: string;
}

export default function Comments({ slug }: CommentsProps) {
    const t = useTranslations('Blog.comments');
    const locale = useLocale();
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
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    {t('title')}
                    <span className={styles.count}>
                        {comments.length}
                    </span>
                </h3>
            </div>

            <form onSubmit={handleSubmit} className={styles.formCard}>
                <div className="mb-4">
                    <label htmlFor="comment" className={styles.label}>
                        {t('leaveThought')}
                    </label>
                    <textarea
                        id="comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={t('placeholder')}
                        className={styles.textarea}
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className={styles.submitButton}
                    >
                        {submitting ? t('posting') : t('post')}
                    </button>
                </div>
            </form>

            <div className="space-y-8">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">{t('loading')}</div>
                ) : comments.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p className="text-lg mb-2 font-medium">{t('emptyTitle')}</p>
                        <p className="opacity-70">{t('emptyDesc')}</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className={styles.commentItem}>
                            <div className={styles.avatar}>
                                {comment.content.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.commentContent}>
                                <div className={styles.commentHeader}>
                                    <span className={styles.author}>{t('anonymous')}</span>
                                    <span className={styles.date}>
                                        {new Date(comment.created_at).toLocaleDateString(locale, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <p className={styles.text}>
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

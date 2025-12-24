'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Article } from '@/lib/articles';
import styles from './ArticleList.module.css';
import { ConfirmDialog } from '../core/ConfirmDialog';

interface ArticleListProps {
    articles: Article[];
}

export const ArticleList: React.FC<ArticleListProps> = ({ articles: initialArticles }) => {
    const locale = useLocale();
    const t = useTranslations('Blog');
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [isAdmin, setIsAdmin] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json() as { authenticated: boolean };
                    setIsAdmin(data.authenticated);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            }
        };
        checkAuth();
    }, []);

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`/api/articles/${deleteId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setArticles(articles.filter(a => a.id !== deleteId));
            } else {
                const data = await res.json() as { error?: string };
                alert(data.error || 'Failed to delete article');
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Network error');
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className={styles.container}>
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title={t('delete')}
                description={t('deleteConfirm')}
            />
            <div className={styles.createButtonContainer}>
                <Link
                    href={`/${locale}/admin/create`}
                    className={styles.createButton}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                    {t('create')}
                </Link>
            </div>
            {articles.map((article) => (
                <article key={article.id} className={styles.card}>
                    <Link href={`/${locale}/blog/${article.id}`} className={styles.link}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h2 className={styles.title}>{article.title}</h2>
                            {isAdmin && (
                                <button
                                    onClick={(e) => handleDeleteClick(e, article.id)}
                                    className={styles.deleteButton}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        color: '#ef4444',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '0.25rem',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        zIndex: 10
                                    }}
                                    onMouseOver={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.2)';
                                    }}
                                    onMouseOut={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.1)';
                                    }}
                                >
                                    {t('delete')}
                                </button>
                            )}
                        </div>
                        <p className={styles.excerpt}>{article.excerpt}</p>
                        <div className={styles.meta}>
                            <time className={styles.date}>
                                {new Date(article.createdAt).toLocaleDateString(locale)}
                            </time>
                            <div className={styles.tags}>
                                {article.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>#{tag}</span>
                                ))}
                            </div>
                            <div className={styles.views} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                <span>{article.views?.toLocaleString() || 0}</span>
                            </div>
                        </div>
                    </Link>
                </article>
            ))}
        </div>
    );
};

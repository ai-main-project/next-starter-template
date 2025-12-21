import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Article } from '@/lib/articles';
import styles from './ArticleList.module.css';

interface ArticleListProps {
    articles: Article[];
}

export const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
    const locale = useLocale();

    return (
        <div className={styles.container}>
            {articles.map((article) => (
                <article key={article.id} className={styles.card}>
                    <Link href={`/blog/${article.id}`} className={styles.link}>
                        <h2 className={styles.title}>{article.title}</h2>
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

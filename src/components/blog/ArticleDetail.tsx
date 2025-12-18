'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Article } from '@/lib/articles';
import styles from './ArticleDetail.module.css';
import { Button } from '@/components/core/Button';
import BlogStats from '@/components/BlogStats';
import Comments from '@/components/Comments';
import 'highlight.js/styles/github-dark.css';

interface ArticleDetailProps {
    article: Article;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article }) => {
    const locale = useLocale();
    const t = useTranslations('Blog');

    return (
        <article className={styles.article}>
            {/* Hero Section */}
            <header className={styles.heroSection}>
                <div className={styles.heroBackground}>
                    {article.coverImage ? (
                        <img
                            src={article.coverImage}
                            alt={article.title}
                            className={styles.heroImage}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : null}
                </div>
                <div className={styles.heroOverlay} />

                <div className={styles.heroContent}>
                    {article.tags && article.tags.length > 0 && (
                        <div className={styles.tags}>
                            {article.tags.map(tag => (
                                <span key={tag} className={styles.tag}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1 className={styles.title}>
                        {article.title}
                    </h1>

                    <div className={styles.meta}>
                        <div className={styles.metaItem}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <time dateTime={article.createdAt}>
                                {new Date(article.createdAt).toLocaleDateString(locale, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        </div>
                        <div className={styles.metaItem}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                                {article.excerpt.length > 100 ? '5 min read' : '3 min read'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Card */}
            <div className={styles.contentContainer}>
                <div className={styles.card}>
                    <div className="mb-8">
                        <Link href="/blog" className={styles.backLink}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            {t('backToBlog')}
                        </Link>
                    </div>

                    <div className={`${styles.prose} prose prose-lg dark:prose-invert max-w-none`}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                                // Custom link renderer if needed
                                a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />
                            }}
                        >
                            {article.content}
                        </ReactMarkdown>
                    </div>

                    <div className={styles.statsContainer}>
                        <BlogStats slug={article.slug} />
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-12">
                    <Comments slug={article.slug} />
                </div>
            </div>
        </article>
    );
};

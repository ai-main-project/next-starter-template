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
        <article className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative w-full h-[60vh] min-h-[400px] flex items-end justify-center pb-12 mb-12">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {article.coverImage ? (
                        <>
                            <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-blue-100', 'to-purple-100', 'dark:from-blue-900/20', 'dark:to-purple-900/20');
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-[#0a0a0a] dark:via-[#0a0a0a]/50 dark:to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent dark:from-black/20 dark:to-transparent backdrop-blur-[2px]" />
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20" />
                    )}
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 max-w-4xl w-full px-4 text-center">
                    <div className="mb-6 flex flex-wrap justify-center gap-2">
                        {article.tags.map(tag => (
                            <span key={tag} className="px-4 py-1.5 text-sm font-medium bg-white/80 dark:bg-white/10 backdrop-blur-md border border-white/20 text-blue-600 dark:text-blue-300 rounded-full shadow-sm">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight tracking-tight drop-shadow-sm">
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-center gap-6 text-gray-600 dark:text-gray-300 text-sm md:text-base font-medium">
                        <time dateTime={article.createdAt} className="flex items-center gap-2">
                            <span className="opacity-70">Published</span>
                            {new Date(article.createdAt).toLocaleDateString(locale, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                        <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500" />
                        <span className="flex items-center gap-2">
                            <span className="opacity-70">Read time</span>
                            {article.excerpt.length > 100 ? '5 min' : '3 min'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4">
                {/* Back Button */}
                <div className="mb-12">
                    <Link href="/blog">
                        <Button variant="ghost" size="sm" className="group text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                            {t('backToBlog')}
                        </Button>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none 
                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white
                    prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                    prose-code:text-blue-600 dark:prose-code:text-blue-300 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                    prose-img:rounded-2xl prose-img:shadow-lg
                    mb-16">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                    >
                        {article.content}
                    </ReactMarkdown>
                </div>

                {/* Stats & Share */}
                <div className="border-t border-gray-100 dark:border-gray-800 py-8 mb-12">
                    <div className="flex justify-center">
                        <BlogStats slug={article.slug} />
                    </div>
                </div>

                {/* Comments */}
                <Comments slug={article.slug} />
            </div>
        </article>
    );
};

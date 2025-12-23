'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import styles from './FeaturedPosts.module.css';
import { Card } from '@/components/core/Card';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { Article } from '@/lib/articles';
import Image from 'next/image';

interface FeaturedPostsProps {
    posts: Article[];
}

export const FeaturedPosts = ({ posts }: FeaturedPostsProps) => {
    const t = useTranslations('Common');
    const locale = useLocale();

    if (posts.length === 0) {
        return null;
    }

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h2>{t('latestArticles')}</h2>
                        <p>{t('latestSubtitle')}</p>
                    </div>
                    <Link href={`/${locale}/blog`}>
                        <Button variant="ghost">{t('viewAll')}</Button>
                    </Link>
                </div>

                <div className={styles.grid}>
                    {posts.map((post) => (
                        <Link key={post.id} href={`/${locale}/blog/${post.id}`}>
                            <Card hoverable className={styles.postCard}>
                                <div className={styles.imageWrapper}>
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className={styles.placeholderCard}>
                                            <div className={styles.placeholderGradient} />
                                            <div className={styles.placeholderContent}>
                                                <h3 className={styles.placeholderTitle}>{post.title}</h3>
                                                <div className={styles.placeholderTags}>
                                                    {post.tags.slice(0, 2).map(tag => (
                                                        <span key={tag} className={styles.placeholderTag}>{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.meta}>
                                        {post.tags.slice(0, 2).map(tag => (
                                            <Badge key={tag}>{tag}</Badge>
                                        ))}
                                    </div>
                                    <h3 className={styles.title}>{post.title}</h3>
                                    <p className={styles.excerpt}>{post.excerpt}</p>
                                    <div className={styles.footer}>
                                        <span>
                                            {new Date(post.createdAt).toLocaleDateString(locale, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

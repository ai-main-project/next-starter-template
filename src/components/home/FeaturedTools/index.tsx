'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import styles from './FeaturedTools.module.css';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';

export const FeaturedTools = () => {
    const t = useTranslations('Common');
    const locale = useLocale();

    const tools = [
        {
            id: 'qrcode',
            title: t('qrCodeTool'),
            description: t('qrCodeDesc'),
            href: `/${locale}/tools/qrcode`,
            icon: '📱'
        }
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h2>{t('latestTools')}</h2>
                        <p>{t('toolsSubtitle')}</p>
                    </div>
                    <Link href={`/${locale}/tools`}>
                        <Button variant="ghost">{t('viewAll')}</Button>
                    </Link>
                </div>

                <div className={styles.grid}>
                    {tools.map((tool) => (
                        <Link key={tool.id} href={tool.href}>
                            <Card hoverable className={styles.postCard}>
                                <div className={styles.imageWrapper}>
                                    <div className={styles.placeholderCard}>
                                        <div className={styles.placeholderGradient} />
                                        <div className={styles.iconWrapper}>
                                            {tool.icon}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.content}>
                                    <h3 className={styles.title}>{tool.title}</h3>
                                    <p className={styles.excerpt}>{tool.description}</p>
                                    <div className={styles.footer}>
                                        <span>{t('tryNow')}</span>
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

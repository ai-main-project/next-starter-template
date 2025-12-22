'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import styles from './FeaturedGames.module.css';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';

export const FeaturedGames = () => {
    const t = useTranslations('Common');
    const tGames = useTranslations('Games');
    const locale = useLocale();

    const games = [
        {
            id: 'dino',
            title: tGames('dinoTitle'),
            description: tGames('dinoShort'),
            href: `/${locale}/games/dino`,
            icon: '🦖'
        },
        {
            id: 'keybeat',
            title: tGames('keybeatTitle'),
            description: tGames('keybeatShort'),
            href: `/${locale}/games/keybeat`,
            icon: '🎹'
        }
    ];

    return (
        <section className={styles.section} style={{ background: 'var(--bg-panel)' }}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h2>{t('latestGames')}</h2>
                        <p>{t('gamesSubtitle')}</p>
                    </div>
                    <Link href={`/${locale}/games`}>
                        <Button variant="ghost">{t('viewAll')}</Button>
                    </Link>
                </div>

                <div className={styles.grid}>
                    {games.map((game) => (
                        <Link key={game.id} href={game.href}>
                            <Card hoverable className={styles.postCard}>
                                <div className={styles.imageWrapper}>
                                    <div className={styles.placeholderCard}>
                                        <div className={styles.placeholderGradient} style={{ animationDuration: '20s', filter: 'hue-rotate(90deg)' }} />
                                        <div className={styles.iconWrapper}>
                                            {game.icon}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.content}>
                                    <h3 className={styles.title}>{game.title}</h3>
                                    <p className={styles.excerpt}>{game.description}</p>
                                    <div className={styles.footer}>
                                        <span>{t('playNow')}</span>
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

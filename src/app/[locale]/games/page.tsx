import React from 'react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Card } from '@/components/core/Card';
import styles from './page.module.css';

interface Props {
    params: Promise<{ locale: string }>;
}

export default async function GamesPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations('Games');

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('title')}</h1>
            <div className={styles.grid}>
                <Link href={`/${locale}/games/dino`} className={styles.link}>
                    <Card hoverable className={styles.cardContent}>
                        <h3>{t('dinoTitle')}</h3>
                        <p>{t('dinoShort')}</p>
                    </Card>
                </Link>
                <Link href={`/${locale}/games/keybeat`} className={styles.link}>
                    <Card hoverable className={styles.cardContent}>
                        <h3>{t('keybeatTitle')}</h3>
                        <p>{t('keybeatShort')}</p>
                    </Card>
                </Link>
            </div>
        </div>
    );
}

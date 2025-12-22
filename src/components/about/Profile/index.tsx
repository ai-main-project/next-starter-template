'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './Profile.module.css';
import { Card } from '@/components/core/Card';

export const Profile = () => {
    const t = useTranslations('About');

    return (
        <Card className={styles.profile}>
            <img
                src="https://assets.vistwang.com/header.jpg"
                alt="Vist's Avatar"
                className={styles.avatar}
            />
            <h1 className={styles.name}>Vist Wang</h1>
            <p className={styles.bio}>{t('bio1')}</p>
            <p className={styles.bio}>{t('bio2')}</p>
        </Card>
    );
};

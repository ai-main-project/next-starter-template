'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './Resume.module.css';

export const Resume = () => {
    const t = useTranslations('Resume');

    return (
        <section className={styles.resume}>
            <div className={styles.section}>
                <h2 className={styles.title}>{t('experience')}</h2>
                <div className={styles.item}>
                    <div className={styles.header}>
                        <h3 className={styles.role}>{t('roles.job1')}</h3>
                        <span className={styles.period}>2022 - {t('present')}</span>
                    </div>
                    <p className={styles.company}>{t('companies.job1')}</p>
                    <p className={styles.description}>
                        {t('descriptions.job1')}
                    </p>
                </div>
                <div className={styles.item}>
                    <div className={styles.header}>
                        <h3 className={styles.role}>{t('roles.job2')}</h3>
                        <span className={styles.period}>2020 - 2022</span>
                    </div>
                    <p className={styles.company}>{t('companies.job2')}</p>
                    <p className={styles.description}>
                        {t('descriptions.job2')}
                    </p>
                </div>
                <div className={styles.item}>
                    <div className={styles.header}>
                        <h3 className={styles.role}>{t('roles.job3')}</h3>
                        <span className={styles.period}>2017 - 2020</span>
                    </div>
                    <p className={styles.company}>{t('companies.job3')}</p>
                    <p className={styles.description}>
                        {t('descriptions.job3')}
                    </p>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.title}>{t('skills')}</h2>
                <div className={styles.skills}>
                    {['React', 'Angular2+', 'Vue', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Design Systems', 'Monorepo', 'Docker', 'Flutter', 'PostgreSQL'].map(skill => (
                        <span key={skill} className={styles.skill}>{skill}</span>
                    ))}
                </div>
            </div>
        </section>
    );
};

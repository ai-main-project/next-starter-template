'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './Contact.module.css';
import { Card } from '@/components/core/Card';

export const Contact = () => {
    const t = useTranslations('About');

    const links = [
        {
            label: 'GitHub',
            href: 'https://github.com/vistwang',
            icon: (
                <svg height="20" width="20" aria-hidden="true" viewBox="0 0 16 16" version="1.1" fill="currentColor" className={styles.icon}>
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
            )
        },
        {
            label: 'Twitter',
            href: 'https://x.com/vistwang',
            icon: (
                <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={styles.icon}>
                    <path d="M18.2438 2.25H21.5518L14.3253 10.5101L22.8273 21.75H16.1698L10.9563 14.9332L4.99026 21.75H1.67976L9.40976 12.9149L1.25301 2.25H8.08001L12.793 8.48126L18.2438 2.25ZM17.0828 19.77H18.9163L7.08401 4.12576H5.11651L17.0828 19.77Z"></path>
                </svg>
            )
        },
        {
            label: 'LinkedIn',
            href: 'https://www.linkedin.com/in/vistwang',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
            )
        },
    ];

    return (
        <Card className={styles.contact}>
            <h2 className={styles.title}>{t('connect')}</h2>
            <div className={styles.list}>
                {links.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.item}
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </a>
                ))}
            </div>
        </Card>
    );
};

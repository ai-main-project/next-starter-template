'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ToolsPage() {
    const t = useTranslations('Common');

    const tools = [
        {
            id: 'qrcode',
            title: t('qrCodeTool'),
            description: t('qrCodeDesc'),
            href: '/tools/qrcode',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <rect width="5" height="5" x="7" y="7" />
                    <path d="M7 17h.01" />
                    <path d="M17 17h.01" />
                    <path d="M17 7h.01" />
                </svg>
            )
        }
    ];

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                textAlign: 'center',
                background: 'linear-gradient(to right, #c084fc, #6366f1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
            }}>
                {t('tools')}
            </h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem',
                marginTop: '3rem'
            }}>
                {tools.map(tool => (
                    <Link
                        key={tool.id}
                        href={tool.href}
                        className="glass-panel"
                        style={{
                            padding: '2rem',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            color: 'inherit'
                        }}
                    >
                        <div style={{ color: 'var(--primary)' }}>{tool.icon}</div>
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{tool.title}</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                            {tool.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/core/Button';

export default function QRCodePage() {
    const t = useTranslations('Common');
    const [url, setUrl] = useState('');

    const downloadQRCode = () => {
        const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = 'qrcode.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <h1 style={{
                    fontSize: '2rem',
                    marginBottom: '2rem',
                    background: 'linear-gradient(to right, var(--color-primary), var(--color-accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    {t('qrCodeTool')}
                </h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={t('enterUrl')}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-glass)',
                                background: 'var(--bg-panel)',
                                color: 'var(--text-main)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{
                        padding: '2rem',
                        background: 'white',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <QRCodeCanvas
                            id="qr-code"
                            value={url || 'https://vist.blog'}
                            size={256}
                            level={"H"}
                            includeMargin={true}
                        />
                    </div>

                    <Button onClick={downloadQRCode} disabled={!url} style={{ width: 'fit-content' }}>
                        {t('download')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

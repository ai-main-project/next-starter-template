'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';

type QRType = 'text' | 'wifi' | 'vcard' | 'sms';
type ECCLevel = 'L' | 'M' | 'Q' | 'H';

const TabButton = ({ id, label, activeTab, onSelect }: { id: QRType, label: string, activeTab: QRType, onSelect: (id: QRType) => void }) => (
    <button
        onClick={() => onSelect(id)}
        style={{
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            background: activeTab === id ? 'var(--color-primary)' : 'transparent',
            color: activeTab === id ? 'var(--color-primary-foreground)' : 'var(--text-muted)',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
        }}
    >
        {label}
    </button>
);

const InputField = ({ label, placeholder, value, onChange, type = "text" }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)' }}>{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-glass)',
                background: 'var(--bg-panel)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                outline: 'none'
            }}
        />
    </div>
);

export default function QRCodePage() {
    const t = useTranslations('Common');
    const [activeTab, setActiveTab] = useState<QRType>('text');
    const [qrValue, setQrValue] = useState('');

    // Customization state
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [size, setSize] = useState(300);
    const [level, setLevel] = useState<ECCLevel>('H');
    const [logo, setLogo] = useState<string | null>(null);
    const [copyStatus, setCopyStatus] = useState(false);

    // Input fields state
    const [textInput, setTextInput] = useState('');
    const [wifi, setWifi] = useState({ ssid: '', password: '', encryption: 'WPA', hidden: false });
    const [vcard, setVcard] = useState({ firstName: '', lastName: '', mobile: '', email: '', company: '', job: '', url: '' });
    const [sms, setSms] = useState({ phone: '', message: '', type: 'sms' as 'sms' | 'mail', subject: '' });
    const [showSettings, setShowSettings] = useState(false);

    // Effect to construct string based on active type
    useEffect(() => {
        let value = '';
        switch (activeTab) {
            case 'text':
                value = textInput;
                break;
            case 'wifi':
                if (wifi.ssid) {
                    value = `WIFI:S:${wifi.ssid};T:${wifi.encryption};P:${wifi.password};H:${wifi.hidden};;`;
                }
                break;
            case 'vcard':
                if (vcard.firstName || vcard.lastName) {
                    value = `BEGIN:VCARD\nVERSION:3.0\nN:${vcard.lastName};${vcard.firstName}\nFN:${vcard.firstName} ${vcard.lastName}\nORG:${vcard.company}\nTITLE:${vcard.job}\nTEL;TYPE=CELL:${vcard.mobile}\nEMAIL:${vcard.email}\nURL:${vcard.url}\nEND:VCARD`;
                }
                break;
            case 'sms':
                if (sms.type === 'sms') {
                    value = `SMSTO:${sms.phone}:${sms.message}`;
                } else {
                    value = `mailto:${sms.phone}?subject=${encodeURIComponent(sms.subject)}&body=${encodeURIComponent(sms.message)}`;
                }
                break;
        }
        setQrValue(value);
    }, [activeTab, textInput, wifi, vcard, sms]);

    const downloadPNG = () => {
        const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = 'qrcode.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    const downloadSVG = () => {
        const svg = document.getElementById('qr-svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = svgUrl;
            downloadLink.download = 'qrcode.svg';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(svgUrl);
        }
    };

    const copyToClipboard = async () => {
        const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
        if (canvas) {
            try {
                canvas.toBlob(async (blob) => {
                    if (blob) {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        setCopyStatus(true);
                        setTimeout(() => setCopyStatus(false), 2000);
                    }
                });
            } catch (err) {
                console.error('Failed to copy image: ', err);
            }
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogo(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{
                fontSize: '2rem',
                marginBottom: '0.5rem',
                background: 'linear-gradient(to right, var(--color-primary), var(--color-accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                textAlign: 'center'
            }}>
                {t('qrCodeTool')}
            </h1>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>{t('qrCodeDesc')}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Header Actions: Tabs, Small Preview, and Settings */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '0.25rem',
                        background: 'var(--bg-panel)',
                        padding: '0.25rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-glass)',
                        overflowX: 'auto',
                        maxWidth: 'calc(100% - 100px)',
                        flex: 1
                    }}>
                        <TabButton id="text" label={t('tabs.text')} activeTab={activeTab} onSelect={setActiveTab} />
                        <TabButton id="wifi" label={t('tabs.wifi')} activeTab={activeTab} onSelect={setActiveTab} />
                        <TabButton id="vcard" label={t('tabs.vcard')} activeTab={activeTab} onSelect={setActiveTab} />
                        <TabButton id="sms" label={t('tabs.sms')} activeTab={activeTab} onSelect={setActiveTab} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {/* Inline QR Preview for Desktop */}
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: bgColor,
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--border-glass)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <QRCodeCanvas
                                value={qrValue || 'https://vist.blog'}
                                size={40}
                                level="L"
                                fgColor={fgColor}
                                bgColor={bgColor}
                            />
                        </div>

                        <Button
                            variant="secondary"
                            onClick={() => setShowSettings(!showSettings)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>⚙️</span> {t('customization.settings')}
                        </Button>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: showSettings ? '1fr 320px' : '1fr',
                    gap: '1.5rem',
                    alignItems: 'start',
                    transition: 'all 0.3s'
                }}>
                    {/* Main Content: Input and Bottom Preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Card style={{ padding: '1.5rem' }}>

                            {activeTab === 'text' && (
                                <InputField
                                    label={t('enterUrl')}
                                    value={textInput}
                                    onChange={setTextInput}
                                    placeholder="https://..."
                                />
                            )}

                            {activeTab === 'wifi' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <InputField label={t('wifi.ssid')} value={wifi.ssid} onChange={(v: string) => setWifi({ ...wifi, ssid: v })} />
                                    <InputField label={t('wifi.password')} value={wifi.password} onChange={(v: string) => setWifi({ ...wifi, password: v })} type="password" />
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>{t('wifi.encryption')}</label>
                                            <select
                                                value={wifi.encryption}
                                                onChange={(e) => setWifi({ ...wifi, encryption: e.target.value })}
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', background: 'var(--bg-panel)', color: 'var(--text-main)' }}
                                            >
                                                <option value="WPA">WPA/WPA2</option>
                                                <option value="WEP">WEP</option>
                                                <option value="nopass">{t('wifi.none')}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'vcard' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <InputField label={t('vcard.firstName')} value={vcard.firstName} onChange={(v: string) => setVcard({ ...vcard, firstName: v })} />
                                    <InputField label={t('vcard.lastName')} value={vcard.lastName} onChange={(v: string) => setVcard({ ...vcard, lastName: v })} />
                                    <InputField label={t('vcard.mobile')} value={vcard.mobile} onChange={(v: string) => setVcard({ ...vcard, mobile: v })} />
                                    <InputField label={t('vcard.email')} value={vcard.email} onChange={(v: string) => setVcard({ ...vcard, email: v })} />
                                    <InputField label={t('vcard.company')} value={vcard.company} onChange={(v: string) => setVcard({ ...vcard, company: v })} />
                                    <InputField label={t('vcard.url')} value={vcard.url} onChange={(v: string) => setVcard({ ...vcard, url: v })} />
                                </div>
                            )}

                            {activeTab === 'sms' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <button onClick={() => setSms({ ...sms, type: 'sms' })} style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', background: sms.type === 'sms' ? 'var(--color-primary)' : 'var(--bg-panel)', color: sms.type === 'sms' ? 'black' : 'inherit' }}>SMS</button>
                                        <button onClick={() => setSms({ ...sms, type: 'mail' })} style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', background: sms.type === 'mail' ? 'var(--color-primary)' : 'var(--bg-panel)', color: sms.type === 'mail' ? 'black' : 'inherit' }}>Email</button>
                                    </div>
                                    <InputField label={sms.type === 'sms' ? t('sms.phone') : t('vcard.email')} value={sms.phone} onChange={(v: string) => setSms({ ...sms, phone: v })} />
                                    {sms.type === 'mail' && <InputField label={t('sms.subject')} value={sms.subject} onChange={(v: string) => setSms({ ...sms, subject: v })} />}
                                    <InputField label={t('sms.message')} value={sms.message} onChange={(v: string) => setSms({ ...sms, message: v })} />
                                </div>
                            )}
                        </Card>

                        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '2rem'
                            }}>
                                <div style={{
                                    padding: '1rem',
                                    background: bgColor,
                                    borderRadius: 'var(--radius-lg)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    border: '1px solid var(--border-glass)'
                                }}>
                                    <QRCodeCanvas
                                        id="qr-canvas"
                                        value={qrValue || 'https://vist.blog'}
                                        size={Math.min(size, 300)}
                                        level={level}
                                        fgColor={fgColor}
                                        bgColor={bgColor}
                                        includeMargin={true}
                                        imageSettings={logo ? {
                                            src: logo,
                                            height: Math.min(size, 300) * 0.2,
                                            width: Math.min(size, 300) * 0.2,
                                            excavate: true,
                                        } : undefined}
                                    />
                                    {/* Hidden SVG for download */}
                                    <div style={{ display: 'none' }}>
                                        <QRCodeSVG
                                            id="qr-svg"
                                            value={qrValue || 'https://vist.blog'}
                                            size={size}
                                            level={level}
                                            fgColor={fgColor}
                                            bgColor={bgColor}
                                            imageSettings={logo ? {
                                                src: logo,
                                                height: size * 0.2,
                                                width: size * 0.2,
                                                excavate: true,
                                            } : undefined}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minWidth: '180px' }}>
                                    <Button onClick={downloadPNG} disabled={!qrValue} style={{ width: '100%' }}>
                                        {t('download')}
                                    </Button>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <Button onClick={downloadSVG} disabled={!qrValue} variant="secondary" style={{ flex: 1 }}>
                                            SVG
                                        </Button>
                                        <Button onClick={copyToClipboard} disabled={!qrValue} variant="secondary" style={{ flex: 1 }}>
                                            {copyStatus ? t('copied') : t('copyImage')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Side Settings Dashboard / Panel */}
                    {showSettings && (
                        <div style={{
                            position: 'sticky',
                            top: '2rem',
                            zIndex: 10
                        }}>
                            <Card style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>{t('customization.title')}</h3>
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}
                                    >✕</button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>{t('customization.fgColor')}</label>
                                        <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ width: '100%', height: '36px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>{t('customization.bgColor')}</label>
                                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: '100%', height: '36px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>{t('customization.size')}: {size}px</label>
                                    <input type="range" min="128" max="512" step="16" value={size} onChange={(e) => setSize(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>{t('customization.ecc')}</label>
                                    <select
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value as ECCLevel)}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', background: 'var(--bg-panel)', color: 'var(--text-main)', fontSize: '0.875rem' }}
                                    >
                                        <option value="L">{t('customization.low')}</option>
                                        <option value="M">{t('customization.medium')}</option>
                                        <option value="Q">{t('customization.quartile')}</option>
                                        <option value="H">{t('customization.high')}</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>{t('customization.logo')}</label>
                                    <div style={{
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        textAlign: 'center',
                                        border: '1px dashed var(--border-glass)'
                                    }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            id="logo-upload"
                                            hidden
                                        />
                                        <label htmlFor="logo-upload" style={{ cursor: 'pointer', display: 'block', padding: '0.25rem', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.875rem' }}>
                                            {logo ? t('save') : t('customization.logo')}
                                        </label>
                                        {logo && <button onClick={() => setLogo(null)} style={{ color: '#ef4444', background: 'none', border: 'none', fontSize: '0.75rem', cursor: 'pointer', marginTop: '0.25rem' }}>Remove</button>}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


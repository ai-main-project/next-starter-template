'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from './login.module.css';

export default function LoginPage() {
    const t = useTranslations('Auth');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                // Redirect to admin page
                router.push('/admin/create');
            } else {
                const data = await res.json() as any;
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>{t('loginTitle')}</h1>
                <p className={styles.subtitle}>{t('loginSubtitle')}</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            {t('password')}
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.button}
                    >
                        {isLoading ? t('loggingIn') : t('login')}
                    </button>
                </form>
            </div>
        </div>
    );
}

'use client';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import styles from './ArticleEditor.module.css';
import 'highlight.js/styles/github-dark.css';

export const ArticleEditor = () => {
    const t = useTranslations('Blog');
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [tags, setTags] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [autoSlug, setAutoSlug] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Auto-generate slug from title
    useEffect(() => {
        if (autoSlug && title) {
            const generatedSlug = title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            setSlug(generatedSlug);
        }
    }, [title, autoSlug]);

    // Calculate word count
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const charCount = content.length;

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!slug.trim()) {
            newErrors.slug = 'Slug is required';
        }
        if (!content.trim()) {
            newErrors.content = 'Content is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        // Simple toast implementation - you can replace with a proper toast library
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-weight: 600;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    };

    const handleSave = async () => {
        if (!validateForm()) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        setIsSaving(true);
        try {
            const article = {
                title,
                slug,
                content,
                excerpt,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            };

            const res = await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(article),
            });

            if (res.ok) {
                const savedArticle = await res.json() as any;
                showToast('Article saved successfully!', 'success');
                setTimeout(() => {
                    router.push(`/blog/${savedArticle.id}`);
                }, 1000);
            } else {
                const error = await res.json() as any;
                showToast(`Error: ${error.error || 'Failed to save article'}`, 'error');
            }
        } catch (error) {
            showToast('Network error. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.editor}>
                <h2 className={styles.heading}>{t('create')}</h2>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        {t('form.title')} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                        className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                        placeholder={t('placeholders.title')}
                        value={title}
                        onChange={e => {
                            setTitle(e.target.value);
                            if (errors.title) setErrors({ ...errors, title: '' });
                        }}
                    />
                    {errors.title && <span className={styles.errorText}>{errors.title}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        {t('form.slug')} <span style={{ color: '#ef4444' }}>*</span>
                        <span style={{ fontSize: '0.7rem', marginLeft: '0.5rem', opacity: 0.7 }}>
                            (Auto-generated)
                        </span>
                    </label>
                    <input
                        className={`${styles.input} ${errors.slug ? styles.inputError : ''}`}
                        placeholder={t('placeholders.slug')}
                        value={slug}
                        onChange={e => {
                            setSlug(e.target.value);
                            setAutoSlug(false);
                            if (errors.slug) setErrors({ ...errors, slug: '' });
                        }}
                        onFocus={() => setAutoSlug(false)}
                    />
                    {errors.slug && <span className={styles.errorText}>{errors.slug}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.excerpt')}</label>
                    <textarea
                        className={styles.textareaSmall}
                        placeholder={t('placeholders.excerpt')}
                        value={excerpt}
                        onChange={e => setExcerpt(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.tags')}</label>
                    <input
                        className={styles.input}
                        placeholder={t('placeholders.tags')}
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                    />
                    <span className={styles.hint}>Separate tags with commas</span>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        {t('form.content')} <span style={{ color: '#ef4444' }}>*</span>
                        <span className={styles.wordCount}>
                            {wordCount} words · {charCount} characters
                        </span>
                    </label>
                    <textarea
                        className={`${styles.textarea} ${errors.content ? styles.inputError : ''}`}
                        placeholder={t('placeholders.content')}
                        value={content}
                        onChange={e => {
                            setContent(e.target.value);
                            if (errors.content) setErrors({ ...errors, content: '' });
                        }}
                    />
                    {errors.content && <span className={styles.errorText}>{errors.content}</span>}
                </div>

                <button
                    className={styles.button}
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <span className={styles.spinner}></span>
                            {t('saving')}
                        </>
                    ) : (
                        t('save')
                    )}
                </button>
            </div>

            <div className={styles.previewContainer}>
                <h2 className={styles.heading}>{t('form.preview')}</h2>
                <div className={styles.preview}>
                    {content ? (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                        >
                            {content}
                        </ReactMarkdown>
                    ) : (
                        <div className={styles.emptyPreview}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p>Start writing to see preview...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

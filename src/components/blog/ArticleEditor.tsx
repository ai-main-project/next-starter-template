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
    const [coverImage, setCoverImage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
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
            newErrors.title = t('validation.titleRequired');
        }
        if (!slug.trim()) {
            newErrors.slug = t('validation.slugRequired');
        }
        if (!content.trim()) {
            newErrors.content = t('validation.contentRequired');
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset input value to allow re-uploading the same file if needed (though we block re-upload via UI)
        e.target.value = '';

        if (file.size > 5 * 1024 * 1024) {
            showToast(t('messages.imageSizeLimit'), 'error');
            return;
        }

        if (coverImage) {
            showToast(t('messages.singleImageOnly'), 'error');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json() as any;
                setCoverImage(data.url);
                showToast(t('messages.imageUploaded'), 'success');
            } else {
                const error = await res.json() as any;
                showToast(`${t('messages.uploadFailed')}${error.error}`, 'error');
            }
        } catch (error) {
            showToast(t('messages.uploadNetworkError'), 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setCoverImage('');
    };

    const handleSave = async () => {
        if (!validateForm()) {
            showToast(t('validation.fillRequired'), 'error');
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
                cover_image: coverImage,
            };

            const res = await fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(article),
            });

            if (res.ok) {
                const savedArticle = await res.json() as any;
                showToast(t('messages.articleSaved'), 'success');
                setTimeout(() => {
                    router.push(`/blog/${savedArticle.id}`);
                }, 1000);
            } else {
                const error = await res.json() as any;
                showToast(`${t('messages.saveError')}${error.error || t('messages.saveDefaultError')}`, 'error');
            }
        } catch (error) {
            showToast(t('messages.saveNetworkError'), 'error');
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
                            {t('form.autoGenerated')}
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
                    <span className={styles.hint}>{t('form.tagsHint')}</span>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('form.coverImage')}</label>
                    <div className={styles.imageUploadContainer}>
                        {!coverImage ? (
                            <div
                                className={styles.uploadDropzone}
                                onClick={() => document.getElementById('cover-image-upload')?.click()}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                    id="cover-image-upload"
                                />
                                <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <div style={{ textAlign: 'center' }}>
                                    <p className={styles.uploadText}>{isUploading ? t('form.uploading') : t('form.uploadButton')}</p>
                                    <p className={styles.uploadSubtext}>JPG, PNG, GIF up to 5MB</p>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.imagePreview}>
                                <img src={coverImage} alt="Cover" className={styles.previewImage} />
                                <div className={styles.previewOverlay}>
                                    <button
                                        onClick={handleRemoveImage}
                                        className={styles.removeButton}
                                    >
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        {t('form.removeImage')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        {t('form.content')} <span style={{ color: '#ef4444' }}>*</span>
                        <span className={styles.wordCount}>
                            {wordCount} {t('form.words')} · {charCount} {t('form.characters')}
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
                            <p>{t('form.emptyPreview')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

import { getArticles } from '@/lib/articles';
import { ArticleList } from '@/components/blog/ArticleList';
import { getTranslations } from 'next-intl/server';

export default async function BlogPage() {
    const articles = await getArticles();
    const t = await getTranslations('Blog');

    return (
        <div style={{ padding: '2rem 1rem' }}>
            <h1 style={{
                fontSize: '3rem',
                marginBottom: '3rem',
                textAlign: 'center',
                background: 'linear-gradient(to right, var(--color-primary), var(--color-accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
            }}>
                {t('title')}
            </h1>
            <ArticleList articles={articles} />
        </div>
    );
}

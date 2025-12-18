import { getArticleBySlug } from '@/lib/articles';
import { ArticleDetail } from '@/components/blog/ArticleDetail';
import { notFound } from 'next/navigation';

// export async function generateStaticParams() {
//     const articles = await getArticles();
//     return articles.map((article) => ({
//         slug: article.slug,
//     }));
// }

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    return (
        <div style={{ padding: '2rem 1rem' }}>
            <ArticleDetail article={article} />
        </div>
    );
}

import { getArticles } from '@/lib/articles';
import { ArticleList } from '@/components/blog/ArticleList';

import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'zh' }];
}

export default async function BlogPage() {
    const articles = await getArticles();

    // Debug info for Cloudflare deployment
    let debugInfo = null;
    if (articles.length === 0) {
        try {
            const cwd = process.cwd();
            const rootFiles = fs.readdirSync(cwd);
            const postsDir = path.join(cwd, 'posts');
            const postsFiles = fs.existsSync(postsDir) ? fs.readdirSync(postsDir) : 'Directory not found';

            debugInfo = {
                cwd,
                rootFiles,
                postsDirExists: fs.existsSync(postsDir),
                postsFiles
            };
        } catch (e) {
            debugInfo = { error: String(e) };
        }
    }

    return (
        <div style={{ padding: '2rem 1rem' }}>
            <h1 style={{
                fontSize: '3rem',
                marginBottom: '3rem',
                textAlign: 'center',
                background: 'linear-gradient(to right, #c084fc, #6366f1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
            }}>
                Blog
            </h1>
            {articles.length > 0 ? (
                <ArticleList articles={articles} />
            ) : (
                <div style={{ padding: '1rem', background: '#333', color: '#fff', borderRadius: '8px', overflow: 'auto' }}>
                    <h2>No articles found</h2>
                    <p>Debug Info:</p>
                    <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

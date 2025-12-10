import { ArticleEditor } from '@/components/blog/ArticleEditor';

export default function CreateArticlePage() {
    return (
        <main style={{
            minHeight: 'calc(100vh - var(--header-height))',
            paddingTop: '2rem'
        }}>
            <ArticleEditor />
        </main>
    );
}

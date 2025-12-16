import { Hero } from '@/components/home/Hero';
import { FeaturedPosts } from '@/components/home/FeaturedPosts';
import { getArticles } from '@/lib/articles';

export default async function Home() {
    const posts = await getArticles();
    const latestPosts = posts.slice(0, 3);

    return (
        <>
            <Hero />
            <FeaturedPosts posts={latestPosts} />
        </>
    );
}

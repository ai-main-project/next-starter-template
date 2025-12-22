import { Hero } from '@/components/home/Hero';
import { FeaturedPosts } from '@/components/home/FeaturedPosts';
import { FeaturedTools } from '@/components/home/FeaturedTools';
import { FeaturedGames } from '@/components/home/FeaturedGames';
import { getArticles } from '@/lib/articles';

export default async function Home() {
    const posts = await getArticles();
    const latestPosts = posts.slice(0, 3);

    return (
        <>
            <Hero />
            <FeaturedPosts posts={latestPosts} />
            <FeaturedTools />
            <FeaturedGames />
        </>
    );
}

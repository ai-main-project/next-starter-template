'use client';

import { useEffect, useState } from 'react';

interface BlogStatsProps {
    slug: string;
}

export default function BlogStats({ slug }: BlogStatsProps) {
    const [views, setViews] = useState<number | null>(null);
    const [likes, setLikes] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Increment view count
        fetch(`/api/view/${slug}`, { method: 'POST' }).catch(console.error);

        // Fetch stats
        fetch(`/api/stats/${slug}`)
            .then((res) => res.json())
            .then((data: any) => {
                setViews(data.views);
                setLikes(data.likes);
                setLoading(false);
            })
            .catch(console.error);
    }, [slug]);

    const handleLike = async () => {
        try {
            const res = await fetch(`/api/like/${slug}`, { method: 'POST' });
            if (res.ok) {
                setLikes((prev) => (prev !== null ? prev + 1 : 1));
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    if (loading) {
        return <div className="text-sm text-gray-500">Loading stats...</div>;
    }

    return (
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 my-4">
            <div className="flex items-center gap-1">
                <span>👁️</span>
                <span>{views} views</span>
            </div>
            <button
                onClick={handleLike}
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
            >
                <span>❤️</span>
                <span>{likes} likes</span>
            </button>
        </div>
    );
}

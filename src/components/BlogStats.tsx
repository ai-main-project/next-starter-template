'use client';

import { useEffect, useState } from 'react';

interface BlogStatsProps {
    slug: string;
}

export default function BlogStats({ slug }: BlogStatsProps) {
    const [views, setViews] = useState<number | null>(null);
    const [likes, setLikes] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiking, setIsLiking] = useState(false);

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
        if (isLiking) return;
        setIsLiking(true);
        try {
            const res = await fetch(`/api/like/${slug}`, { method: 'POST' });
            if (res.ok) {
                setLikes((prev) => (prev !== null ? prev + 1 : 1));
            }
        } catch (error) {
            console.error('Error liking post:', error);
        } finally {
            setIsLiking(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center gap-4 text-sm text-gray-500 animate-pulse">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 my-6 py-3 border-y border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2" title="Views">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="font-medium">{views?.toLocaleString() || 0}</span>
            </div>
            <button
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center gap-2 hover:text-red-500 transition-all active:scale-95 group"
                title="Like this post"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={likes ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform group-hover:scale-110 ${isLiking ? 'animate-bounce' : ''} ${likes ? 'text-red-500' : ''}`}
                >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span className="font-medium">{likes?.toLocaleString() || 0}</span>
            </button>
        </div>
    );
}

import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getTracks, JamendoTrack } from '@/lib/jamendo';
import MusicList from '@/components/music/MusicList';
import PlayerBar from '@/components/music/PlayerBar';
import { Sparkles } from 'lucide-react';

export const revalidate = 3600;

export default async function MusicPage() {
    const t = await getTranslations('Music');
    const tracks: JamendoTrack[] = await getTracks(50);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full opacity-50" />
                <div className="absolute top-[-100px] right-0 w-[500px] h-[500px] bg-accent/5 dark:bg-accent/10 blur-[100px] rounded-full opacity-30" />
            </div>

            {/* Content Container */}
            <div className="w-full max-w-[1600px] mx-auto my-0 px-6 md:px-12 pt-16 md:pt-24 pb-32">

                {/* Stats Indicator */}
                <div className="flex flex-col items-center mb-16 md:mb-24 relative">
                    <p className="text-xl md:text-2xl text-foreground/90 max-w-4xl leading-relaxed font-normal tracking-tight">
                        {t('description')}
                    </p>

                    <div className="mt-10 inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-muted/50 border border-border/50 backdrop-blur-sm">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-xs md:text-sm font-medium text-muted-foreground tracking-wide">
                            {tracks.length} {t('tracksAvailable')}
                        </span>
                    </div>
                </div>

                {/* Music Grid */}
                <MusicList tracks={tracks} />
            </div>

            {/* Global Player */}
            <PlayerBar />
        </div>
    );
}

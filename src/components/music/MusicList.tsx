"use client";

import React, { useEffect, useCallback, memo } from 'react';
import { JamendoTrack } from '@/lib/jamendo';
import { useMusicStore, Track } from '@/store/useMusicStore';
import { Play, Pause } from 'lucide-react';
import Image from 'next/image';

interface MusicListProps {
    tracks: JamendoTrack[];
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const TrackCard = memo(function TrackCard({
    track,
    isCurrent,
    isPlaying,
    onPlay
}: {
    track: JamendoTrack,
    isCurrent: boolean,
    isPlaying: boolean,
    onPlay: (track: JamendoTrack) => void
}) {
    return (
        <div
            onClick={() => onPlay(track)}
            className="group relative cursor-pointer"
        >
            {/* Image Container */}
            <div className={`
                relative aspect-square rounded-2xl overflow-hidden mb-4
                bg-muted
                will-change-transform
                transition-all duration-300 ease-out
                group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:-translate-y-1 scale-100
                ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
            `}>
                {track.image && (
                    <Image
                        src={track.image}
                        alt={track.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        className="object-cover transform-gpu transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                )}

                {/* Dark Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Center Play Button */}
                <div className={`
                    absolute inset-0 flex items-center justify-center
                    transition-all duration-300
                    ${isPlaying && isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}>
                    <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                        {isPlaying && isCurrent ? (
                            <Pause size={24} fill="currentColor" />
                        ) : (
                            <Play size={24} fill="currentColor" className="ml-1" />
                        )}
                    </div>
                </div>
            </div>

            {/* Track Meta */}
            <div className="space-y-1 px-1">
                <h3 className={`
                    font-semibold text-base leading-snug truncate
                    transition-colors duration-200
                    ${isCurrent ? 'text-primary' : 'text-foreground group-hover:text-primary'}
                `}>
                    {track.name}
                </h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p className="truncate transition-colors group-hover:text-foreground">
                        {track.artist_name}
                    </p>
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity font-mono tabular-nums">
                        {formatDuration(track.duration)}
                    </span>
                </div>
            </div>
        </div>
    );
});

export default function MusicList({ tracks }: MusicListProps) {
    const { playTrack, currentTrack, isPlaying, setQueue, pauseTrack, resumeTrack } = useMusicStore();

    useEffect(() => {
        const queueTracks: Track[] = tracks.map(t => ({
            id: t.id,
            name: t.name,
            artist_name: t.artist_name,
            image: t.image,
            audio: t.audio,
            duration: t.duration
        }));
        setQueue(queueTracks);
    }, [tracks, setQueue]);

    const handlePlayClick = useCallback((jamendoTrack: JamendoTrack) => {
        const track: Track = {
            id: jamendoTrack.id,
            name: jamendoTrack.name,
            artist_name: jamendoTrack.artist_name,
            image: jamendoTrack.image,
            audio: jamendoTrack.audio,
            duration: jamendoTrack.duration
        };

        // We need to access the LATEST state here, but we can't easily inside useCallback 
        // unless we add dependencies.
        // However, useMusicStore provides getState outside, but here we are using the hook.
        // Actually, simpler logic: pass the check to the store or just fire the action?
        // The previous logic checked `currentTrack?.id` from the hook.
        // If we include `currentTrack` in dependency, `handlePlayClick` recreates on every track change,
        // breaking memoization of ALL TrackCards.

        // Solution: Use the store's static method or just accept that the function changes?
        // Or better: Pass the track to a store action "toggleTrack(track)" that handles the logic internally
        // so `handlePlayClick` can be stable if `toggleTrack` is stable.
        // But `playTrack`, `pauseTrack` etc are from the hook. Zustand actions are stable.

        // Let's implement a "smart play" in the store or just act here.
        // To keep `handlePlayClick` stable, we can use `useMusicStore.getState()` inside it,
        // OR rely on the fact that we can just call `playTrack` and let the store decide?
        // But the store's `playTrack` currently just sets it.

        // Let's optimize `handlePlayClick` to read from store state directly to avoid dependencies/re-renders.
        const state = useMusicStore.getState();
        if (state.currentTrack?.id === track.id) {
            state.isPlaying ? state.pauseTrack() : state.resumeTrack();
        } else {
            state.playTrack(track);
        }
    }, []);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-6 gap-y-10">
            {tracks.map((track) => (
                <TrackCard
                    key={track.id}
                    track={track}
                    isCurrent={currentTrack?.id === track.id}
                    isPlaying={isPlaying}
                    onPlay={handlePlayClick}
                />
            ))}
        </div>
    );
}

"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useMusicStore } from '@/store/useMusicStore';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Volume1, Repeat, Shuffle, ListMusic } from 'lucide-react';
import Image from 'next/image';

function formatTime(seconds: number) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function PlayerBar() {
    const {
        currentTrack,
        isPlaying,
        volume,
        currentTime,
        pauseTrack,
        resumeTrack,
        nextTrack,
        prevTrack,
        setVolume,
        setCurrentTime
    } = useMusicStore();

    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [duration, setDuration] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [hoverTime, setHoverTime] = useState<number | null>(null);

    // Sync audio play/pause
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Autoplay prevented:", error);
                    pauseTrack();
                });
            }
        } else {
            audio.pause();
        }
    }, [isPlaying, currentTrack, pauseTrack]);

    // Sync volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Media Session API
    useEffect(() => {
        if (!currentTrack || !('mediaSession' in navigator)) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: currentTrack.name,
            artist: currentTrack.artist_name,
            artwork: [
                { src: currentTrack.image, sizes: '512x512', type: 'image/jpeg' },
            ],
        });

        navigator.mediaSession.setActionHandler('play', resumeTrack);
        navigator.mediaSession.setActionHandler('pause', pauseTrack);
        navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
        navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
    }, [currentTrack, resumeTrack, pauseTrack, prevTrack, nextTrack]);

    const handleTimeUpdate = () => {
        if (audioRef.current && !isDragging) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        nextTrack();
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current || !duration) return;
        const rect = progressRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const time = percent * duration;
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current || !duration) return;
        const rect = progressRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        setHoverTime(percent * duration);
    };

    const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
    const progress = duration ? (currentTime / duration) * 100 : 0;

    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 h-24 md:h-20">
            {/* Frosted Glass Background */}
            <div className="absolute inset-0 bg-card/90 backdrop-blur-2xl border-t border-border shadow-[0_-8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_-8px_32px_-12px_rgba(0,0,0,0.5)]" />

            <audio
                ref={audioRef}
                src={currentTrack.audio}
                onError={(e) => console.error("Audio playback error:", e.currentTarget.error)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            {/* Progress Bar (Full Width) */}
            <div
                ref={progressRef}
                onClick={handleProgressClick}
                onMouseMove={handleProgressHover}
                onMouseLeave={() => setHoverTime(null)}
                className="absolute top-0 left-0 right-0 h-[3px] bg-muted/30 cursor-pointer group"
            >
                {/* Progress Fill */}
                <div
                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-100 group-hover:bg-primary shadow-[0_0_8px_var(--color-primary)]"
                    style={{ width: `${progress}%` }}
                />

                {/* Hover Indicator */}
                {hoverTime !== null && (
                    <div
                        className="absolute top-0 h-full bg-primary/20 pointer-events-none"
                        style={{ width: `${(hoverTime / duration) * 100}%` }}
                    />
                )}

                {/* Thumb */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg border-2 border-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100"
                    style={{ left: `calc(${progress}% - 8px)` }}
                />
            </div>

            <div className="relative h-full max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="flex items-center h-full gap-4 md:gap-8 text-foreground">

                    {/* Track Info (Left - 30%) */}
                    <div className="flex items-center gap-4 min-w-0 md:w-[30%]">
                        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-xl border border-border/50 bg-muted group/image">
                            {currentTrack.image && (
                                <Image
                                    src={currentTrack.image}
                                    alt={currentTrack.name}
                                    fill
                                    className="object-cover transition-transform group-hover/image:scale-110 duration-500"
                                />
                            )}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                            <h4 className="font-bold text-sm text-foreground truncate leading-tight group-hover:text-primary transition-colors cursor-default">
                                {currentTrack.name}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate font-medium">
                                {currentTrack.artist_name}
                            </p>
                        </div>
                    </div>

                    {/* Controls (Center - 40%) */}
                    <div className="flex flex-col items-center justify-center gap-1 flex-1 md:w-[40%]">
                        <div className="flex items-center gap-3 md:gap-6">
                            {/* Shuffle - Screen > sm */}
                            <button className="hidden sm:block p-2 text-muted-foreground hover:text-primary transition-all hover:scale-110 active:scale-90">
                                <Shuffle size={18} />
                            </button>

                            <button
                                onClick={prevTrack}
                                className="p-2 text-foreground/80 hover:text-primary transition-all hover:scale-110 active:scale-90"
                            >
                                <SkipBack size={22} fill="currentColor" />
                            </button>

                            <button
                                onClick={isPlaying ? pauseTrack : resumeTrack}
                                className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_8px_20px_-6px_rgba(var(--color-primary-rgb),.4)] dark:shadow-[0_8px_24px_-8px_rgba(0,0,0,.6)] hover:scale-105 active:scale-95 transition-all"
                            >
                                {isPlaying ? (
                                    <Pause size={24} fill="currentColor" />
                                ) : (
                                    <Play size={24} fill="currentColor" className="ml-1" />
                                )}
                            </button>

                            <button
                                onClick={nextTrack}
                                className="p-2 text-foreground/80 hover:text-primary transition-all hover:scale-110 active:scale-90"
                            >
                                <SkipForward size={22} fill="currentColor" />
                            </button>

                            {/* Repeat - Screen > sm */}
                            <button className="hidden sm:block p-2 text-muted-foreground hover:text-primary transition-all hover:scale-110 active:scale-90">
                                <Repeat size={18} />
                            </button>
                        </div>

                        {/* Time Display */}
                        <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80 tabular-nums uppercase tracking-widest">
                            <span className="min-w-[40px] text-right">{formatTime(currentTime)}</span>
                            <span className="opacity-30">/</span>
                            <span className="min-w-[40px]">{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Volume & Extras (Right - 30%) */}
                    <div className="hidden md:flex items-center justify-end gap-6 w-[30%]">
                        {/* Volume Control */}
                        <div className="flex items-center gap-3 group/volume">
                            <button
                                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                                className="p-1 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <VolumeIcon size={20} />
                            </button>
                            <div className="relative w-24 h-1 bg-muted/50 rounded-full overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all group-hover/volume:bg-primary shadow-[0_0_4px_var(--color-primary)]"
                                    style={{ width: `${volume * 100}%` }}
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* List Button */}
                        <button className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground hover:text-primary hover:bg-muted transition-all border border-border/50">
                            <ListMusic size={20} />
                        </button>
                    </div>

                    {/* Mobile Controls Toggle or Simple Info (Small screen only) */}
                    <div className="flex md:hidden items-center justify-end">
                        <button className="p-2 text-muted-foreground">
                            <ListMusic size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

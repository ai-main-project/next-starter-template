'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioEngine } from './useAudioEngine';
import { VirtualKeyboard } from './VirtualKeyboard';
import { RippleEffect } from './RippleEffect';
import { useTranslations } from 'next-intl';

export const KeyBeat: React.FC = () => {
    const t = useTranslations('Games');
    const [isStarted, setIsStarted] = useState(false);
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [rippleTrigger, setRippleTrigger] = useState(0);
    const [lastKey, setLastKey] = useState('');
    const { playNote, initAudio } = useAudioEngine();

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isStarted) return;

        // Prevent default for space to avoid scrolling
        if (e.key === ' ') e.preventDefault();

        const key = e.key.toUpperCase();
        if (pressedKeys.has(key)) return;

        setPressedKeys(prev => new Set(prev).add(key));
        setLastKey(key);
        setRippleTrigger(prev => prev + 1);
        playNote(e.key);
    }, [isStarted, pressedKeys, playNote]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        const key = e.key.toUpperCase();
        setPressedKeys(prev => {
            const next = new Set(prev);
            next.delete(key);
            return next;
        });
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    const startApp = async () => {
        await initAudio();
        setIsStarted(true);
    };

    return (
        <div className="relative min-h-[60vh] w-full flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-black via-zinc-900 to-black p-4 sm:p-8 border border-white/10 shadow-2xl">
            {/* Visual Effects Layer */}
            <RippleEffect trigger={rippleTrigger} lastKey={lastKey} />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-4xl">
                <div className="text-center space-y-4">
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-2"
                    >
                        Key<span className="text-primary">Beat</span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-400 text-lg sm:text-xl font-medium"
                    >
                        {t('keybeatSubtitle', { defaultValue: 'Your keyboard. Your rhythm.' })}
                    </motion.p>
                </div>

                <AnimatePresence mode="wait">
                    {!isStarted ? (
                        <motion.button
                            key="start-button"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startApp}
                            className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full text-xl shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)] transition-shadow hover:shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.5)]"
                        >
                            {t('pressToStart', { defaultValue: 'PRESS TO START' })}
                        </motion.button>
                    ) : (
                        <motion.div
                            key="keyboard-container"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="w-full"
                        >
                            <VirtualKeyboard pressedKeys={pressedKeys} />

                            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-zinc-500 font-medium">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <span className="block text-zinc-300 mb-1">{t('row1Key', { defaultValue: 'Numbers 0-9' })}</span>
                                    {t('row1Desc', { defaultValue: 'Percussion & Noise' })}
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <span className="block text-zinc-300 mb-1">{t('row3Key', { defaultValue: 'A-L' })}</span>
                                    {t('row3Desc', { defaultValue: 'Main Melody (C4-B4)' })}
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <span className="block text-zinc-300 mb-1">{t('row2Key', { defaultValue: 'Q-P' })}</span>
                                    {t('row2Desc', { defaultValue: 'High Ornamentals' })}
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <span className="block text-zinc-300 mb-1">{t('row4Key', { defaultValue: 'Z-M / Space' })}</span>
                                    {t('row4Desc', { defaultValue: 'Bass & Crash' })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Decorative background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
};

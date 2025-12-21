import React from 'react';
import { useTranslations } from 'next-intl';
import { KeyBeat } from '@/components/games/KeyBeat/KeyBeat';

export default function KeyBeatPage() {
    const t = useTranslations('Games');

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center">
                <KeyBeat />
            </div>

            <div className="mt-12 max-w-2xl mx-auto text-center space-y-4">
                <h2 className="text-2xl font-bold">{t('keybeatTitle', { defaultValue: 'About KeyBeat' })}</h2>
                <p className="text-muted-foreground leading-relaxed">
                    {t('keybeatDesc', {
                        defaultValue: 'KeyBeat is an interactive music experiment. Turn your computer keyboard into a powerful synthesizer and percussion kit. Experience the fusion of code, design, and sound.'
                    })}
                </p>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';

/**
 * Key Mapping Logic:
 * 数字键 (0-9): 触发 Tone.Sampler 或 Tone.NoiseSynth 的打击乐（鼓点：Kick, Snare, Hi-hat 等）
 * 中行字母 (A-L): 映射 C 大调音阶 (C4-B4)，作为主旋律音色 (Synth)
 * 上行字母 (Q-P): 映射高音阶或带有延迟效果的装饰音
 * 下行字母 (Z-M): 映射低沉的 Bass 音色
 * 空格键: 触发一个带有长释放效果的氛围音或大镲 (Crash)
 */

export const useAudioEngine = () => {
    const samplerRef = useRef<Tone.Sampler | null>(null);
    const synthRef = useRef<Tone.PolySynth | null>(null);
    const bassRef = useRef<Tone.MonoSynth | null>(null);
    const noiseSynthRef = useRef<Tone.NoiseSynth | null>(null);
    const ambianceRef = useRef<Tone.MetalSynth | null>(null);

    useEffect(() => {
        // Initialize Synth for Main Melody (A-L)
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.05, decay: 0.2, sustain: 0.2, release: 1 }
        }).toDestination();

        // Initialize Bass Synth (Z-M)
        bassRef.current = new Tone.MonoSynth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 2 }
        }).toDestination();

        // Initialize Noise Synth for Percussion (0-9)
        noiseSynthRef.current = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
        }).toDestination();

        // Initialize PolySynth for Spacebar (Crash/Ambiance) - using a more robust synth to avoid build issues
        ambianceRef.current = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'sine' },
            envelope: { attack: 0.1, decay: 0.8, sustain: 0.1, release: 2 }
        }).toDestination() as any;

        return () => {
            synthRef.current?.dispose();
            bassRef.current?.dispose();
            noiseSynthRef.current?.dispose();
            ambianceRef.current?.dispose();
        };
    }, []);

    const playNote = useCallback((key: string) => {
        if (Tone.getContext().state !== 'running') return;

        const k = key.toUpperCase();

        // Row 1: Numbers (0-9) - Percussion/Noise
        if (/[0-9]/.test(k)) {
            noiseSynthRef.current?.triggerAttackRelease('8n');
        }

        // Row 2: Q-P - High pitched ornamentals
        const highNotes: Record<string, string> = {
            'Q': 'C5', 'W': 'D5', 'E': 'E5', 'R': 'F5', 'T': 'G5',
            'Y': 'A5', 'U': 'B5', 'I': 'C6', 'O': 'D6', 'P': 'E6'
        };
        if (highNotes[k]) {
            synthRef.current?.triggerAttackRelease(highNotes[k], '8n');
        }

        // Row 3: A-L - Main Melody (C4-B4)
        const melodyNotes: Record<string, string> = {
            'A': 'C4', 'S': 'D4', 'D': 'E4', 'F': 'F4', 'G': 'G4',
            'H': 'A4', 'J': 'B4', 'K': 'C5', 'L': 'D5'
        };
        if (melodyNotes[k]) {
            synthRef.current?.triggerAttackRelease(melodyNotes[k], '4n');
        }

        // Row 4: Z-M - Bass
        const bassNotes: Record<string, string> = {
            'Z': 'C2', 'X': 'D2', 'C': 'E2', 'V': 'F2', 'B': 'G2',
            'N': 'A2', 'M': 'B2'
        };
        if (bassNotes[k]) {
            bassRef.current?.triggerAttackRelease(bassNotes[k], '2n');
        }

        // Spacebar - Crash/Ambiance
        if (key === ' ') {
            ambianceRef.current?.triggerAttackRelease('C3', '1n');
        }
    }, []);

    const initAudio = async () => {
        await Tone.start();
        console.log('Audio Context started');
    };

    return { playNote, initAudio };
};

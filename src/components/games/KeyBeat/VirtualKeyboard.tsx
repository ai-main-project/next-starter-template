'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface KeyProps {
    label: string;
    isPressed: boolean;
    row: number;
}

const Key: React.FC<KeyProps> = ({ label, isPressed, row }) => {
    const t = useTranslations('Games');
    return (
        <motion.div
            animate={{
                scale: isPressed ? 0.95 : 1,
                backgroundColor: isPressed ? 'rgba(var(--color-primary-rgb), 0.8)' : 'rgba(255, 255, 255, 0.05)',
                boxShadow: isPressed
                    ? '0 0 20px rgba(var(--color-primary-rgb), 0.5)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`
                flex items-center justify-center rounded-lg border border-white/10
                backdrop-blur-sm text-white font-bold cursor-pointer select-none
                ${label === ' ' ? 'w-64 h-16' : 'w-12 h-12 sm:w-14 sm:h-14'}
            `}
        >
            {label === ' ' ? t('spaceKey', { defaultValue: 'SPACE' }) : label}
        </motion.div>
    );
};

export const VirtualKeyboard: React.FC<{ pressedKeys: Set<string> }> = ({ pressedKeys }) => {
    const rows = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
        [' ']
    ];

    return (
        <div className="flex flex-col items-center gap-2 p-8 bg-black/20 rounded-2xl backdrop-blur-md border border-white/5">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                    {row.map((key) => (
                        <Key
                            key={key}
                            label={key}
                            isPressed={pressedKeys.has(key.toUpperCase()) || (key === ' ' && pressedKeys.has(' '))}
                            row={rowIndex}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

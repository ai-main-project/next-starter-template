'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
    id: number;
    x: number;
    y: number;
}

export const RippleEffect: React.FC<{ trigger: number, lastKey: string }> = ({ trigger }) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    useEffect(() => {
        if (trigger === 0) return;

        const newRipple = {
            id: Date.now(),
            x: Math.random() * 80 + 10, // 10% to 90%
            y: Math.random() * 80 + 10, // 10% to 90%
        };

        setRipples((prev) => [...prev.slice(-10), newRipple]);

        const timer = setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 1000);

        return () => clearTimeout(timer);
    }, [trigger]);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.div
                        key={ripple.id}
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 4, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute w-20 h-20 border-2 border-primary/30 rounded-full"
                        style={{
                            left: `${ripple.x}%`,
                            top: `${ripple.y}%`,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 20px rgba(var(--color-primary-rgb), 0.2)',
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

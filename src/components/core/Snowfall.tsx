'use client';

import React, { useEffect, useState } from 'react';

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState<{ id: number; left: string; size: string; duration: string; delay: string; opacity: number; sway: string }[]>([]);

  useEffect(() => {
    const count = 50;
    const newSnowflakes = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 20 + 20}px`, // 20px to 40px
      duration: `${Math.random() * 10 + 10}s`, // 10s to 20s
      delay: `${Math.random() * -20}s`,
      opacity: Math.random() * 0.6 + 0.2,
      sway: `${Math.random() * 50 - 25}px`
    }));
    setSnowflakes(newSnowflakes);
  }, []);

  return (
    <div className="snowfall-container" aria-hidden="true">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            fontSize: flake.size,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
            opacity: flake.opacity,
            '--sway-offset': flake.sway,
          } as React.CSSProperties}
        >
          ❄
        </div>
      ))}
      <style jsx>{`
        .snowfall-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }

        .snowflake {
          position: absolute;
          top: -40px;
          color: var(--snowflake-color);
          user-select: none;
          animation: fall-and-sway linear infinite;
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3));
        }

        @keyframes fall-and-sway {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(25vh) translateX(var(--sway-offset)) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(0) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(calc(-1 * var(--sway-offset))) rotate(270deg);
          }
          100% {
            transform: translateY(110vh) translateX(0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Snowfall;

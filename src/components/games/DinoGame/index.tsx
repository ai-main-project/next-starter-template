'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './DinoGame.module.css';
import { useTranslations } from 'next-intl';

// Types
interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    type?: 'ground' | 'air';
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    size: number;
    color: string;
}

const DinoGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const t = useTranslations('Games.Dino');

    // Constants
    const GRAVITY = 0.6;
    const JUMP_FORCE = -12;
    const DINO_X = 80;
    const GROUND_Y = 220;
    const BASE_SPEED = 6;
    const MAX_SPEED = 15;
    const SPEED_INCREMENT = 0.0001;

    // Refs for game state (avoiding re-renders for core loop)
    const state = useRef({
        dinoY: GROUND_Y,
        dinoVelocity: 0,
        isJumping: false,
        isDucking: false,
        speed: BASE_SPEED,
        score: 0,
        frame: 0,
        obstacles: [] as GameObject[],
        particles: [] as Particle[],
        parallaxOffset: [0, 0, 0] as [number, number, number],
        gameActive: false,
        lastTime: 0,
        shakeAmount: 0,
    });

    const createParticles = (x: number, y: number, count: number, color: string) => {
        for (let i = 0; i < count; i++) {
            state.current.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1.0,
                size: Math.random() * 4 + 2,
                color,
            });
        }
    };

    const resetGame = () => {
        state.current = {
            ...state.current,
            dinoY: GROUND_Y,
            dinoVelocity: 0,
            isJumping: false,
            isDucking: false,
            speed: BASE_SPEED,
            score: 0,
            frame: 0,
            obstacles: [],
            particles: [],
            gameActive: true,
            lastTime: performance.now(),
            shakeAmount: 0,
            parallaxOffset: [0, 0, 0],
        };
        setIsGameOver(false);
        setScore(0);
        setGameStarted(true);
    };

    const jump = () => {
        if (!state.current.gameActive) {
            if (!gameStarted || isGameOver) resetGame();
            return;
        }
        if (!state.current.isJumping && !state.current.isDucking) {
            state.current.dinoVelocity = JUMP_FORCE;
            state.current.isJumping = true;
            createParticles(DINO_X + 20, GROUND_Y + 40, 5, '#888');
        }
    };

    const duck = (isDucking: boolean) => {
        if (!state.current.gameActive || state.current.isJumping) return;
        state.current.isDucking = isDucking;
    };

    useEffect(() => {
        const stored = localStorage.getItem('dino-high-score');
        if (stored) setHighScore(parseInt(stored));
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const update = (deltaTime: number) => {
            const currentGame = state.current;
            if (!currentGame.gameActive) return;

            const timeScale = deltaTime / 16.67;

            // Difficulty Scaling
            currentGame.speed = Math.min(MAX_SPEED, currentGame.speed + SPEED_INCREMENT * deltaTime);

            // Score
            currentGame.score += 0.01 * deltaTime;
            setScore(Math.floor(currentGame.score));

            // Physics
            currentGame.dinoVelocity += GRAVITY * timeScale;
            currentGame.dinoY += currentGame.dinoVelocity * timeScale;

            if (currentGame.dinoY > GROUND_Y) {
                currentGame.dinoY = GROUND_Y;
                currentGame.dinoVelocity = 0;
                if (currentGame.isJumping) {
                    currentGame.isJumping = false;
                    createParticles(DINO_X + 20, GROUND_Y + 40, 8, '#aaa');
                }
            }

            // Parallax
            currentGame.parallaxOffset[0] += currentGame.speed * 0.1 * timeScale;
            currentGame.parallaxOffset[1] += currentGame.speed * 0.3 * timeScale;
            currentGame.parallaxOffset[2] += currentGame.speed * 0.5 * timeScale;

            // Obstacles
            if (currentGame.frame % Math.floor(100 / (currentGame.speed / BASE_SPEED)) === 0) {
                const isAir = Math.random() > 0.7 && currentGame.score > 50;
                currentGame.obstacles.push({
                    x: canvas.width,
                    y: isAir ? GROUND_Y - 40 : GROUND_Y + 10,
                    width: isAir ? 40 : 25,
                    height: isAir ? 30 : 40,
                    type: isAir ? 'air' : 'ground',
                });
            }

            currentGame.obstacles.forEach(obs => {
                obs.x -= currentGame.speed * timeScale;
            });
            currentGame.obstacles = currentGame.obstacles.filter(o => o.x + o.width > -100);

            // Particles
            currentGame.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;
            });
            currentGame.particles = currentGame.particles.filter(p => p.life > 0);

            // Collision
            const dinoHitbox = {
                x: DINO_X + 5,
                y: currentGame.isDucking ? currentGame.dinoY + 20 : currentGame.dinoY + 5,
                width: 30,
                height: currentGame.isDucking ? 20 : 35,
            };

            for (const obs of currentGame.obstacles) {
                const obsHitbox = { x: obs.x + 4, y: obs.y + 4, width: obs.width - 8, height: obs.height - 8 };
                if (
                    dinoHitbox.x < obsHitbox.x + obsHitbox.width &&
                    dinoHitbox.x + dinoHitbox.width > obsHitbox.x &&
                    dinoHitbox.y < obsHitbox.y + obsHitbox.height &&
                    dinoHitbox.y + dinoHitbox.height > obsHitbox.y
                ) {
                    currentGame.gameActive = false;
                    currentGame.shakeAmount = 15;
                    setIsGameOver(true);
                    if (currentGame.score > highScore) {
                        setHighScore(Math.floor(currentGame.score));
                        localStorage.setItem('dino-high-score', Math.floor(currentGame.score).toString());
                    }
                }
            }

            currentGame.frame++;
            if (currentGame.shakeAmount > 0) currentGame.shakeAmount -= 1;
        };

        const draw = () => {
            const currentGame = state.current;
            ctx.save();
            if (currentGame.shakeAmount > 0) {
                ctx.translate((Math.random() - 0.5) * currentGame.shakeAmount, (Math.random() - 0.5) * currentGame.shakeAmount);
            }

            // Background Day/Night
            const isNight = Math.floor(currentGame.score / 1000) % 2 === 1;
            ctx.fillStyle = isNight ? '#1a1a2e' : '#f0f4f8';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Parallax Mountains (Distant)
            ctx.fillStyle = isNight ? '#252a44' : '#d1e3f0';
            for (let i = 0; i < 3; i++) {
                const xOffset = (i * 400 - (currentGame.parallaxOffset[0] % 400));
                ctx.beginPath();
                ctx.moveTo(xOffset, 250);
                ctx.lineTo(xOffset + 200, 100);
                ctx.lineTo(xOffset + 400, 250);
                ctx.fill();
            }

            // Draw Ground
            ctx.strokeStyle = isNight ? '#444' : '#ccc';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, GROUND_Y + 45);
            ctx.lineTo(canvas.width, GROUND_Y + 45);
            ctx.stroke();

            // Particles
            currentGame.particles.forEach(p => {
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1.0;

            // Dino
            ctx.save();
            const dinoPosX = DINO_X + (currentGame.isDucking ? 22 : 17);
            const dinoPosY = currentGame.dinoY + (currentGame.isDucking ? 32 : 22);
            ctx.translate(dinoPosX, dinoPosY);
            ctx.scale(-1, 1); // Flip horizontally to face right
            ctx.font = currentGame.isDucking ? '30px serif' : '40px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(currentGame.isDucking ? '🐊' : '🦖', 0, 0);
            ctx.restore();

            // Obstacles
            ctx.font = '35px serif';
            currentGame.obstacles.forEach(obs => {
                if (obs.type === 'air') {
                    ctx.fillText('🦅', obs.x + obs.width / 2, obs.y + obs.height / 2);
                } else {
                    ctx.fillText('🌵', obs.x + obs.width / 2, obs.y + obs.height / 2 + 5);
                }
            });

            ctx.restore();
        };

        const loop = (time: number) => {
            const deltaTime = time - state.current.lastTime;
            state.current.lastTime = time;
            update(deltaTime);
            draw();
            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [highScore]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                e.preventDefault();
                duck(true);
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                duck(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameStarted, isGameOver]);

    return (
        <div className={styles.gameContainer}>
            <div className={styles.scoreBoard}>
                <span>{t('score')}: {score.toString().padStart(5, '0')}</span>
                <span>{t('highScore')}: {highScore.toString().padStart(5, '0')}</span>
            </div>
            <canvas
                ref={canvasRef}
                width={800}
                height={300}
                className={styles.canvas}
                onClick={jump}
                onMouseDown={() => duck(true)}
                onMouseUp={() => duck(false)}
            ></canvas>

            {!state.current.gameActive && (
                <div className={styles.instructions}>
                    {!gameStarted ? (
                        <div>
                            <h2 style={{ marginBottom: '1rem' }}>{t('start')}</h2>
                            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{t('controls')}</p>
                        </div>
                    ) : isGameOver ? (
                        <div>
                            <h2 style={{ marginBottom: '0.5rem', color: '#ff4d4d' }}>{t('gameOver')}</h2>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                                {t('score')}: {score}
                            </p>
                            <p style={{ opacity: 0.7 }}>{t('start')}</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default DinoGame;

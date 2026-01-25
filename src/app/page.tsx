"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";

const GameScene = dynamic(() => import("@/components/GameScene"), { ssr: false });

export default function Home() {
    const score = useGameStore(state => state.score);
    const status = useGameStore(state => state.status);
    const timeLeft = useGameStore(state => state.timeLeft);
    const startGame = useGameStore(state => state.startGame);
    const endGame = useGameStore(state => state.endGame);
    const resetGame = useGameStore(state => state.resetGame);
    const tickTimer = useGameStore(state => state.tickTimer);

    // Timer Logic
    useEffect(() => {
        if (status === 'playing') {
            const timer = setInterval(() => {
                tickTimer();
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [status, tickTimer]);

    // Check for Game Over
    useEffect(() => {
        if (status === 'playing' && timeLeft <= 0) {
            endGame();
        }
    }, [timeLeft, status, endGame]);

    const handleStart = () => {
        startGame();
    };

    const handleRestart = () => {
        resetGame(); // reset score and timer
        startGame();
    };

    return (
        <main className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
            {/* 3D Game Layer */}
            <div className="absolute inset-0 z-0">
                <GameScene />
            </div>

            {/* UI Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8">

                {/* HUD (Only visible when playing) */}
                {status === 'playing' && (
                    <>
                        <div className="flex justify-between items-start w-full">
                            {/* Score */}
                            <div className="bg-black/50 p-4 rounded-lg text-white backdrop-blur-sm border border-white/10">
                                <h2 className="text-sm text-yellow-500 font-bold mb-1">SCORE</h2>
                                <p className="text-4xl font-mono tracking-widest">{score.toString().padStart(6, '0')}</p>
                            </div>

                            {/* Timer */}
                            <div className={`p-4 rounded-lg backdrop-blur-sm border border-white/10 ${timeLeft <= 5 ? 'bg-red-900/50 text-red-200 animate-pulse' : 'bg-black/50 text-white'}`}>
                                <h2 className="text-sm font-bold mb-1 text-right">TIME</h2>
                                <p className="text-4xl font-mono">{timeLeft}s</p>
                            </div>
                        </div>

                        {/* Crosshair */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-white/80 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                                <div className="absolute w-1 h-1 bg-red-500 rounded-full"></div>
                            </div>
                        </div>

                        <div className="text-center text-white/50 text-sm">
                            WASD to Move &nbsp;|&nbsp; Click to Heal Stress
                        </div>
                    </>
                )}
            </div>

            {/* Start Screen */}
            {status === 'idle' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
                    <div className="text-center max-w-md p-8 border border-white/10 rounded-2xl bg-black/50">
                        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                            STRESS <span className="text-red-500">BREAKER</span>
                        </h1>
                        <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                            나쁜 말들이 당신을 괴롭히나요?<br />
                            박스를 부수고 긍정적인 에너지를 얻으세요!
                        </p>
                        <div className="flex flex-col gap-4 w-full">
                            <button
                                onClick={handleStart}
                                className="pointer-events-auto w-full px-8 py-4 bg-white text-black font-bold text-xl rounded-full hover:scale-105 transition-transform hover:bg-yellow-400"
                            >
                                Game Start
                            </button>

                            <Link href="/words" className="w-full">
                                <button className="pointer-events-auto w-full px-8 py-3 bg-white/10 text-white font-medium text-lg rounded-full hover:bg-white/20 transition-colors border border-white/20">
                                    텍스트 설정
                                </button>
                            </Link>

                            <Link href="/backgrounds" className="w-full">
                                <button className="pointer-events-auto w-full px-8 py-3 bg-white/10 text-white font-medium text-lg rounded-full hover:bg-white/20 transition-colors border border-white/20">
                                    배경 설정
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* End Screen */}
            {status === 'ended' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg">
                    <div className="text-center animate-in fade-in zoom-in duration-300">
                        <h2 className="text-6xl font-bold text-yellow-400 mb-2">Time's Up!</h2>
                        <p className="text-white/60 mb-8 text-xl">스트레스가 조금 풀리셨나요?</p>

                        <div className="bg-white/10 p-8 rounded-2xl mb-8 backdrop-blur-md border border-white/10">
                            <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Final Score</p>
                            <p className="text-7xl font-mono text-white font-bold">{score}</p>
                        </div>

                        <button
                            onClick={handleRestart}
                            className="pointer-events-auto px-10 py-4 bg-red-600 text-white font-bold text-xl rounded-full hover:bg-red-500 transition-colors shadow-lg shadow-red-900/50"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

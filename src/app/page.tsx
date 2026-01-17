"use client";

import dynamic from "next/dynamic";
import { useGameStore } from "@/store/gameStore";

const GameScene = dynamic(() => import("@/components/GameScene"), { ssr: false });

export default function Home() {
    const score = useGameStore((state) => state.score);

    return (
        <main className="relative w-full h-screen bg-black overflow-hidden">
            {/* 3D Game Layer */}
            <div className="absolute inset-0 z-0">
                <GameScene />
            </div>

            {/* UI Overlay Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8">

                {/* Top Bar: Score */}
                <div className="flex justify-between items-start">
                    <div className="bg-black/50 p-4 rounded-lg text-white backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-yellow-400">SCORE</h2>
                        <p className="text-4xl font-mono">{score.toString().padStart(6, '0')}</p>
                    </div>
                </div>

                {/* Center: Crosshair */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-white/80 rounded-full"></div>
                        <div className="absolute w-1 h-1 bg-red-500 rounded-full"></div>
                    </div>
                </div>

                {/* Bottom: Instructions */}
                <div className="text-center text-white/70 text-sm bg-black/30 p-2 rounded-full self-center backdrop-blur-sm">
                    🖱️ Click to Play & Shoot &nbsp;|&nbsp; ⌨️ WASD to Move
                </div>
            </div>
        </main>
    );
}

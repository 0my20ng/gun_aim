"use client";

import React from "react";
import { useGameStore, BackgroundMode } from "@/store/gameStore";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { Stars, Sky } from "@react-three/drei";

// Small preview components for the cards
const WhiteRoomPreview = () => (
    <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center border border-gray-200 rounded-lg">
        <div className="w-16 h-16 border-2 border-gray-300 rounded grid grid-cols-2 gap-0 overflow-hidden opacity-50">
            <div className="border border-gray-200"></div><div className="border border-gray-200"></div>
            <div className="border border-gray-200"></div><div className="border border-gray-200"></div>
        </div>
    </div>
);

const SpacePreview = () => (
    <div className="w-full h-full bg-black relative rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"></div>
        <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"></div>
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"></div>
    </div>
);

const SchoolPreview = () => (
    <div className="w-full h-full bg-[#f3e5ab] flex items-center justify-center border border-yellow-200 rounded-lg relative overflow-hidden">
        {/* Simple wood floor pattern */}
        <div className="absolute inset-0 flex flex-col opacity-20">
            <div className="h-4 border-b border-black"></div>
            <div className="h-4 border-b border-black"></div>
            <div className="h-4 border-b border-black"></div>
            <div className="h-4 border-b border-black"></div>
            <div className="h-4 border-b border-black"></div>
            <div className="h-4 border-b border-black"></div>
            <div className="h-4 border-b border-black"></div>
        </div>
        <div className="z-10 text-4xl opacity-50">🏫</div>
    </div>
);

export default function BackgroundPage() {
    const { backgroundMode, setBackgroundMode } = useGameStore();

    const backgrounds: { id: BackgroundMode; name: string; desc: string; preview: React.ReactNode }[] = [
        {
            id: 'white',
            name: '하얀 방 (White Room)',
            desc: '끝없이 펼쳐진 순백의 공간. 집중력을 높여줍니다.',
            preview: <WhiteRoomPreview />
        },
        {
            id: 'space',
            name: '우주 (Space)',
            desc: '고요한 밤하늘과 별들. 마음의 안정을 찾으세요.',
            preview: <SpacePreview />
        },
        {
            id: 'school',
            name: '학교 (School)',
            desc: '나무 바닥과 따뜻한 햇살. 익숙한 교실의 느낌.',
            preview: <SchoolPreview />
        },
    ];

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center p-8 font-sans text-gray-800">
            <h1 className="text-4xl font-bold mb-2 text-center text-gray-900">배경 선택</h1>
            <p className="text-gray-500 mb-12">플레이할 공간의 분위기를 선택하세요.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {backgrounds.map((bg) => (
                    <div
                        key={bg.id}
                        onClick={() => setBackgroundMode(bg.id)}
                        className={`
                            cursor-pointer rounded-2xl p-4 transition-all duration-300 border-4 relative overflow-hidden group
                            ${backgroundMode === bg.id
                                ? 'border-blue-500 shadow-2xl scale-105 bg-white ring-4 ring-blue-100'
                                : 'border-transparent hover:border-gray-200 shadow-lg bg-white hover:-translate-y-2'}
                        `}
                    >
                        {/* Aspect Ratio Box for Preview */}
                        <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 shadow-inner">
                            {bg.preview}
                        </div>

                        <div className="text-center">
                            <h3 className={`text-xl font-bold mb-2 ${backgroundMode === bg.id ? 'text-blue-600' : 'text-gray-900'}`}>{bg.name}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed word-keep-all">{bg.desc}</p>
                        </div>

                        {backgroundMode === bg.id && (
                            <div className="absolute top-4 right-4 bg-blue-500 text-white rounded-full p-1 shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <Link href="/">
                <button className="mt-16 px-10 py-4 bg-gray-900 text-white text-xl font-bold rounded-full shadow-2xl hover:scale-105 hover:bg-gray-800 transition-all transform duration-200">
                    게임으로 돌아가기
                </button>
            </Link>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import Link from "next/link";

export default function WordsPage() {
    const {
        negativeWords, addNegativeWord, removeNegativeWord,
        positiveWords, addPositiveWord, removePositiveWord
    } = useGameStore();

    const [negInput, setNegInput] = useState("");
    const [posInput, setPosInput] = useState("");

    const handleAddNegative = (e: React.FormEvent) => {
        e.preventDefault();
        if (negInput.trim()) {
            addNegativeWord(negInput.trim());
            setNegInput("");
        }
    };

    const handleAddPositive = (e: React.FormEvent) => {
        e.preventDefault();
        if (posInput.trim()) {
            addPositiveWord(posInput.trim());
            setPosInput("");
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col items-center p-8 font-sans text-gray-800">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">나만의 생각 정리</h1>

            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Negative Section */}
                <div className="flex flex-col bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                    <h2 className="text-2xl font-bold mb-4 text-red-600 border-b pb-2 border-red-100">
                        부정적 감정 (타겟)
                    </h2>
                    <p className="mb-4 text-sm text-gray-500">
                        게임에서 파괴하고 싶은 부정적인 생각이나 단어를 입력하세요.
                    </p>

                    <form onSubmit={handleAddNegative} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={negInput}
                            onChange={(e) => setNegInput(e.target.value)}
                            placeholder="예: 스트레스, 불안"
                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
                        >
                            추가
                        </button>
                    </form>

                    <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2 pr-2">
                        {negativeWords.map((word, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-red-50 px-4 py-3 rounded-lg border border-red-100 group hover:shadow-md transition-all">
                                <span className="font-medium text-gray-800">{word}</span>
                                <button
                                    onClick={() => removeNegativeWord(idx)}
                                    className="text-red-400 hover:text-red-600 font-bold px-2 py-1 rounded hover:bg-red-100 transition"
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                        {negativeWords.length === 0 && (
                            <div className="text-center text-gray-400 py-10">
                                등록된 단어가 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                {/* Positive Section */}
                <div className="flex flex-col bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600 border-b pb-2 border-blue-100">
                        긍정적 에너지 (보상)
                    </h2>
                    <p className="mb-4 text-sm text-gray-500">
                        타겟이 터질 때 나타날 긍정적인 메시지나 보상을 입력하세요.
                    </p>

                    <form onSubmit={handleAddPositive} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={posInput}
                            onChange={(e) => setPosInput(e.target.value)}
                            placeholder="예: 행복해, 잘했어"
                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                        >
                            추가
                        </button>
                    </form>

                    <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2 pr-2">
                        {positiveWords.map((word, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-blue-50 px-4 py-3 rounded-lg border border-blue-100 group hover:shadow-md transition-all">
                                <span className="font-medium text-gray-800">{word}</span>
                                <button
                                    onClick={() => removePositiveWord(idx)}
                                    className="text-blue-400 hover:text-blue-600 font-bold px-2 py-1 rounded hover:bg-blue-100 transition"
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                        {positiveWords.length === 0 && (
                            <div className="text-center text-gray-400 py-10">
                                등록된 단어가 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Link href="/">
                <button className="mt-12 px-10 py-4 bg-gray-900 text-white text-xl font-bold rounded-full shadow-2xl hover:scale-105 hover:bg-gray-800 transition-all transform duration-200">
                    게임으로 돌아가기
                </button>
            </Link>
        </div>
    );
}

import { create } from 'zustand';

type GameStatus = 'idle' | 'playing' | 'ended';

// Default words
const DEFAULT_NEGATIVE = [
    "짜증나", "힘들어", "망했어", "포기해", "싫어", "우울해",
    "바보", "실패", "야근", "스트레스", "불안", "귀찮아",
    "틀렸어", "최악이야", "답답해"
];

const DEFAULT_POSITIVE = [
    "최고야!", "잘했어!", "넌 멋져", "사랑해", "행복해",
    "성공!", "괜찮아", "할수있어", "대단해", "완벽해",
    "빛나고있어", "좋은하루", "파이팅", "용기내", "자랑스러워"
];

export type BackgroundMode = 'white' | 'space' | 'school';

interface GameState {
    score: number;
    status: GameStatus;
    timeLeft: number;
    negativeWords: string[];
    positiveWords: string[];
    backgroundMode: BackgroundMode;

    addScore: (points: number) => void;
    startGame: () => void;
    endGame: () => void;
    resetGame: () => void;
    tickTimer: () => void;

    // Word Management Actions
    setNegativeWords: (words: string[]) => void;
    addNegativeWord: (word: string) => void;
    removeNegativeWord: (index: number) => void;

    setPositiveWords: (words: string[]) => void;
    addPositiveWord: (word: string) => void;
    removePositiveWord: (index: number) => void;

    // Background Action
    setBackgroundMode: (mode: BackgroundMode) => void;
}

export const useGameStore = create<GameState>((set) => ({
    score: 0,
    status: 'idle',
    timeLeft: 30,
    negativeWords: DEFAULT_NEGATIVE,
    positiveWords: DEFAULT_POSITIVE,
    backgroundMode: 'white',

    addScore: (points) => set((state) => ({ score: state.score + points })),
    startGame: () => set({ status: 'playing', score: 0, timeLeft: 30 }),
    endGame: () => set({ status: 'ended' }),
    resetGame: () => set({ status: 'idle', score: 0, timeLeft: 30 }),
    tickTimer: () => set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),

    setNegativeWords: (words) => set({ negativeWords: words }),
    addNegativeWord: (word) => set((state) => ({ negativeWords: [...state.negativeWords, word] })),
    removeNegativeWord: (index) => set((state) => ({
        negativeWords: state.negativeWords.filter((_, i) => i !== index)
    })),

    setPositiveWords: (words) => set({ positiveWords: words }),
    addPositiveWord: (word) => set((state) => ({ positiveWords: [...state.positiveWords, word] })),
    removePositiveWord: (index) => set((state) => ({
        positiveWords: state.positiveWords.filter((_, i) => i !== index)
    })),

    setBackgroundMode: (mode) => set({ backgroundMode: mode }),
}));

// Simple synth sound manager using Web Audio API
class SoundManager {
    private context: AudioContext | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            if (AudioContextClass) {
                this.context = new AudioContextClass();
            }
        }
    }

    playExplosion() {
        if (!this.context) return;

        // Resume context if suspended (browser auto-play policy)
        if (this.context.state === 'suspended') {
            this.context.resume();
        }

        const t = this.context.currentTime;
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        // Sound settings (Short, bright "pop" + low "thud")
        oscillator.type = 'triangle';

        // Frequency sweep (High to Low)
        oscillator.frequency.setValueAtTime(800, t);
        oscillator.frequency.exponentialRampToValueAtTime(100, t + 0.1);

        // Volume envelope (Fade out)
        gainNode.gain.setValueAtTime(0.3, t);
        gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

        // Play
        oscillator.start(t);
        oscillator.stop(t + 0.3);
    }
}

export const soundManager = new SoundManager();

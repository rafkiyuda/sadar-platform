import { useEffect, useRef } from 'react';
import { useDriverStore } from '@/app/lib/store/useDriverStore';

export function useAlertSound() {
    const { status, isMonitoring } = useDriverStore();
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);

    // Initialize Audio Context on user interaction (handled by Start button in Dashboard)
    const initAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    };

    const playTone = (type: 'WARNING' | 'CRITICAL') => {
        if (!audioContextRef.current) initAudio();
        const ctx = audioContextRef.current!;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        if (type === 'WARNING') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.5); // Short beep
        } else {
            // Critical - Siren like
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(800, ctx.currentTime);
            oscillator.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.5);
            gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.5);
        }
    };

    useEffect(() => {
        if (!isMonitoring) return;

        if (status === 'DROWSY') {
            // One beep every few seconds handled by repeat or just once?
            // Let's do once per transition for now, or use setInterval if persistent
            const interval = setInterval(() => playTone('WARNING'), 3000);
            playTone('WARNING');
            return () => clearInterval(interval);
        } else if (status === 'CRITICAL') {
            const interval = setInterval(() => playTone('CRITICAL'), 1000); // Faster
            playTone('CRITICAL');
            return () => clearInterval(interval);
        }

    }, [status, isMonitoring]);

    return { initAudio };
}

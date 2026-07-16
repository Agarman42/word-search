import type { SoundPack } from '../types';

let audioCtx: AudioContext | null = null;

const MELODY_SCALE = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];

export interface SoundSettings {
  sound: boolean;
  soundPack: SoundPack;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function shouldPlay(s: SoundSettings): boolean {
  return s.sound && s.soundPack !== 'off';
}

function packVolume(pack: SoundPack, base: number): number {
  if (pack === 'minimal') return base * 0.45;
  return base;
}

function playTone(
  freq: number,
  duration: number,
  volume = 0.08,
  type: OscillatorType = 'sine',
  pack: SoundPack = 'classic',
): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = pack === 'minimal' ? 'triangle' : type;
  osc.frequency.value = freq;
  const vol = packVolume(pack, volume);
  gain.gain.value = vol;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playFoundSound(
  settings: SoundSettings,
  wordIndex = 0,
  wordLength = 4,
): void {
  if (!shouldPlay(settings)) return;
  const { soundPack } = settings;
  const note = MELODY_SCALE[wordIndex % MELODY_SCALE.length];
  const dur = soundPack === 'minimal' ? 0.07 : 0.12;
  playTone(note, dur, 0.07, 'sine', soundPack);
  if (soundPack === 'classic') {
    setTimeout(() => playTone(note * 1.2, 0.1, 0.045, 'sine', soundPack), 55);
    if (wordLength >= 7) {
      setTimeout(() => playTone(note * 1.45, 0.08, 0.035, 'sine', soundPack), 110);
    }
  }
}

export function playCompleteSound(settings: SoundSettings, wordsFound = 12): void {
  if (!shouldPlay(settings)) return;
  const { soundPack } = settings;
  if (soundPack === 'minimal') {
    playTone(523, 0.2, 0.06, 'sine', soundPack);
    return;
  }
  const notes = MELODY_SCALE.slice(0, Math.min(wordsFound, 8));
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 0.07, 'sine', soundPack), i * 90);
  });
  setTimeout(() => playTone(784, 0.3, 0.08, 'sine', soundPack), notes.length * 90 + 100);
}

export function playErrorSound(settings: SoundSettings): void {
  playNotWordSound(settings);
}

export function playNotWordSound(settings: SoundSettings): void {
  if (!shouldPlay(settings)) return;
  playTone(420, settings.soundPack === 'minimal' ? 0.05 : 0.07, 0.03, 'sine', settings.soundPack);
}

export function playRevealTick(settings: SoundSettings, step: number): void {
  if (!shouldPlay(settings)) return;
  playTone(400 + step * 40, 0.05, 0.03, 'sine', settings.soundPack);
}

export function playHintSound(settings: SoundSettings): void {
  if (!shouldPlay(settings)) return;
  playTone(660, 0.1, 0.06, 'sine', settings.soundPack);
  setTimeout(() => playTone(880, 0.12, 0.05, 'sine', settings.soundPack), 80);
}

export function triggerHaptic(enabled: boolean, style: 'light' | 'medium' | 'success' = 'light'): void {
  if (!enabled || typeof navigator === 'undefined') return;
  const patterns: Record<string, number | number[]> = {
    light: 8,
    medium: 20,
    success: [10, 30, 10],
  };
  if ('vibrate' in navigator) {
    navigator.vibrate(patterns[style]);
  }
}

export function triggerHapticByLength(enabled: boolean, length: number): void {
  if (!enabled || typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  const pattern = Array.from({ length: Math.min(length, 6) }, (_, i) =>
    i % 2 === 0 ? 12 : 20,
  );
  navigator.vibrate(pattern);
}
'use client';
import { useCallback, useRef, useState } from 'react';

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(true);
  const ambientRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; lfo: OscillatorNode } | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  const init = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'square', volume = 0.08) => {
    if (!enabled) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [enabled]);

  const hover = useCallback(() => {
    playTone(880, 0.06, 'square', 0.04);
  }, [playTone]);

  const click = useCallback(() => {
    playTone(440, 0.05, 'square', 0.06);
    setTimeout(() => playTone(660, 0.05, 'square', 0.06), 50);
  }, [playTone]);

  const navigate = useCallback(() => {
    playTone(523, 0.08, 'square', 0.05);
    setTimeout(() => playTone(659, 0.08, 'square', 0.05), 80);
    setTimeout(() => playTone(784, 0.1, 'square', 0.05), 160);
  }, [playTone]);

  const crash = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || !enabled) return;
    // Noise burst for crash
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    noise.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }, [enabled]);

  const score = useCallback(() => {
    playTone(523, 0.1, 'square', 0.06);
    setTimeout(() => playTone(659, 0.1, 'square', 0.06), 100);
    setTimeout(() => playTone(784, 0.1, 'square', 0.06), 200);
    setTimeout(() => playTone(1047, 0.2, 'square', 0.06), 300);
  }, [playTone]);

  const konami = useCallback(() => {
    const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
    notes.forEach((n, i) => {
      setTimeout(() => playTone(n, 0.15, 'square', 0.07), i * 80);
    });
  }, [playTone]);

  const achievement = useCallback(() => {
    playTone(784, 0.12, 'square', 0.06);
    setTimeout(() => playTone(988, 0.12, 'square', 0.06), 120);
    setTimeout(() => playTone(1175, 0.2, 'triangle', 0.06), 240);
  }, [playTone]);

  const startBgMusic = useCallback(() => {
    if (!bgMusicRef.current) {
      const audio = new Audio('/tron-bg-music.mp3');
      audio.loop = true;
      audio.volume = 1.0;
      bgMusicRef.current = audio;
    }
    bgMusicRef.current.play().catch(() => {});
  }, []);

  const stopBgMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }
  }, []);

  const startAmbient = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || ambientRef.current) return;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, ctx.currentTime);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(82.5, ctx.currentTime);
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
    lfoGain.gain.setValueAtTime(5, ctx.currentTime);
    gain1.gain.setValueAtTime(0.03, ctx.currentTime);
    gain2.gain.setValueAtTime(0.02, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(ctx.destination);
    gain2.connect(ctx.destination);

    osc1.start();
    osc2.start();
    lfo.start();

    ambientRef.current = { osc1, osc2, lfo };
  }, []);

  const stopAmbient = useCallback(() => {
    if (ambientRef.current) {
      ambientRef.current.osc1.stop();
      ambientRef.current.osc2.stop();
      ambientRef.current.lfo.stop();
      ambientRef.current = null;
    }
  }, []);

  const toggle = useCallback(() => {
    init();
    const next = !enabled;
    setEnabled(next);
    if (next) {
      // need to defer ambient start since enabled won't be true yet for playTone
      setTimeout(() => {
        if (ctxRef.current) {
          const ctx = ctxRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(1047, ctx.currentTime);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
        }
      }, 10);
      startAmbient();
      startBgMusic();
    } else {
      stopAmbient();
      stopBgMusic();
    }
    return next;
  }, [enabled, init, startAmbient, stopAmbient, startBgMusic, stopBgMusic]);

  const initAndPlay = useCallback(() => {
    init();
    setEnabled(true);
    startAmbient();
    startBgMusic();
  }, [init, startAmbient, startBgMusic]);

  return { enabled, hover, click, navigate, crash, score, konami, achievement, toggle, playTone, initAndPlay };
}

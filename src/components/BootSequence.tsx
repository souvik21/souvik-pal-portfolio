'use client';
import { useState, useEffect, useRef } from 'react';
import { boot } from '@/lib/siteConfig';

const BOOT_LINES = boot.lines;

interface BootSequenceProps {
  onComplete: () => void;
  onStart?: () => void;
}

export default function BootSequence({ onComplete, onStart }: BootSequenceProps) {
  const [started, setStarted] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setStarted(true);
    onStart?.();
  };

  useEffect(() => {
    if (!started) return;

    let lineIndex = 0;
    let totalDelay = 0;
    const timeouts: NodeJS.Timeout[] = [];

    BOOT_LINES.forEach((line, i) => {
      totalDelay += line.delay;
      const t = setTimeout(() => {
        setLines(prev => [...prev, line.text]);
        setProgress(((i + 1) / BOOT_LINES.length) * 100);

        // Auto-scroll
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }

        lineIndex++;
      }, totalDelay);
      timeouts.push(t);
    });

    // Complete
    const endTimeout = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 700);
    }, totalDelay + 600);
    timeouts.push(endTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete, started]);

  if (!started) {
    return (
      <div
        className="boot-screen"
        onClick={handleStart}
        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      >
        <div
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 'clamp(20px, 5vw, 42px)',
            fontWeight: 900,
            color: 'var(--cyan)',
            textShadow: '0 0 20px rgba(0,240,255,0.5), 0 0 40px rgba(0,240,255,0.2)',
            letterSpacing: 6,
            marginBottom: 32,
          }}
        >
          {boot.splashTitle}
        </div>
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            color: 'var(--cyan)',
            letterSpacing: 3,
            animation: 'blink 1.2s step-end infinite',
          }}
        >
          {boot.splashPrompt}
        </div>
      </div>
    );
  }

  return (
    <div className={`boot-screen ${fadeOut ? 'boot-fade-out' : ''}`}>
      <div
        ref={containerRef}
        style={{ flex: 1, overflow: 'auto', scrollbarWidth: 'none' }}
      >
        <div className="boot-text">
          {lines.map((line, i) => (
            <div key={i}>
              {line}
              {i === lines.length - 1 && <span className="boot-cursor" />}
            </div>
          ))}
        </div>
      </div>

      <div className="boot-progress">
        <div
          className="boot-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        style={{
          marginTop: 12,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          color: 'rgba(0, 240, 255, 0.3)',
          letterSpacing: 3,
          textAlign: 'center',
        }}
      >
        {boot.footerLabel}
      </div>
    </div>
  );
}

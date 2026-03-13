'use client';
import { useState, useEffect } from 'react';
import { hud } from '@/lib/siteConfig';

export default function CreditsCounter() {
  const [credits, setCredits] = useState(99);

  useEffect(() => {
    const interval = setInterval(() => {
      setCredits(prev => Math.max(0, prev - 1));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed bottom-5 right-5 z-[10001] text-[10px] tracking-[2px]"
      style={{
        fontFamily: "'Press Start 2P', monospace",
        color: 'var(--orange)',
        textShadow: '0 0 10px rgba(255,106,0,0.5)',
        animation: credits === 0 ? 'blink 1s step-end infinite' : 'none',
      }}
    >
      {credits > 0 ? `${hud.creditsLabel} ${String(credits).padStart(2, '0')}` : hud.insertCoinLabel}
    </div>
  );
}

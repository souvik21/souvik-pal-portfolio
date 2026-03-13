'use client';
import { useState, useEffect } from 'react';
import { hud } from '@/lib/siteConfig';

export default function PlayersOnline() {
  const [count, setCount] = useState(1);
  const [flickering, setFlickering] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlickering(true);
      setTimeout(() => {
        setCount(Math.floor(Math.random() * 5) + 1);
        setFlickering(false);
      }, 150);
    }, 10000 + Math.random() * 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed bottom-5 left-5 z-[10001] text-[9px] tracking-[2px]"
      style={{
        fontFamily: "'Press Start 2P', monospace",
        color: 'var(--green)',
        textShadow: '0 0 8px rgba(0,255,136,0.4)',
        opacity: flickering ? 0.3 : 0.7,
        transition: 'opacity 0.15s',
      }}
    >
      <span style={{ display: 'inline-block', width: 6, height: 6, background: 'var(--green)', borderRadius: '50%', marginRight: 8, boxShadow: '0 0 6px var(--green)', verticalAlign: 'middle' }} />
      {hud.playersOnlineLabel} {count}
    </div>
  );
}

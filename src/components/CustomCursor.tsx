'use client';
import { useEffect, useRef, useState } from 'react';

const TRAIL_LENGTH = 12;

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const trailPos = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }))
  );
  const [clicking, setClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);

    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleDown = () => setClicking(true);
    const handleUp = () => setClicking(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);

    let raf: number;
    const animate = () => {
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.left = `${mouseRef.current.x - 11}px`;
        cursor.style.top = `${mouseRef.current.y - 11}px`;
      }

      let prevX = mouseRef.current.x;
      let prevY = mouseRef.current.y;

      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const pos = trailPos.current[i];
        pos.x += (prevX - pos.x) * 0.35;
        pos.y += (prevY - pos.y) * 0.35;

        const el = trailRefs.current[i];
        if (el) {
          el.style.left = `${pos.x - 2}px`;
          el.style.top = `${pos.y - 2}px`;
          el.style.opacity = `${(1 - i / TRAIL_LENGTH) * 0.5}`;
          el.style.transform = `scale(${1 - (i / TRAIL_LENGTH) * 0.6})`;
        }

        prevX = pos.x;
        prevY = pos.y;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className={`custom-cursor ${clicking ? 'clicking' : ''}`}
      />
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRefs.current[i] = el; }}
          className="cursor-trail-dot"
        />
      ))}
    </>
  );
}

'use client';
import { useEffect, useRef } from 'react';
import { createLightCycle, updateLightCycle, drawLightCycle, drawGrid, type LightCycleState } from '@/lib/lightCycle';

export default function TronCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cyclesRef = useRef<LightCycleState[]>([]);
  const pulseRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Reinit cycles if needed
      if (cyclesRef.current.length === 0) {
        cyclesRef.current = [
          createLightCycle(canvas.width, canvas.height, '#ff6a00', 'rgba(255,106,0,0.3)'),
          createLightCycle(canvas.width, canvas.height, '#00cfc1', 'rgba(0,207,193,0.3)'),
        ];
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let raf: number;
    const animate = (timestamp: number) => {
      const delta = lastTimeRef.current ? (timestamp - lastTimeRef.current) / (1000 / 60) : 1;
      lastTimeRef.current = timestamp;
      const dt = Math.min(delta, 3); // clamp to avoid jumps on tab-switch

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      grad.addColorStop(0, '#0d0d1a');
      grad.addColorStop(1, '#050509');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Data pulse — cycles 0 to 1 over ~8 seconds
      pulseRef.current = (pulseRef.current + 0.002 * dt) % 1.5;
      const pulse = pulseRef.current > 1 ? 0 : pulseRef.current;

      drawGrid(ctx, w, h, window.scrollY, pulse);

      const cycles = cyclesRef.current;
      cycles.forEach(cycle => {
        updateLightCycle(cycle, w, h, cycles, dt);
        drawLightCycle(ctx, cycle);
      });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
}

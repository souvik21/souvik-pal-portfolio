'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { createGameCycle, moveGameCycle, checkCollision, updateAI, type GameCycle } from '@/lib/gameAI';

// ── Line-art light cycle sprite ──────────────────────────────────────────────
// Minimal stroked outlines with neon glow. Base = facing EAST.
function drawPixelCycle(
  ctx: CanvasRenderingContext2D,
  headX: number, headY: number,
  dx: number, dy: number,
  color: string, CELL: number
) {
  ctx.save();
  ctx.translate(headX + CELL / 2, headY + CELL / 2);
  ctx.rotate(Math.atan2(dy, dx));

  const s = 1.3; // scale factor

  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  // Body outline
  ctx.beginPath();
  ctx.moveTo(-20 * s, 0);
  ctx.lineTo(-12 * s, -6 * s);
  ctx.lineTo(10 * s, -5 * s);
  ctx.lineTo(22 * s, -1 * s);
  ctx.lineTo(24 * s, 0);
  ctx.lineTo(22 * s, 1 * s);
  ctx.lineTo(10 * s, 5 * s);
  ctx.lineTo(-12 * s, 6 * s);
  ctx.closePath();
  ctx.stroke();

  // Rear wheel
  ctx.beginPath();
  ctx.arc(-16 * s, 0, 5 * s, 0, Math.PI * 2);
  ctx.stroke();

  // Front wheel
  ctx.beginPath();
  ctx.arc(16 * s, 0, 3.5 * s, 0, Math.PI * 2);
  ctx.stroke();

  // Cockpit
  ctx.beginPath();
  ctx.moveTo(-2 * s, -3 * s);
  ctx.lineTo(6 * s, -2 * s);
  ctx.lineTo(7 * s, 0);
  ctx.lineTo(6 * s, 2 * s);
  ctx.lineTo(-2 * s, 3 * s);
  ctx.closePath();
  ctx.stroke();

  // Rider dot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(2 * s, 0, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // Handlebars
  ctx.beginPath();
  ctx.moveTo(0, -6 * s);
  ctx.lineTo(0, -9 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 6 * s);
  ctx.lineTo(0, 9 * s);
  ctx.stroke();

  ctx.restore();
}

// ── Double rail trail ────────────────────────────────────────────────────────
function drawDoubleRailTrail(
  ctx: CanvasRenderingContext2D,
  trail: { x: number; y: number }[],
  color: string,
  CELL: number
) {
  for (let i = 1; i < trail.length; i++) {
    const t = i / trail.length;
    const alpha = 0.3 + t * 0.5;
    const prev = trail[i - 1];
    const cur = trail[i];

    const dx = (cur.x - prev.x) || 0;
    const dy = (cur.y - prev.y) || 0;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len * (CELL * 0.4);
    const ny = dx / len * (CELL * 0.4);

    const px = prev.x + CELL / 2, py = prev.y + CELL / 2;
    const cx = cur.x + CELL / 2, cy = cur.y + CELL / 2;

    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.moveTo(px + nx, py + ny);
    ctx.lineTo(cx + nx, cy + ny);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(px - nx, py - ny);
    ctx.lineTo(cx - nx, cy - ny);
    ctx.stroke();

    ctx.globalAlpha = alpha * 0.15;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(px + nx, py + ny);
    ctx.lineTo(cx + nx, cy + ny);
    ctx.lineTo(cx - nx, cy - ny);
    ctx.lineTo(px - nx, py - ny);
    ctx.closePath();
    ctx.fill();
  }
}

interface TronGameProps {
  isOpen: boolean;
  onClose: () => void;
  onScore: () => void;
  audioHover: () => void;
  audioCrash: () => void;
  audioScore: () => void;
  audioClick: () => void;
}

const CELL = 10;
const GAME_SPEED = 80; // ms per tick

export default function TronGame({ isOpen, onClose, onScore, audioHover, audioCrash, audioScore, audioClick }: TronGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const playerRef = useRef<GameCycle | null>(null);
  const aiRef = useRef<GameCycle | null>(null);
  const dirQueueRef = useRef<[number, number][]>([]);
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const scoreTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getCanvasSize = useCallback(() => {
    const w = Math.floor(window.innerWidth / CELL) * CELL;
    const h = Math.floor(window.innerHeight / CELL) * CELL;
    return { w, h };
  }, []);

  const startGame = useCallback(() => {
    const { w, h } = getCanvasSize();

    const player = createGameCycle(
      Math.floor(w * 0.25 / CELL) * CELL,
      Math.floor(h * 0.5 / CELL) * CELL,
      1, 0
    );
    const ai = createGameCycle(
      Math.floor(w * 0.75 / CELL) * CELL,
      Math.floor(h * 0.5 / CELL) * CELL,
      -1, 0
    );

    playerRef.current = player;
    aiRef.current = ai;
    dirQueueRef.current = [];
    setScore(0);
    setGameState('playing');
    onScore(); // Achievement: GAMER

    // Score timer — +1 every second survived
    if (scoreTimerRef.current) clearInterval(scoreTimerRef.current);
    scoreTimerRef.current = setInterval(() => {
      setScore(prev => prev + 1);
    }, 1000);
  }, [getCanvasSize, onScore]);

  const endGame = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (scoreTimerRef.current) clearInterval(scoreTimerRef.current);
    audioCrash();
    setGameState('gameover');
    setScore(prev => {
      setHighScore(hs => Math.max(hs, prev));
      return prev;
    });
  }, [audioCrash]);

  // Game loop
  useEffect(() => {
    if (!isOpen || gameState !== 'playing') return;

    const { w, h } = getCanvasSize();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = w;
    canvas.height = h;

    const tick = () => {
      const player = playerRef.current;
      const ai = aiRef.current;
      if (!player || !ai) return;

      // Apply queued direction
      if (dirQueueRef.current.length > 0) {
        const [dx, dy] = dirQueueRef.current.shift()!;
        // Prevent reverse
        if (!(dx === -player.dx && dy === -player.dy)) {
          player.dx = dx;
          player.dy = dy;
        }
      }

      // Update AI
      updateAI(ai, player, w, h);

      // Move
      moveGameCycle(player);
      moveGameCycle(ai);

      // Check collisions
      const allTrails = [player.trail, ai.trail];
      if (checkCollision(player, w, h, allTrails)) {
        player.alive = false;
        endGame();
        return;
      }
      if (checkCollision(ai, w, h, allTrails)) {
        ai.alive = false;
        audioScore();
        setScore(prev => prev + 50);
        // Respawn AI
        const newAi = createGameCycle(
          Math.floor(Math.random() * w / CELL) * CELL,
          Math.floor(Math.random() * h / CELL) * CELL,
          Math.random() < 0.5 ? 1 : -1,
          0
        );
        aiRef.current = newAi;
      }

      // Draw
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#050509';
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += CELL * 4) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += CELL * 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Player trail (double rail)
      drawDoubleRailTrail(ctx, player.trail, '#00f0ff', CELL);

      // Player cycle
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      drawPixelCycle(ctx, player.x, player.y, player.dx, player.dy, '#00f0ff', CELL);

      // AI trail (double rail)
      if (ai.alive) {
        drawDoubleRailTrail(ctx, ai.trail, '#ff6a00', CELL);

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        drawPixelCycle(ctx, ai.x, ai.y, ai.dx, ai.dy, '#ff6a00', CELL);
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    tickRef.current = setInterval(tick, GAME_SPEED);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isOpen, gameState, getCanvasSize, endGame, audioScore]);

  // Key handlers
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (gameState === 'playing') {
        switch (e.key) {
          case 'ArrowUp': case 'w':
            e.preventDefault();
            dirQueueRef.current.push([0, -1]);
            break;
          case 'ArrowDown': case 's':
            e.preventDefault();
            dirQueueRef.current.push([0, 1]);
            break;
          case 'ArrowLeft': case 'a':
            e.preventDefault();
            dirQueueRef.current.push([-1, 0]);
            break;
          case 'ArrowRight': case 'd':
            e.preventDefault();
            dirQueueRef.current.push([1, 0]);
            break;
        }
      }

      if (e.key === 'Escape') {
        if (tickRef.current) clearInterval(tickRef.current);
        if (scoreTimerRef.current) clearInterval(scoreTimerRef.current);
        onClose();
      }

      if (gameState === 'menu' && (e.key === 'Enter' || e.key === ' ')) {
        startGame();
      }

      if (gameState === 'gameover' && (e.key === 'Enter' || e.key === ' ')) {
        startGame();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, gameState, onClose, startGame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (scoreTimerRef.current) clearInterval(scoreTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="game-overlay">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* HUD */}
      {gameState === 'playing' && (
        <div className="game-hud">
          <div>
            <div className="text-[8px] text-cyan/40 tracking-[2px] mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>SCORE</div>
            <div className="text-[20px] text-cyan font-black" style={{ fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 10px rgba(0,240,255,0.5)' }}>{score}</div>
          </div>
          <div className="text-right">
            <div className="text-[8px] text-orange/40 tracking-[2px] mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>HIGH</div>
            <div className="text-[20px] text-orange font-black" style={{ fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 10px rgba(255,106,0,0.5)' }}>{highScore}</div>
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
          <h2
            className="text-[clamp(28px,6vw,60px)] font-black text-cyan mb-4 tracking-[8px]"
            style={{ fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 30px rgba(0,240,255,0.6)' }}
          >
            TRON GAME
          </h2>
          <p className="text-[11px] text-white/40 mb-2" style={{ fontFamily: "'Share Tech Mono', 'JetBrains Mono', monospace" }}>
            Use arrow keys or WASD to steer your light cycle
          </p>
          <p className="text-[11px] text-white/40 mb-8" style={{ fontFamily: "'Share Tech Mono', 'JetBrains Mono', monospace" }}>
            Avoid walls, your trail, and the orange opponent
          </p>

          <button
            className="text-[12px] text-cyan border-2 border-cyan px-8 py-3 tracking-[4px] transition-all hover:bg-cyan/10 mb-4"
            style={{ fontFamily: "'Press Start 2P', monospace", background: 'none', cursor: 'none', boxShadow: '0 0 20px rgba(0,240,255,0.3)' }}
            onMouseEnter={audioHover}
            onClick={() => { audioClick(); startGame(); }}
          >
            START GAME
          </button>

          <button
            className="text-[9px] text-white/30 border border-white/10 px-6 py-2 tracking-[2px] transition-all hover:text-white/60 hover:border-white/30"
            style={{ fontFamily: "'Press Start 2P', monospace", background: 'none', cursor: 'none' }}
            onMouseEnter={audioHover}
            onClick={() => { audioClick(); onClose(); }}
          >
            ESC — BACK
          </button>
        </div>
      )}

      {/* Game Over */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-10">
          <h2
            className="text-[clamp(20px,5vw,48px)] font-black text-magenta mb-2 tracking-[6px]"
            style={{ fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 30px rgba(255,0,222,0.6)' }}
          >
            DEREZZED
          </h2>

          <div className="text-[24px] font-black text-cyan my-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            SCORE: {score}
          </div>

          {score >= highScore && score > 0 && (
            <div className="text-[10px] text-orange tracking-[4px] mb-4" style={{ fontFamily: "'Press Start 2P', monospace", animation: 'blink 1s step-end infinite' }}>
              ★ NEW HIGH SCORE ★
            </div>
          )}

          <div
            className="text-[10px] text-cyan tracking-[3px] mb-8"
            style={{ fontFamily: "'Press Start 2P', monospace", animation: 'blink 1.2s step-end infinite' }}
          >
            INSERT COIN TO CONTINUE
          </div>

          <div className="flex gap-4">
            <button
              className="text-[10px] text-cyan border border-cyan px-6 py-2.5 tracking-[3px] transition-all hover:bg-cyan/10"
              style={{ fontFamily: "'Press Start 2P', monospace", background: 'none', cursor: 'none' }}
              onMouseEnter={audioHover}
              onClick={() => { audioClick(); startGame(); }}
            >
              RETRY
            </button>
            <button
              className="text-[10px] text-white/30 border border-white/10 px-6 py-2.5 tracking-[3px] transition-all hover:text-white/60"
              style={{ fontFamily: "'Press Start 2P', monospace", background: 'none', cursor: 'none' }}
              onMouseEnter={audioHover}
              onClick={() => { audioClick(); setGameState('menu'); onClose(); }}
            >
              EXIT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

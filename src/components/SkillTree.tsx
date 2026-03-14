'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { skills as skillsConfig } from '@/lib/siteConfig';

interface SkillNode {
  id: string;
  name: string;
  category: string;
  level: number; // 1-5
  x: number;
  y: number;
  connections: string[];
}

const CATEGORY_COLORS = skillsConfig.categoryColors;
const CATEGORY_LABELS = skillsConfig.categoryLabels;
const SKILLS: SkillNode[] = skillsConfig.nodes;

interface SkillTreeProps {
  onHover: () => void;
}

export default function SkillTree({ onHover }: SkillTreeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const pulseRef = useRef(0);
  const isVisibleRef = useRef(false);

  const drawTree = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    pulseRef.current = (pulseRef.current + 0.008) % 1;

    // Draw connections
    SKILLS.forEach(skill => {
      const sx = skill.x * w;
      const sy = skill.y * h;

      skill.connections.forEach(connId => {
        const target = SKILLS.find(s => s.id === connId);
        if (!target) return;
        const tx = target.x * w;
        const ty = target.y * h;

        // Base line
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = `rgba(0, 240, 255, 0.08)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Animated pulse along connection
        const pulse = pulseRef.current;
        const px = sx + (tx - sx) * pulse;
        const py = sy + (ty - sy) * pulse;

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = CATEGORY_COLORS[skill.category];
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    });

    // Draw nodes
    SKILLS.forEach(skill => {
      const x = skill.x * w;
      const y = skill.y * h;
      const isHovered = hoveredSkill?.id === skill.id;
      const color = CATEGORY_COLORS[skill.category];
      const radius = isHovered ? 18 : 12;

      // Outer glow
      ctx.beginPath();
      ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(x, y, radius, x, y, radius + 8);
      gradient.addColorStop(0, color.replace(')', ', 0.15)').replace('rgb', 'rgba'));
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? color : `rgba(10, 10, 18, 0.8)`;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = isHovered ? 2.5 : 1.5;
      ctx.stroke();

      if (isHovered) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Level dots inside node
      const dotSpacing = 5;
      const totalWidth = (skill.level - 1) * dotSpacing;
      const startX = x - totalWidth / 2;

      for (let i = 0; i < skill.level; i++) {
        ctx.beginPath();
        ctx.arc(startX + i * dotSpacing, y + (isHovered ? 0 : 0), 1.5, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#000' : color;
        ctx.fill();
      }
    });
  }, [hoveredSkill]);

  // Derez-reveal observer for section content
  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('.derez-reveal');
    if (!elements) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 100);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    elements.forEach(el => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    let raf: number;
    const loop = () => {
      if (isVisibleRef.current) drawTree();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [drawTree]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    let found: SkillNode | null = null;
    for (const skill of SKILLS) {
      const sx = skill.x * w;
      const sy = skill.y * h;
      const dist = Math.hypot(mx - sx, my - sy);
      if (dist < 20) {
        found = skill;
        break;
      }
    }

    if (found !== hoveredSkill) {
      setHoveredSkill(found);
      if (found) onHover();
    }

    if (found) {
      setTooltipPos({ x: e.clientX - rect.left + 20, y: e.clientY - rect.top - 10 });
    }
  }, [hoveredSkill, onHover]);

  return (
    <section id="skills" ref={sectionRef} className="relative z-[1] min-h-screen flex flex-col items-center justify-center px-5 py-20">
      <div className="text-center mb-12 derez-reveal">
        <div
          className="text-[10px] tracking-[6px] uppercase mb-8"
          style={{ fontFamily: "'Press Start 2P', monospace", color: 'var(--magenta)', textShadow: '0 0 10px rgba(255,0,222,0.4)' }}
        >
          {skillsConfig.sectionSubtitle}
        </div>
        <h2
          className="text-[clamp(24px,5vw,48px)] font-black tracking-[6px]"
          style={{ fontFamily: "'Orbitron', sans-serif", color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,240,255,0.5), 0 0 40px rgba(0,240,255,0.2)' }}
        >
          {skillsConfig.sectionTitle}
        </h2>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-8 flex-wrap justify-center derez-reveal">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: CATEGORY_COLORS[key], boxShadow: `0 0 8px ${CATEGORY_COLORS[key]}` }} />
            <span className="text-[8px] tracking-[2px] text-white/40" style={{ fontFamily: "'Press Start 2P', monospace" }}>{label}</span>
          </div>
        ))}
      </div>

      <div
        ref={containerRef}
        className="relative w-full max-w-[1000px] derez-reveal"
        style={{ height: '500px' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredSkill(null)}
          style={{ cursor: 'none' }}
        />

        {hoveredSkill && (
          <div
            className="skill-tooltip"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <div className="text-[10px] font-bold tracking-[2px] mb-2" style={{ fontFamily: "'Press Start 2P', monospace", color: CATEGORY_COLORS[hoveredSkill.category] }}>
              {hoveredSkill.name}
            </div>
            <div className="text-[8px] text-white/40 mb-2 tracking-[1px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              {CATEGORY_LABELS[hoveredSkill.category]}
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-2"
                  style={{
                    background: i < hoveredSkill.level ? CATEGORY_COLORS[hoveredSkill.category] : 'rgba(255,255,255,0.1)',
                    boxShadow: i < hoveredSkill.level ? `0 0 4px ${CATEGORY_COLORS[hoveredSkill.category]}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

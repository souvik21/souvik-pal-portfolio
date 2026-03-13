'use client';
import { useEffect, useRef } from 'react';
import { blogs as blogsConfig } from '@/lib/siteConfig';

interface BlogsSectionProps {
  onHover: () => void;
}

const BLOGS = blogsConfig.items;

export default function BlogsSection({ onHover }: BlogsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('.derez-reveal');
    if (!elements) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="blogs" ref={sectionRef} className="relative z-[1] min-h-screen flex flex-col items-center justify-center px-5 py-20">
      <div className="text-center mb-16 derez-reveal">
        <div
          className="text-[10px] tracking-[6px] uppercase mb-8"
          style={{ fontFamily: "'Press Start 2P', monospace", color: 'var(--magenta)', textShadow: '0 0 10px rgba(255,0,222,0.4)' }}
        >
          {blogsConfig.sectionSubtitle}
        </div>
        <h2
          className="text-[clamp(24px,5vw,48px)] font-black tracking-[6px]"
          style={{ fontFamily: "'Orbitron', sans-serif", color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,240,255,0.5), 0 0 40px rgba(0,240,255,0.2)' }}
        >
          {blogsConfig.sectionTitle}
        </h2>
        <div className="w-[120px] h-[2px] mx-auto mt-8" style={{ background: 'linear-gradient(90deg, transparent, var(--magenta), transparent)', boxShadow: '0 0 10px var(--magenta)' }} />
      </div>

      <div className="w-full derez-reveal" style={{ maxWidth: 860, margin: '0 auto' }}>
        <div className="blogs-table border border-cyan/[0.12] overflow-hidden" style={{ background: 'rgba(5,5,9,0.88)', backdropFilter: 'blur(6px)', padding: 24 }}>
          {/* Header */}
          <div
            className="grid border-b-2 border-cyan/15 text-[8px] tracking-[2px] uppercase text-cyan"
            style={{
              background: 'rgba(0,240,255,0.06)',
              fontFamily: "'Press Start 2P', monospace",
              gridTemplateColumns: '60px 1fr 120px',
              padding: '16px 32px',
            }}
          >
            <span>{blogsConfig.columnHeaders.rank}</span>
            <span>{blogsConfig.columnHeaders.title}</span>
            <span className="text-right hidden sm:block">{blogsConfig.columnHeaders.date}</span>
          </div>

          {/* Rows */}
          {BLOGS.map((blog, i) => (
            <a
              key={i}
              href="#"
              className="highscore-row grid border-b border-cyan/[0.05] no-underline transition-all hover:bg-cyan/[0.06]"
              style={{
                gridTemplateColumns: '60px 1fr 120px',
                padding: '16px 32px',
                color: 'inherit',
                cursor: 'none',
              }}
              onMouseEnter={onHover}
            >
              <span
                className="text-[12px] flex items-center transition-all"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  color: i === 0 ? 'var(--orange)' : i === 1 ? 'var(--magenta)' : i === 2 ? 'var(--cyan)' : 'var(--cyan-dim)',
                  textShadow: i < 3 ? `0 0 8px ${i === 0 ? 'var(--orange-glow)' : i === 1 ? 'var(--magenta-glow)' : 'var(--cyan-glow)'}` : 'none',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[13px] text-white/60 flex items-center leading-snug transition-colors hover:text-white">
                {blog.title}
              </span>
              <span
                className="text-[8px] text-cyan/25 flex items-center justify-end tracking-[1px] hidden sm:flex"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {blog.date}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

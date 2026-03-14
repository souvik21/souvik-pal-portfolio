'use client';
import { useEffect, useRef } from 'react';
import { projects as projectsConfig } from '@/lib/siteConfig';

interface ProjectsSectionProps {
  onHover: () => void;
}

const PROJECTS = projectsConfig.items;

export default function ProjectsSection({ onHover }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('.derez-reveal');
    if (!elements) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 120);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative z-[1] min-h-screen flex flex-col items-center justify-center px-5 py-20">
      <div className="text-center mb-16 derez-reveal">
        <div
          className="text-[10px] tracking-[6px] uppercase mb-8"
          style={{ fontFamily: "'Press Start 2P', monospace", color: 'var(--magenta)', textShadow: '0 0 10px rgba(255,0,222,0.4)' }}
        >
          {projectsConfig.sectionSubtitle}
        </div>
        <h2
          className="text-[clamp(24px,5vw,48px)] font-black tracking-[6px]"
          style={{ fontFamily: "'Orbitron', sans-serif", color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,240,255,0.5), 0 0 40px rgba(0,240,255,0.2)' }}
        >
          {projectsConfig.sectionTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-[1280px] w-full px-5">
        {PROJECTS.map((project) => (
          <div
            key={project.num}
            className={`hud-card derez-reveal ${project.locked ? 'opacity-40' : ''}`}
            onMouseEnter={onHover}
          >
            <div className="hud-card-inner" style={{ padding: '2rem' }}>
              {/* HUD decorations */}
              <div className="hud-stripes" />
              <div className="hud-header-line" />

              {/* Content overlay */}
              <div className="relative z-10 p-14 pt-14 pb-12">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-[8px] text-cyan/60" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                    {project.num}
                  </span>
                  <span
                    className={`text-[6px] px-3 py-1.5 tracking-[1px] ${
                      project.statusClass === 'coming-soon'
                        ? 'text-black bg-cyan'
                        : 'text-black bg-cyan'
                    }`}
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    {project.status}
                  </span>
                </div>

                <h3
                  className="text-[15px] font-bold tracking-[2px] mb-3 text-white leading-snug"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  {project.title}
                </h3>
                <p className="text-[11px] text-white/50 leading-relaxed mb-5">
                  {project.tagline}
                </p>
                <div className="flex gap-2 flex-wrap mb-5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[6px] text-cyan border border-cyan/25 px-2 py-1 tracking-[1px] bg-cyan/[0.06]"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={project.link}
                  className={`play-btn inline-flex items-center gap-2 text-[8px] text-cyan bg-cyan/[0.06] border border-cyan/30 px-4 py-2 no-underline tracking-[2px] transition-all hover:bg-cyan/15 hover:border-cyan ${
                    project.locked ? 'opacity-30 pointer-events-none' : ''
                  }`}
                  style={{ fontFamily: "'Press Start 2P', monospace", cursor: 'none', boxShadow: project.locked ? 'none' : undefined }}
                  onMouseEnter={onHover}
                >
                  <span className="text-[12px]">▶</span> {project.cta}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

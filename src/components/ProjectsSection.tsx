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
        <div className="w-[120px] h-[2px] mx-auto mt-8" style={{ background: 'linear-gradient(90deg, transparent, var(--magenta), transparent)', boxShadow: '0 0 10px var(--magenta)' }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-[1280px] w-full px-5">
        {PROJECTS.map((project) => (
          <div
            key={project.num}
            className={`project-card border border-cyan/[0.12] derez-reveal ${project.locked ? 'opacity-40' : ''}`}
            style={{ background: 'rgba(5,5,9,0.88)', backdropFilter: 'blur(6px)', ...(project.locked ? { borderStyle: 'dashed' } : {}) }}
            onMouseEnter={onHover}
          >
            <div className="flex justify-between items-start p-10 pb-0">
              <span className="text-[10px] text-cyan-dim/50" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                {project.num}
              </span>
              <span
                className={`text-[7px] px-2 py-1 tracking-[1px] border ${
                  project.statusClass === 'coming-soon'
                    ? 'text-orange bg-orange/10 border-orange/20'
                    : 'text-cyan bg-cyan/10 border-cyan/20'
                }`}
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {project.status}
              </span>
            </div>

            <div className="p-10 pt-6">
              <h3
                className="text-[18px] font-bold tracking-[2px] mb-4 text-white"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {project.title}
              </h3>
              <p className="text-[13px] text-white/50 leading-relaxed mb-7">
                {project.tagline}
              </p>
              <div className="flex gap-2 flex-wrap mb-7">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[7px] text-magenta border border-magenta/20 px-2 py-1 tracking-[1px] bg-magenta/[0.05]"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-10 pb-10">
              <a
                href={project.link}
                className={`play-btn inline-flex items-center gap-2 text-[10px] text-cyan bg-cyan/[0.05] border border-cyan/30 px-5 py-2.5 no-underline tracking-[2px] transition-all hover:bg-cyan/10 hover:border-cyan ${
                  project.locked ? 'opacity-30 pointer-events-none' : ''
                }`}
                style={{ fontFamily: "'Press Start 2P', monospace", cursor: 'none', boxShadow: project.locked ? 'none' : undefined }}
                onMouseEnter={onHover}
              >
                <span className="text-[14px]">▶</span> {project.cta}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

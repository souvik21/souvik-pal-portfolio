'use client';
import { useEffect, useRef } from 'react';
import type { Achievement } from '@/hooks/useAchievements';
import { about } from '@/lib/siteConfig';

interface AboutSectionProps {
  onHover: () => void;
  achievements: Achievement[];
}

export default function AboutSection({ onHover, achievements }: AboutSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('.derez-reveal');
    if (!elements) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 100);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative z-[1] min-h-screen flex flex-col items-center justify-center px-5 py-20">
      <div className="text-center mb-24 derez-reveal">
        <div
          className="text-[10px] tracking-[6px] uppercase mb-8 section-subtitle-accent"
          style={{ fontFamily: "'Press Start 2P', monospace", color: 'var(--magenta)', textShadow: '0 0 10px rgba(255,0,222,0.4)', padding: '0.5rem' }}
        >
          {about.sectionSubtitle}
        </div>
        <h2
          className="text-[clamp(24px,5vw,48px)] font-black tracking-[6px]"
          style={{ fontFamily: "'Orbitron', sans-serif", color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,240,255,0.5), 0 0 40px rgba(0,240,255,0.2)' }}
        >
          {about.sectionTitle}
        </h2>
      </div>

      <div className="max-w-[700px] w-full text-center px-5">
        {/* ASCII Header */}
        <div
          className="mb-10 text-[11px] leading-[1.6] tracking-normal opacity-40 derez-reveal"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--cyan-dim)', whiteSpace: 'pre' }}
        >
          {about.boxHeader.top}{'\n'}
          {about.boxHeader.middle}{'\n'}
          {about.boxHeader.bottom}
        </div>

        <p className="text-[16px] text-white/60 leading-[1.8] mb-10 derez-reveal">
          {about.bio.prefix}<strong className="text-cyan font-normal">{about.bio.highlights[0]}</strong> navigating the grid — building interactive visualizations,
          AI-powered tools, and open-source contributions. Specializing in{' '}
          <strong className="text-cyan font-normal">{about.bio.highlights[1]}</strong>,{' '}
          <strong className="text-cyan font-normal">{about.bio.highlights[2]}</strong>, and making
          complex concepts <strong className="text-cyan font-normal">{about.bio.highlights[3]}</strong>.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 derez-reveal">
          {about.stats.map(stat => (
            <div
              key={stat.label}
              className="border border-cyan/[0.12] p-6 bg-cyan/[0.02] transition-all hover:border-cyan"
              onMouseEnter={onHover}
              style={{ cursor: 'none' }}
            >
              <div
                className="text-[28px] font-black text-cyan mb-2"
                style={{ fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 15px rgba(0,240,255,0.5)' }}
              >
                {stat.value}
              </div>
              <div
                className="text-[7px] text-cyan/40 tracking-[2px] uppercase"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Trophy Case */}
        <div className="mb-10 derez-reveal">
          <div
            className="text-[9px] tracking-[3px] uppercase mb-4 text-orange"
            style={{ fontFamily: "'Press Start 2P', monospace", textShadow: '0 0 8px rgba(255,106,0,0.3)' }}
          >
            {about.achievementCaseTitle}
          </div>
          <div className="trophy-case">
            {achievements.map((a) => (
              <div key={a.id} className={`trophy-item ${a.unlocked ? 'unlocked' : ''}`}>
                <div className="text-[18px] mb-1" style={{ opacity: a.unlocked ? 1 : 0.2 }}>{a.icon}</div>
                <div
                  className="text-[6px] tracking-[1px]"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    color: a.unlocked ? 'var(--orange)' : 'rgba(255,255,255,0.15)',
                  }}
                >
                  {a.unlocked ? a.name : '???'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex gap-4 justify-center flex-wrap derez-reveal">
          {about.socialLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-[9px] text-magenta border border-magenta/20 px-4 py-2.5 no-underline transition-all tracking-[1px] hover:border-magenta hover:bg-magenta/[0.08]"
              style={{ fontFamily: "'Press Start 2P', monospace", cursor: 'none', boxShadow: 'none' }}
              onMouseEnter={onHover}
            >
              ◆ {link.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

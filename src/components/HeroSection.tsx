'use client';
import { hero } from '@/lib/siteConfig';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative z-[1] min-h-screen flex flex-col items-center justify-center text-center px-5 pt-24 pb-20"
    >
      <div
        className="text-[14px] tracking-[8px] uppercase mb-5 opacity-0"
        style={{
          fontFamily: "'Share Tech Mono', 'JetBrains Mono', monospace",
          color: 'var(--cyan-dim)',
          animation: 'fadeInUp 1s ease 0.5s forwards',
        }}
      >
        {hero.subtitle}
      </div>

      <h1
        className="hero-title text-[clamp(36px,8vw,100px)] opacity-0"
        data-text={hero.title}
        style={{ animation: 'glitchIn 1.5s ease 0.2s forwards' }}
      >
        {hero.title}
      </h1>

      <div
        className="mt-8 text-[clamp(10px,2vw,16px)] tracking-[4px] opacity-0"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          color: 'var(--orange)',
          textShadow: '0 0 15px rgba(255,106,0,0.5)',
          animation: 'fadeInUp 1s ease 0.8s forwards',
        }}
      >
        {hero.tagline}
      </div>

      <div
        className="mt-40 text-[clamp(10px,1.5vw,14px)] tracking-[4px]"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          color: 'var(--cyan)',
          animation: 'fadeInUp 1s ease 1.2s forwards, blink 1.2s step-end 2s infinite',
          opacity: 0,
        }}
      >
        {hero.scrollCue}
      </div>
    </section>
  );
}

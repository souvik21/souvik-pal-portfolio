'use client';
import { useEffect, useState } from 'react';
import { navigation } from '@/lib/siteConfig';

interface NavigationProps {
  onHover: () => void;
  onNavigate: () => void;
  onGameOpen: () => void;
}

const NAV_ITEMS = navigation.items;

export default function Navigation({ onHover, onNavigate, onGameOpen }: NavigationProps) {
  const [active, setActive] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Track active section
    const sections = document.querySelectorAll('section[id]');
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach(s => scrollObserver.observe(s));

    // Track scroll for background opacity
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    onNavigate();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-[9990] px-4 py-3 flex justify-center gap-2 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(5,5,9,0.95)'
          : 'linear-gradient(180deg, rgba(5,5,9,0.85) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,240,255,0.08)' : '1px solid transparent',
      }}
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-btn px-3 py-2 border text-[9px] tracking-[2px] uppercase transition-all
            ${active === item.id
              ? 'text-cyan border-cyan bg-cyan/10'
              : 'text-cyan-dim border-cyan/15 bg-cyan/[0.03] hover:text-cyan hover:border-cyan hover:bg-cyan/[0.08]'
            }`}
          style={{ fontFamily: "'Press Start 2P', monospace", cursor: 'none' }}
          onMouseEnter={onHover}
          onClick={() => scrollTo(item.id)}
        >
          {item.label}
        </button>
      ))}

      <button
        className="nav-btn px-3 py-2 border text-[9px] tracking-[2px] uppercase transition-all text-orange border-orange/20 bg-orange/[0.03] hover:text-orange hover:border-orange hover:bg-orange/[0.08]"
        style={{ fontFamily: "'Press Start 2P', monospace", cursor: 'none' }}
        onMouseEnter={onHover}
        onClick={onGameOpen}
        title="Play Tron Game"
      >
        {navigation.gameButtonLabel}
      </button>
    </nav>
  );
}

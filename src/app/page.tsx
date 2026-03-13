'use client';
import { useState, useCallback, useEffect } from 'react';
import BootSequence from '@/components/BootSequence';
import TronCanvas from '@/components/TronCanvas';
import CRTOverlay from '@/components/CRTOverlay';
import CustomCursor from '@/components/CustomCursor';
import ParticleSystem from '@/components/ParticleSystem';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import Terminal from '@/components/Terminal';
import ProjectsSection from '@/components/ProjectsSection';
import BlogsSection from '@/components/BlogsSection';
import Footer from '@/components/Footer';
import TronGame from '@/components/TronGame';
import AudioToggle from '@/components/AudioToggle';
import PlayersOnline from '@/components/PlayersOnline';
import CreditsCounter from '@/components/CreditsCounter';
import { useAudio } from '@/hooks/useAudio';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import { site } from '@/lib/siteConfig';

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [siteVisible, setSiteVisible] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [konamiActive, setKonamiActive] = useState(false);

  const audio = useAudio();

  const handleBootComplete = useCallback(() => {
    setBooted(true);
    setTimeout(() => setSiteVisible(true), 100);
  }, []);

  useKonamiCode(useCallback(() => {
    audio.konami();
    setKonamiActive(true);

    const spawn = (window as unknown as { spawnParticles?: (x: number, y: number, count: number) => void }).spawnParticles;
    if (spawn) {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          spawn(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 30);
        }, i * 100);
      }
    }

    setTimeout(() => setKonamiActive(false), 3000);
  }, [audio]));

  const handleAudioToggle = useCallback(() => {
    audio.toggle();
  }, [audio]);

  const handleBootStart = useCallback(() => {
    audio.initAndPlay();
  }, [audio]);

  if (!booted) {
    return <BootSequence onComplete={handleBootComplete} onStart={handleBootStart} />;
  }

  return (
    <>
      {/* All fixed/position elements outside the animated wrapper to prevent stacking-context issues */}
      {siteVisible && (
        <>
          <TronCanvas />
          <ParticleSystem />
          <CRTOverlay />
          <CustomCursor />
          <AudioToggle enabled={audio.enabled} onToggle={handleAudioToggle} />
          <PlayersOnline />
          <CreditsCounter />
        </>
      )}

      <div className={siteVisible ? 'site-crt-on' : 'opacity-0'}>

        <Navigation
          onHover={audio.hover}
          onNavigate={audio.navigate}
          onGameOpen={() => setGameOpen(true)}
        />

        {konamiActive && (
          <div
            className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/80 pointer-events-none"
            style={{ animation: 'fadeInUp 0.3s ease' }}
          >
            <div
              className="text-[clamp(20px,5vw,48px)] text-orange tracking-[6px]"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                textShadow: '0 0 20px rgba(255,106,0,0.8), 0 0 60px rgba(255,106,0,0.4)',
                animation: 'blink 0.5s ease infinite alternate',
              }}
            >
              {site.konamiText}
            </div>
          </div>
        )}

        <main className="relative z-[2]">
          <HeroSection />
          <Terminal onGameOpen={() => setGameOpen(true)} />
          <ProjectsSection onHover={audio.hover} />
          <BlogsSection onHover={audio.hover} />
          <Footer />
        </main>

        <TronGame
          isOpen={gameOpen}
          onClose={() => setGameOpen(false)}
          onScore={() => {}}
          audioHover={audio.hover}
          audioCrash={audio.crash}
          audioScore={audio.score}
          audioClick={audio.click}
        />
      </div>
    </>
  );
}

'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { boot } from '@/lib/siteConfig';
import userAvatar from '@/app/user-avatar.jpeg';

const BOOT_LINES = boot.lines;
const ID = boot.idCard;

interface BootSequenceProps {
  onComplete: () => void;
  onStart?: () => void;
}

export default function BootSequence({ onComplete, onStart }: BootSequenceProps) {
  const [started, setStarted] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setStarted(true);
    onStart?.();
  };

  useEffect(() => {
    if (!started) return;

    let lineIndex = 0;
    let totalDelay = 0;
    const timeouts: NodeJS.Timeout[] = [];

    BOOT_LINES.forEach((line, i) => {
      totalDelay += line.delay;
      const t = setTimeout(() => {
        setLines(prev => [...prev, line.text]);
        setProgress(((i + 1) / BOOT_LINES.length) * 100);

        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }

        lineIndex++;
      }, totalDelay);
      timeouts.push(t);
    });

    const endTimeout = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 700);
    }, totalDelay + 600);
    timeouts.push(endTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete, started]);

  if (!started) {
    return (
      <div
        className="boot-screen"
        onClick={handleStart}
        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      >
        <div
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 'clamp(20px, 5vw, 42px)',
            fontWeight: 900,
            color: 'var(--cyan)',
            textShadow: '0 0 20px rgba(0,240,255,0.5), 0 0 40px rgba(0,240,255,0.2)',
            letterSpacing: 6,
            marginBottom: 32,
          }}
        >
          {boot.splashTitle}
        </div>
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            color: 'var(--cyan)',
            letterSpacing: 3,
            animation: 'blink 1.2s step-end infinite',
          }}
        >
          {boot.splashPrompt}
        </div>
      </div>
    );
  }

  return (
    <div className={`boot-screen ${fadeOut ? 'boot-fade-out' : ''}`}>
      <div className="boot-main">
        <div
          ref={containerRef}
          className="boot-left"
        >
          <div className="boot-text">
            {lines.map((line, i) => (
              <div key={i}>
                {line}
                {i === lines.length - 1 && <span className="boot-cursor" />}
              </div>
            ))}
          </div>
        </div>

        <div className="boot-right">
          <div className="boot-id-card">
            {/* Header bar */}
            <div className="boot-id-header">
              <span className="boot-id-header-left">{ID.headerLeft}</span>
              <span className="boot-id-header-right">
                {ID.headerRight}{' '}
                <span className="boot-id-signal-bars">
                  <span className="boot-id-signal-bar active" />
                  <span className="boot-id-signal-bar active" />
                  <span className="boot-id-signal-bar active" />
                  <span className="boot-id-signal-bar" />
                </span>
              </span>
            </div>

            {/* Identity section */}
            <div className="boot-id-identity">
              <div className="boot-id-identity-top">
                <span className="boot-id-label">{ID.label}</span>
                <div className="boot-id-access">
                  <span className="boot-id-label">ACCESS</span>
                  <span className="boot-id-access-dots">{ID.accessDots}</span>
                </div>
              </div>
              <div className="boot-id-name">{ID.name}</div>
            </div>

            {/* Body: avatar + info */}
            <div className="boot-id-body">
              <div className="boot-id-avatar-wrap">
                <div className="boot-avatar">
                  <Image
                    src={userAvatar}
                    alt="User avatar"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                  <div className="boot-avatar-scanlines" />
                </div>
              </div>
              <div className="boot-id-info">
                <div className="boot-id-info-row">
                  <span>{ID.nexus}</span>
                  <span>☐</span>
                </div>
                <div className="boot-id-info-row">
                  <span className="boot-id-label">SEC CODE</span>
                </div>
                <div className="boot-id-info-row">
                  <span>{ID.secCode}</span>
                </div>
                <div className="boot-id-info-spacer" />
                <div className="boot-id-info-row boot-id-role-jp">
                  <span>{ID.roleJp}</span>
                </div>
                <div className="boot-id-info-row boot-id-role">
                  <span>{ID.role}</span>
                </div>
                <div className="boot-id-info-spacer" />
                <div className="boot-id-info-org">
                  <span className="boot-id-org-icon">▮▮</span>
                  <div className="boot-id-org-text">
                    <span className="boot-id-org-name">{ID.org}</span>
                    <span className="boot-id-org-sub">{ID.orgSub}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Authorization text */}
            <div className="boot-id-auth">
              {ID.authText}
            </div>

            {/* Footer */}
            <div className="boot-id-footer">
              <span className="boot-id-footer-bars">▮▮▮</span>
              {' '}{ID.footer}{' '}
              <span className="boot-id-footer-bars">▮▮▮</span>
            </div>
          </div>
        </div>
      </div>

      <div className="boot-progress">
        <div
          className="boot-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        style={{
          marginTop: 12,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          color: 'rgba(0, 240, 255, 0.3)',
          letterSpacing: 3,
          textAlign: 'center',
        }}
      >
        {boot.footerLabel}
      </div>
    </div>
  );
}

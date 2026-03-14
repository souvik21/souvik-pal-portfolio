'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { terminal as terminalConfig } from '@/lib/siteConfig';

interface TerminalProps {
  onGameOpen: () => void;
}

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'highlight' | 'ascii';
  text: string;
}

const STARTUP_TIME = Date.now();

export default function Terminal({ onGameOpen }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>(terminalConfig.welcomeLines);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [matrixActive, setMatrixActive] = useState(false);
  const [cursorActive, setCursorActive] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }, 10);
  }, []);

  const addLines = useCallback((newLines: TerminalLine[]) => {
    setLines(prev => [...prev, ...newLines]);
    scrollToBottom();
  }, [scrollToBottom]);

  const triggerMatrix = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div');
      el.className = 'matrix-char';
      el.textContent = chars[Math.floor(Math.random() * chars.length)];
      el.style.left = `${Math.random() * 100}vw`;
      el.style.animationDuration = `${1 + Math.random() * 2}s`;
      el.style.animationDelay = `${Math.random() * 2}s`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }
  }, []);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    addLines([{ type: 'input', text: `> ${cmd}` }]);
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    switch (trimmed) {
      case 'help':
        addLines([{ type: 'output', text: terminalConfig.helpText }]);
        break;
      case 'about':
        addLines([{ type: 'ascii', text: terminalConfig.aboutText }]);
        break;
      case 'whoami':
        addLines([{ type: 'success', text: terminalConfig.whoamiText }]);
        break;
      case 'ls projects':
        addLines([{ type: 'output', text: terminalConfig.projectsList }]);
        break;
      case 'ls blogs':
        addLines([{ type: 'output', text: terminalConfig.blogsList }]);
        break;
      case 'skills':
        addLines([{ type: 'output', text: terminalConfig.skillsText }]);
        break;
      case 'cat readme':
        addLines([{ type: 'output', text: terminalConfig.readmeText }]);
        break;
      case 'play':
        addLines([{ type: 'success', text: terminalConfig.launchingGame }]);
        setTimeout(() => onGameOpen(), 500);
        break;
      case 'matrix':
        setMatrixActive(prev => !prev);
        addLines([{ type: 'success', text: matrixActive ? terminalConfig.matrixDisabled : terminalConfig.matrixEnabled }]);
        if (!matrixActive) triggerMatrix();
        break;
      case 'uptime': {
        const uptime = Math.floor((Date.now() - STARTUP_TIME) / 1000);
        const mins = Math.floor(uptime / 60);
        const secs = uptime % 60;
        addLines([{ type: 'output', text: `System uptime: ${mins}m ${secs}s` }]);
        break;
      }
      case 'date':
        addLines([{ type: 'output', text: new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' }) }]);
        break;
      case 'clear':
        setLines([]);
        break;
      case 'sudo':
      case 'sudo rm -rf /':
        addLines([{ type: 'error', text: terminalConfig.sudoError }]);
        break;
      case 'ls':
        addLines([{ type: 'output', text: terminalConfig.lsOutput }]);
        break;
      case '':
        break;
      default:
        addLines([{ type: 'error', text: `${terminalConfig.notFoundPrefix} ${cmd}. ${terminalConfig.notFoundSuffix}` }]);
    }
  }, [addLines, matrixActive, onGameOpen, triggerMatrix]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  }, [input, history, historyIndex, processCommand]);

  // Intersection observer for scroll-reveal
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

  // Activate blinking cursor when terminal section scrolls into view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCursorActive(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="terminal"
      ref={sectionRef}
      className="relative z-[1] min-h-screen flex flex-col items-center justify-center px-5 py-20"
    >
      {/* Section header */}
      <div className="text-center derez-reveal" style={{ marginBottom: '2rem' }}>
        <div
          className="text-[10px] tracking-[6px] uppercase"
          style={{ fontFamily: "'Press Start 2P', monospace", color: 'var(--magenta)', textShadow: '0 0 10px rgba(255,0,222,0.4)' }}
        >
          {terminalConfig.sectionTitle}
        </div>
      </div>

      {/* Terminal window */}
      <div
        className="terminal-window w-full derez-reveal"
        style={{ maxWidth: 860 }}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="terminal-header">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan" style={{ boxShadow: '0 0 6px var(--cyan)' }} />
            <span className="text-[8px] tracking-[2px] text-cyan/60" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              {terminalConfig.windowTitle}
            </span>
          </div>
          <span className="text-[8px] text-cyan/20">
            {terminalConfig.windowHint}
          </span>
        </div>

        <div className="terminal-body" ref={bodyRef}>
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                line.type === 'input' ? 'text-orange' :
                line.type === 'error' ? 'terminal-error' :
                line.type === 'success' ? 'terminal-success' :
                line.type === 'highlight' ? 'terminal-highlight' :
                line.type === 'ascii' ? 'text-cyan text-[11px]' :
                'terminal-response'
              }
              style={{ whiteSpace: 'pre' }}
            >
              {line.text}
            </div>
          ))}
        </div>

        <div className="terminal-input-line" onClick={() => inputRef.current?.focus()}>
          <span className="terminal-prompt" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10 }}>
            {'>'}
          </span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              className="terminal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              style={{ cursor: 'none' }}
            />
            <span
              className={`terminal-cursor${cursorActive ? ' blink' : ''}`}
              style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: `${input.length * 8.4}px` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';
import { audio as audioConfig } from '@/lib/siteConfig';

interface AudioToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function AudioToggle({ enabled, onToggle }: AudioToggleProps) {
  return (
    <button
      className={`fixed top-5 right-5 z-[10001] border px-3 py-2 text-[10px] tracking-[1px] uppercase transition-all ${
        enabled
          ? 'text-cyan border-cyan/40 hover:border-cyan'
          : 'text-cyan-dim border-cyan/10 hover:border-cyan/30'
      }`}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        background: enabled ? 'rgba(0,240,255,0.05)' : 'none',
        cursor: 'none',
        boxShadow: enabled ? '0 0 10px rgba(0,240,255,0.2)' : 'none',
      }}
      onClick={onToggle}
      aria-label="Toggle audio"
    >
      {enabled ? audioConfig.toggleLabelOn : audioConfig.toggleLabelOff}
    </button>
  );
}

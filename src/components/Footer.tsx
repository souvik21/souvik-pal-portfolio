'use client';
import { footer as footerConfig } from '@/lib/siteConfig';

export default function Footer() {
  return (
    <footer className="relative z-[1] text-center py-10 border-t border-cyan/[0.08]">
      <p
        className="text-[8px] tracking-[3px]"
        style={{ fontFamily: "'Press Start 2P', monospace", color: 'rgba(0,240,255,0.2)' }}
      >
        {footerConfig.text}
      </p>
    </footer>
  );
}

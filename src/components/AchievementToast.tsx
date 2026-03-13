'use client';
import type { Achievement } from '@/hooks/useAchievements';
import { achievements as achievementsConfig } from '@/lib/siteConfig';

interface AchievementToastProps {
  toasts: Achievement[];
}

export default function AchievementToast({ toasts }: AchievementToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="achievement-toast-container">
      {toasts.map((toast, i) => (
        <div
          key={`${toast.id}-${i}`}
          className="achievement-toast"
        >
          <div className="flex items-center gap-3">
            <div className="text-[24px]">{toast.icon}</div>
            <div>
              <div
                className="text-[7px] text-orange/60 tracking-[2px] mb-1"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {achievementsConfig.toastHeader}
              </div>
              <div
                className="text-[10px] text-orange tracking-[1px]"
                style={{ fontFamily: "'Press Start 2P', monospace", textShadow: '0 0 8px rgba(255,106,0,0.4)' }}
              >
                {toast.name}
              </div>
              <div className="text-[11px] text-white/50 mt-1" style={{ fontFamily: "'Share Tech Mono', 'JetBrains Mono', monospace" }}>
                {toast.description}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

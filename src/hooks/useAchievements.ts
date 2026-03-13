'use client';
import { useState, useCallback, useRef } from 'react';
import { achievements as achievementsConfig } from '@/lib/siteConfig';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = achievementsConfig.items;

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [toasts, setToasts] = useState<Achievement[]>([]);
  const toastIdRef = useRef(0);

  const unlock = useCallback((id: string) => {
    setAchievements(prev => {
      const existing = prev.find(a => a.id === id);
      if (!existing || existing.unlocked) return prev;

      const updated = prev.map(a => a.id === id ? { ...a, unlocked: true } : a);
      const achievement = updated.find(a => a.id === id)!;

      // Show toast
      toastIdRef.current++;
      setToasts(t => [...t, achievement]);
      setTimeout(() => {
        setToasts(t => t.filter(toast => toast.id !== id));
      }, 4500);

      return updated;
    });
  }, []);

  return { achievements, unlock, toasts };
}

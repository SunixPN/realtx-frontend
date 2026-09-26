'use client';
import { useEffect } from 'react';
import { flushPendingToast } from '@/shared/helpers/show-toast';

// Показывает тост, отложенный через showToastAfterReload
export function PendingToast() {
  useEffect(() => {
    flushPendingToast();
  }, []);
  return null;
}

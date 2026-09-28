'use client';
import { useEffect } from 'react';
import { flushPendingToast } from '@/shared/helpers/show-toast';

export function PendingToast() {
  useEffect(() => {
    flushPendingToast();
  }, []);
  return null;
}

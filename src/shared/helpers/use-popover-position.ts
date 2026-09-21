import { useEffect, useState, type RefObject } from 'react';
export interface PopoverPosition {
  top:   number;
  left:  number;
  width: number;
}

export function usePopoverPosition(
  triggerRef: RefObject<HTMLElement | null>,
  open: boolean,
): PopoverPosition | null {
  const [pos, setPos] = useState<PopoverPosition | null>(null);
  useEffect(() => {
    if (!open || !triggerRef.current) {
      setPos(null);
      return;
    }
    const update = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom, left: rect.left, width: rect.width });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, triggerRef]);
  return pos;
}

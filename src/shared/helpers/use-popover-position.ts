import { useEffect, useState, type RefObject } from 'react';

export interface PopoverPosition {
  top:   number;
  left:  number;
  width: number;
}

/**
 * Отслеживает позицию триггера — top/left/width его bounding rect.
 * Обновляется при скролле любого предка и ресайзе окна.
 * Используется вместе с createPortal и position: fixed, чтобы
 * выпадашка не резалась overflow'ом родителей.
 */
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
    // capture: true — ловим скроллы всех предков, а не только окна
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, triggerRef]);

  return pos;
}

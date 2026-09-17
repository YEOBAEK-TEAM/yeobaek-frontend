import { useEffect, useRef, type MouseEvent, type PointerEvent } from "react";

const LONG_PRESS_MS = 500;

const MOVE_TOLERANCE_PX = 10;

// 길게 누르거나 우클릭하면 실행, 스크롤 중 이동은 취소
export const useLongPress = (onLongPress: () => void, enabled: boolean) => {
  const timerRef = useRef(0);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const cancel = () => {
    window.clearTimeout(timerRef.current);
    startRef.current = null;
  };

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  if (!enabled) return {};

  return {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      startRef.current = { x: event.clientX, y: event.clientY };
      timerRef.current = window.setTimeout(onLongPress, LONG_PRESS_MS);
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const start = startRef.current;
      if (!start) return;

      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > MOVE_TOLERANCE_PX) {
        cancel();
      }
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu: (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      cancel();
      onLongPress();
    },
  };
};

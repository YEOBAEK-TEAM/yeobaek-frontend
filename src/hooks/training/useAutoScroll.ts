import { useCallback, useEffect, useRef } from "react";

const STICK_THRESHOLD_PX = 80;

// 메시지 자동 스크롤
export const useAutoScroll = (dependency: unknown) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const distance = container.scrollHeight - container.scrollTop - container.clientHeight;
    stickToBottomRef.current = distance < STICK_THRESHOLD_PX;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !stickToBottomRef.current) return;

    container.scrollTop = container.scrollHeight;
  }, [dependency]);

  return { containerRef, handleScroll };
};

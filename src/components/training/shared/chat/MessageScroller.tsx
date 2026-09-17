import { useAutoScroll } from "@/hooks/training/useAutoScroll";

import type { ReactNode } from "react";

type MessageScrollerProps = {
  dependency: unknown;
  children: ReactNode;
};

// 메시지 목록 스크롤 영역
export default function MessageScroller({ dependency, children }: MessageScrollerProps) {
  const { containerRef, handleScroll } = useAutoScroll(dependency);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      aria-live="polite"
      className="flex-1 space-y-4 overflow-y-auto px-5 py-5"
    >
      {children}
    </div>
  );
}

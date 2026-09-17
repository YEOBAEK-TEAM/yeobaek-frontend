import { useCallback, useEffect, useRef, useState } from "react";

const EDGE_TOLERANCE_PX = 4;

// 가로 스크롤과 좌우 버튼 상태 관리
export const useHorizontalScroll = (pageRatio = 0.8) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // 스크롤 위치 기준 좌우 버튼 노출 판단
  const refresh = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const maxScroll = container.scrollWidth - container.clientWidth;

    setCanScrollPrev(container.scrollLeft > EDGE_TOLERANCE_PX);
    setCanScrollNext(container.scrollLeft < maxScroll - EDGE_TOLERANCE_PX);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame = 0;

    const handleScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(refresh);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new ResizeObserver(refresh);
    observer.observe(container);

    refresh();

    return () => {
      window.cancelAnimationFrame(frame);
      container.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [refresh]);

  const scrollByPage = (direction: 1 | -1) => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction * container.clientWidth * pageRatio,
      behavior: "smooth",
    });
  };

  return {
    containerRef,
    canScrollPrev,
    canScrollNext,
    scrollPrev: () => scrollByPage(-1),
    scrollNext: () => scrollByPage(1),
    refresh,
  };
};

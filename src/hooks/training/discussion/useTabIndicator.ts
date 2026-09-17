import { useLayoutEffect, useRef } from "react";

// 선택된 탭 라벨 위치와 너비에 인디케이터 맞춤
export const useTabIndicator = (activeKey: string) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    const label = container?.querySelector<HTMLElement>(`[data-tab-label="${activeKey}"]`);

    if (!container || !indicator || !label) return;

    const move = () => {
      const left = label.getBoundingClientRect().left - container.getBoundingClientRect().left;

      indicator.style.width = `${label.offsetWidth}px`;
      indicator.style.transform = `translateX(${left}px)`;
    };

    move();

    // 첫 배치는 애니메이션 없이 적용 후 전환 활성화
    if (!indicator.dataset.ready) {
      indicator.getBoundingClientRect();
      indicator.dataset.ready = "true";
    }

    const observer = new ResizeObserver(move);
    observer.observe(container);
    observer.observe(label);

    return () => observer.disconnect();
  }, [activeKey]);

  return { containerRef, indicatorRef };
};

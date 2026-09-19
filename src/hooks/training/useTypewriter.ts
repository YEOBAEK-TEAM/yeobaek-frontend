import { useEffect, useRef, useState } from "react";

// 한 글자씩 찍히는 간격
const TYPING_INTERVAL_MS = 28;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// AI 답변을 타자 치듯 조금씩 드러냄, 끄면 전체가 바로 보임
export const useTypewriter = (text: string, enabled: boolean) => {
  const [isReduced] = useState(prefersReducedMotion);
  const shouldAnimate = enabled && !isReduced;

  const [length, setLength] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    indexRef.current = 0;

    const timer = window.setInterval(() => {
      indexRef.current += 1;
      setLength(indexRef.current);

      if (indexRef.current >= text.length) window.clearInterval(timer);
    }, TYPING_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [text, shouldAnimate]);

  const visibleLength = shouldAnimate ? Math.min(length, text.length) : text.length;

  return {
    visibleText: text.slice(0, visibleLength),
    isTyping: visibleLength < text.length,
  };
};

import { useEffect } from "react";

import { useTypewriter } from "@/hooks/training/useTypewriter";

type TypingTextProps = {
  text: string;
  enabled: boolean;
  onTick?: () => void;
};

// 글자가 늘어나는 동안 스크롤이 따라가도록 변화를 알림
export default function TypingText({ text, enabled, onTick }: TypingTextProps) {
  const { visibleText, isTyping } = useTypewriter(text, enabled);

  useEffect(() => {
    onTick?.();
  }, [visibleText, onTick]);

  return (
    <>
      {visibleText}
      {isTyping && (
        <span aria-hidden="true" className="ml-0.5 inline-block animate-pulse">
          |
        </span>
      )}
    </>
  );
}

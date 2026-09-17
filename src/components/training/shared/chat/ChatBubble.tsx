import type { ReactNode } from "react";

type ChatBubbleProps = {
  variant: "riti" | "user";
  children: ReactNode;
};

export default function ChatBubble({ variant, children }: ChatBubbleProps) {
  const background = variant === "riti" ? "bg-[#DEE2D0]" : "bg-[#F0ECE3]";

  // 발신자별 말풍선 최대 폭
  const maxWidth = variant === "riti" ? "max-w-full" : "max-w-[78%]";

  return (
    <div
      className={`rounded-2xl px-4 py-3 text-[13px] leading-[21px] font-medium break-words whitespace-pre-line text-[#2C2A2B] ${maxWidth} ${background}`}
    >
      {children}
    </div>
  );
}

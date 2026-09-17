import Clip from "@/assets/images/library/Clip.png";

import type { ReactNode } from "react";

type PaperCardProps = {
  children: ReactNode;
};

// 올리브 종이 위에 클립으로 고정된 기울어진 종이 카드
export default function PaperCard({ children }: PaperCardProps) {
  return (
    <div className="relative mx-auto h-78 w-full max-w-97.5 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 h-60 w-79 -translate-x-1/2 -translate-y-1/2 rotate-[4.6deg] bg-[#B8BE9F]"
      />

      {/* 내용까지 함께 기울어진 앞 종이 */}
      <div className="absolute top-1/2 left-1/2 h-60 w-79 -translate-x-1/2 -translate-y-1/2 -rotate-[5.6deg] rounded-sm bg-[#F7F6F1] shadow-[0_8px_18px_rgba(0,0,0,0.14)]">
        {children}

        <img
          src={Clip}
          alt=""
          className="pointer-events-none absolute -top-4.5 right-4 h-18 w-auto object-contain"
        />
      </div>
    </div>
  );
}

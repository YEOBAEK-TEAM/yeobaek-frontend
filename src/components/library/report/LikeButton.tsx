import { Heart } from "lucide-react";
import { useRef, type MouseEvent } from "react";

import { getReportLikeLabel } from "@/constants/library/report";

type LikeButtonProps = {
  bookTitle: string;
  isLiked: boolean;
  onToggle: () => void;
};

const POP_KEYFRAMES: Keyframe[] = [{ scale: 1 }, { scale: 1.25 }, { scale: 1 }];

export default function LikeButton({ bookTitle, isLiked, onToggle }: LikeButtonProps) {
  const iconRef = useRef<SVGSVGElement>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // 카드 상세 이동과 분리
    event.stopPropagation();
    onToggle();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    iconRef.current?.animate(POP_KEYFRAMES, { duration: 220, easing: "ease-out" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isLiked}
      aria-label={getReportLikeLabel(bookTitle)}
      className="flex h-10 w-10 items-center justify-center"
    >
      <Heart
        ref={iconRef}
        aria-hidden="true"
        strokeWidth={isLiked ? 0 : 2}
        className={`h-6 w-6 ${isLiked ? "fill-[#EDA7CB] text-[#EDA7CB]" : "fill-none text-[#4F4D4E]"}`}
      />
    </button>
  );
}

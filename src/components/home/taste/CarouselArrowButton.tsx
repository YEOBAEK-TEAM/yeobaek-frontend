import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselArrowButtonProps = {
  side: "prev" | "next";
  visible: boolean;
  onClick: () => void;
};

export default function CarouselArrowButton({ side, visible, onClick }: CarouselArrowButtonProps) {
  const Icon = side === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "prev" ? "이전 도서" : "다음 도서"}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`absolute top-1/2 z-20 flex h-8 w-6 -translate-y-1/2 items-center justify-center text-[#4F4D4E] transition-opacity duration-200 motion-reduce:transition-none ${
        side === "prev" ? "left-0" : "right-0"
      } ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <Icon aria-hidden="true" className="h-6 w-6" />
    </button>
  );
}

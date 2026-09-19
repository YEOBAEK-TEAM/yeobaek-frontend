import { ChevronRight } from "lucide-react";

import type { OtherPerspectiveResponse } from "@/types/training/bookReportTraining";

type PerspectiveCardProps = {
  perspectives: OtherPerspectiveResponse[];
  onSelect?: (bookReviewId: number) => void;
};

// 같은 책을 읽은 다른 독자의 관점 묶음
export default function PerspectiveCard({ perspectives, onSelect }: PerspectiveCardProps) {
  if (perspectives.length === 0) return null;

  return (
    <ul className="flex w-full flex-col gap-2.5 rounded-2xl bg-[#DEE2D0] p-3">
      {perspectives.map((perspective) => (
        <li key={perspective.bookReviewId}>
          <button
            type="button"
            disabled={!onSelect}
            onClick={() => onSelect?.(perspective.bookReviewId)}
            className="flex w-full items-center gap-2 rounded-xl bg-[#F7F8F4] px-4 py-3.5 text-left"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-[#2C2A2B]">
                {perspective.nickname}
              </span>

              <span className="mt-1.5 block text-[13px] leading-[19px] break-keep text-[#54555A]">
                “{perspective.content}”
              </span>
            </span>

            <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-[#8F8B85]" />
          </button>
        </li>
      ))}
    </ul>
  );
}

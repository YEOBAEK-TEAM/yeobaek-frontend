import BookCover from "@/components/common/bookCover/BookCover";
import LikeButton from "@/components/library/report/LikeButton";

import type { MyReportView } from "@/types/library/report";

type MyReportCardProps = {
  report: MyReportView;
  onOpen: () => void;
  onToggleLike: () => void;
};

export default function MyReportCard({ report, onOpen, onToggleLike }: MyReportCardProps) {
  return (
    <article className="relative h-50 w-28.5 rounded-lg border border-[#EAE8E3] bg-[#F7F6F1]">
      {/* 카드 전체 클릭 영역, 좋아요 버튼은 위에 겹쳐 분리 */}
      <button
        type="button"
        onClick={onOpen}
        className="flex h-full w-full flex-col px-3 pt-2.5 pb-3 text-left"
      >
        <BookCover src={report.coverUrl} className="h-19.5 w-13 shrink-0" />

        <p className="mt-2.5 truncate text-[17px] leading-6 font-bold text-[#2C2A2B]">
          {report.bookTitle}
        </p>
        <p className="mt-1 text-[14px] leading-5 font-semibold text-[#4F4D4E] tabular-nums">
          {report.dateLabel}
        </p>
        <p className="mt-1 line-clamp-2 text-[15px] leading-5 font-medium text-[#4F4D4E]">
          {report.quote}
        </p>
      </button>

      <div className="absolute top-2 right-1">
        <LikeButton bookTitle={report.bookTitle} isLiked={report.isLiked} onToggle={onToggleLike} />
      </div>
    </article>
  );
}

import { EllipsisVertical } from "lucide-react";

import PasswordUnseenIcon from "@/assets/icons/BookReview/passwordUnseenIcon.svg";
import BookCover from "@/components/common/bookCover/BookCover";
import LikeButton from "@/components/library/report/LikeButton";
import { REPORT_EDITOR } from "@/constants/library/report";

import type { MyReportView } from "@/types/library/report";

type ReportListItemProps = {
  report: MyReportView;
  datePrefix: string;
  onOpen: () => void;
  onToggleLike?: () => void;
};

export default function ReportListItem({
  report,
  datePrefix,
  onOpen,
  onToggleLike,
}: ReportListItemProps) {
  return (
    <article className="relative rounded-2xl border border-[#EAE8E3] bg-[#FBFBFB]">
      {/* 카드 전체가 작성 화면으로 이동, 좋아요만 위에 겹쳐 분리 */}
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-3.5 p-3 pr-11 text-left"
      >
        <BookCover src={report.coverUrl} className="h-19 w-13 shrink-0 rounded-sm bg-[#EFEDE7]" />

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="min-w-0 truncate text-[17px] font-bold text-[#4F4D4E]">
              {report.bookTitle}
            </span>

            {/* 나만 보기는 리티 학습과 다른 관점 보기에서 빠짐 */}
            {report.isPrivate && (
              <img
                src={PasswordUnseenIcon}
                alt={REPORT_EDITOR.privateBadgeAlt}
                className="h-4 w-4 shrink-0"
              />
            )}
          </span>
          <span className="mt-0.5 block truncate text-[15px] text-[#8F8F8F]">
            {report.reportTitle}
          </span>
          <span className="mt-1 block text-[14px] text-[#A89F94] tabular-nums">
            {datePrefix} {report.dateLabel}
          </span>
        </span>
      </button>

      {/* 메뉴 동작은 아직 정해지지 않아 표시만 */}
      <EllipsisVertical
        aria-hidden="true"
        className="absolute top-4 right-3 h-5 w-5 text-[#A1A7AD]"
      />

      {onToggleLike && (
        <div className="absolute right-1.5 bottom-1">
          <LikeButton
            bookTitle={report.bookTitle}
            isLiked={report.isLiked}
            onToggle={onToggleLike}
          />
        </div>
      )}
    </article>
  );
}

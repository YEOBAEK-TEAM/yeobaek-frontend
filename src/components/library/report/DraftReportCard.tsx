import BookCover from "@/components/common/bookCover/BookCover";
import PaperCard from "@/components/library/report/PaperCard";
import { DRAFT_REPORT } from "@/constants/library/report";

import type { DraftReportView } from "@/types/library/report";

type DraftReportCardProps = {
  draft: DraftReportView | null;
  latestReport: DraftReportView | null;
  onContinue: () => void;
  onWrite: () => void;
};

type BookSummaryProps = {
  report: DraftReportView;
};

const ACTION_CLASS =
  "flex h-12 w-full items-center justify-center rounded-lg bg-[#4F4D4E] text-[17px] font-bold text-white active:bg-[#3F3D3E]";

// 긴 제목은 한 단계 작게 줄바꿈
const LONG_TITLE_LENGTH = 10;

function BookSummary({ report }: BookSummaryProps) {
  const titleClassName =
    report.title.length > LONG_TITLE_LENGTH ? "text-[18px] leading-6" : "text-[22px] leading-7";

  return (
    <div className="flex items-center justify-center gap-4">
      <BookCover
        src={report.coverUrl}
        className="h-36 w-26 shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
      />

      <div className="min-w-0">
        {/* 오른쪽 위 클립에 가리지 않도록 제목만 여백 */}
        <h2 className={`pr-9 font-bold break-keep text-[#2C2A2B] ${titleClassName}`}>
          {report.title}
        </h2>
        {report.quote && (
          <p className="mt-1 line-clamp-2 text-[15px] leading-5 font-semibold break-keep text-[#4F4D4E]">
            {report.quote}
          </p>
        )}
        <p className="mt-1.5 text-[16px] leading-6 font-medium break-keep text-[#54555A]">
          {report.subtitle}
        </p>
        <p className="mt-0.5 text-[16px] font-medium whitespace-nowrap text-[#54555A] tabular-nums">
          {report.completedLabel}
        </p>
      </div>
    </div>
  );
}

export default function DraftReportCard({
  draft,
  latestReport,
  onContinue,
  onWrite,
}: DraftReportCardProps) {
  // 작성 중이면 이어쓰기, 없으면 가장 최근 독후감과 새 작성 버튼
  const banner = draft
    ? { report: draft, actionLabel: DRAFT_REPORT.continueLabel, onAction: onContinue }
    : latestReport && {
        report: latestReport,
        actionLabel: DRAFT_REPORT.newReportLabel,
        onAction: onWrite,
      };

  if (banner) {
    return (
      <PaperCard>
        <div className="flex h-full flex-col px-5 pt-4 pb-4">
          {/* 버튼 위 남은 공간의 가운데에 책 정보 배치 */}
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <BookSummary report={banner.report} />
          </div>

          <button type="button" onClick={banner.onAction} className={`mt-3 ${ACTION_CLASS}`}>
            {banner.actionLabel}
          </button>
        </div>
      </PaperCard>
    );
  }

  return (
    <PaperCard>
      <div className="flex h-full flex-col px-5 pt-3 pb-4">
        <p className="flex flex-1 items-center justify-center text-center text-[17px] leading-6 font-semibold whitespace-pre-line text-[#54555A]">
          {DRAFT_REPORT.emptyText}
        </p>

        <button type="button" onClick={onWrite} className={ACTION_CLASS}>
          {DRAFT_REPORT.writeLabel}
        </button>
      </div>
    </PaperCard>
  );
}

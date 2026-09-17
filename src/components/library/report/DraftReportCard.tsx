import PaperCard from "@/components/library/report/PaperCard";
import { DRAFT_REPORT } from "@/constants/library/report";

import type { LatestReportView } from "@/types/library/report";

type DraftReportCardProps = {
  report: LatestReportView | null;
  onWrite: () => void;
};

type BookSummaryProps = {
  report: LatestReportView;
};

const ACTION_CLASS =
  "flex h-12 w-full items-center justify-center rounded-lg bg-[#4F4D4E] text-[17px] font-bold text-white active:bg-[#3F3D3E]";

// 긴 제목은 한 단계 작게 줄바꿈
const LONG_TITLE_LENGTH = 10;

function BookSummary({ report }: BookSummaryProps) {
  const titleClassName =
    report.title.length > LONG_TITLE_LENGTH ? "text-[18px] leading-6" : "text-[22px] leading-7";

  return (
    <div className="min-w-0 text-center">
      {/* 오른쪽 위 클립에 가리지 않도록 좌우 여백 */}
      <h2 className={`px-9 font-bold break-keep text-[#2C2A2B] ${titleClassName}`}>
        {report.title}
      </h2>
      <p className="mt-1.5 text-[16px] leading-6 font-medium break-keep text-[#54555A]">
        {report.subtitle}
      </p>
      {report.completedLabel && (
        <p className="mt-0.5 text-[16px] font-medium whitespace-nowrap text-[#54555A] tabular-nums">
          {report.completedLabel}
        </p>
      )}
    </div>
  );
}

// 서버가 고른 배너용 책(작성 중 또는 최근 독후감) 표시, 없으면 작성 안내
export default function DraftReportCard({ report, onWrite }: DraftReportCardProps) {
  return (
    <PaperCard>
      <div className="flex h-full flex-col px-5 pt-4 pb-4">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          {report ? (
            <BookSummary report={report} />
          ) : (
            <p className="text-center text-[17px] leading-6 font-semibold whitespace-pre-line text-[#54555A]">
              {DRAFT_REPORT.emptyText}
            </p>
          )}
        </div>

        <button type="button" onClick={onWrite} className={`mt-3 ${ACTION_CLASS}`}>
          {DRAFT_REPORT.writeLabel}
        </button>
      </div>
    </PaperCard>
  );
}

import type { ReadingReport } from "@/types/training/readingReport";

// 대화 상단 고정 독후감 배너
export default function PinnedBookSummary({ report }: { report: ReadingReport }) {
  // 배너 내용 좌측 치우침 정렬
  return (
    <div className="mb-3 flex shrink-0 items-center justify-center gap-4 border-y border-[#C4BFB6] bg-white py-4 pr-14 pl-5">
      <img src={report.coverUrl} alt="" className="h-21 w-15 shrink-0 rounded-sm object-cover" />

      <div className="min-w-0">
        <p className="truncate text-[20px] font-bold text-[#2C2A2B]">{report.bookTitle}</p>

        <p className="mt-1.5 truncate text-[14px] text-[#4F4D4E]">{report.reportTitle}</p>
      </div>
    </div>
  );
}

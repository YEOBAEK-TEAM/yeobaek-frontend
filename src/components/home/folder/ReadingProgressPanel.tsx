import BookCover from "@/components/common/bookCover/BookCover";
import ReadingProgressBar from "@/components/home/folder/ReadingProgressBar";
import { calculateProgress } from "@/utils/home/calculateProgress";

import type { ReadingProgress } from "@/types/home/home";

type ReadingProgressPanelProps = {
  nickname: string;
  progress: ReadingProgress;
};

export default function ReadingProgressPanel({ nickname, progress }: ReadingProgressPanelProps) {
  const { percent, remainingPages } = calculateProgress(progress.currentPage, progress.totalPages);

  return (
    <div className="flex h-full items-center gap-4 px-4 py-3">
      <BookCover src={progress.coverUrl} framed className="h-full max-h-24 w-17 shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold text-[#4F4D4E]">{nickname}님의 독서 진행률</p>

        <p className="mt-1 text-[28px] leading-none font-bold text-[#4F4D4E]">{percent}%</p>

        <p className="mt-1.5 text-[13px] text-[#54555A]">{remainingPages}페이지 남음</p>

        <div className="mt-2.5">
          <ReadingProgressBar percent={percent} />
        </div>
      </div>
    </div>
  );
}

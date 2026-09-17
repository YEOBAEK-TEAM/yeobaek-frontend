import BottomSheet from "@/components/common/bottomSheet/BottomSheet";
import { useBottomSheetClose } from "@/components/common/bottomSheet/bottomSheetContext";
import SectionState from "@/components/common/section/SectionState";
import { REPORT_BOOK_SHEET } from "@/constants/library/report";
import { useUnlockedBooks } from "@/hooks/library/report/useReportQueries";

import type { UnlockedBookView } from "@/types/library/report";

type UnlockedBookSheetProps = {
  onSelect: (book: UnlockedBookView) => void;
  onClose: () => void;
};

const TITLE_ID = "report-book-sheet-title";

function UnlockedBookList({ onSelect }: Pick<UnlockedBookSheetProps, "onSelect">) {
  const requestClose = useBottomSheetClose();

  const { data: books = [], isPending, isError, refetch } = useUnlockedBooks(true);

  if (isError) {
    return <SectionState isError onRetry={() => void refetch()} className="h-40" />;
  }

  if (isPending) {
    return [0, 1, 2].map((item) => (
      <div key={item} className="mb-3 h-20 animate-pulse rounded-2xl bg-[#EFEDE7]" />
    ));
  }

  if (books.length === 0) {
    return (
      <p className="py-12 text-center text-[15px] leading-6 whitespace-pre-line text-[#8F8B85]">
        {REPORT_BOOK_SHEET.emptyText}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {books.map((book) => (
        <li key={book.bookId}>
          {/* 시트가 내려간 뒤 선택 동작 실행 */}
          <button
            type="button"
            onClick={() => requestClose(() => onSelect(book))}
            className="flex w-full flex-col rounded-2xl border border-[#C4BFB6] bg-[#FBFBFB] px-4 py-3.5 text-left active:border-[#BCB7AD] active:bg-[#E7E2DC]"
          >
            <span className="block truncate text-[17px] font-bold text-[#4F4D4E]">
              {book.title}
            </span>
            <span className="mt-1 block text-[15px] text-[#A89F94] tabular-nums">
              {book.unlockedLabel}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

// 퀴즈를 통과해 독후감을 쓸 수 있는 책 목록
export default function UnlockedBookSheet({ onSelect, onClose }: UnlockedBookSheetProps) {
  return (
    <BottomSheet labelledBy={TITLE_ID} onClose={onClose} panelClassName="bg-white">
      <div className="px-5 pt-1 pb-4">
        <h2 id={TITLE_ID} className="flex h-10 items-center text-[17px] font-bold text-[#4F4D4E]">
          {REPORT_BOOK_SHEET.title}
        </h2>
      </div>

      <div className="px-5 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
        <UnlockedBookList onSelect={onSelect} />
      </div>
    </BottomSheet>
  );
}

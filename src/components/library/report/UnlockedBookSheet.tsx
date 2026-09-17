import { AlignJustify } from "lucide-react";
import { useMemo, useState } from "react";

import BookCover from "@/components/common/bookCover/BookCover";
import BottomSheet from "@/components/common/bottomSheet/BottomSheet";
import { useBottomSheetClose } from "@/components/common/bottomSheet/bottomSheetContext";
import SectionState from "@/components/common/section/SectionState";
import { UNLOCKED_BOOK_SHEET, UNLOCKED_SORT_LABEL } from "@/constants/library/report";
import { useUnlockedBooks } from "@/hooks/library/report/useReportQueries";
import { sortUnlockedBooks } from "@/utils/library/report/toReportView";

import type { UnlockedBookSortOrder, UnlockedBookView } from "@/types/library/report";

type UnlockedBookSheetProps = {
  onSelect: (book: UnlockedBookView) => void;
  onClose: () => void;
};

const TITLE_ID = "unlocked-book-sheet-title";

function UnlockedBookList({ onSelect }: Pick<UnlockedBookSheetProps, "onSelect">) {
  const requestClose = useBottomSheetClose();

  const { data = [], isPending, isError, refetch } = useUnlockedBooks(true);

  const [order, setOrder] = useState<UnlockedBookSortOrder>("latest");

  const books = useMemo(() => sortUnlockedBooks(data, order), [data, order]);

  const renderBooks = () => {
    if (isError) return <SectionState isError onRetry={() => void refetch()} className="h-40" />;

    if (isPending) {
      return [0, 1, 2].map((item) => (
        <div key={item} className="mb-3 h-24 animate-pulse rounded-2xl bg-[#EFEDE7]" />
      ));
    }

    if (books.length === 0) {
      return (
        <p className="py-12 text-center text-[15px] leading-6 whitespace-pre-line text-[#8F8B85]">
          {UNLOCKED_BOOK_SHEET.emptyText}
        </p>
      );
    }

    return (
      <ul className="flex flex-col gap-3">
        {books.map((book) => (
          <li key={book.bookId}>
            <button
              type="button"
              // 시트가 내려간 뒤 작성 확인
              onClick={() => requestClose(() => onSelect(book))}
              className="flex w-full items-center gap-3.5 rounded-2xl border border-[#C4BFB6] bg-[#FBFBFB] p-3 text-left active:border-[#BCB7AD] active:bg-[#E7E2DC]"
            >
              <BookCover src={book.coverUrl} className="h-19 w-13 shrink-0 rounded-sm" />

              <span className="min-w-0 flex-1">
                <span className="block truncate text-[17px] font-bold text-[#4F4D4E]">
                  {book.title}
                </span>
                <span className="mt-0.5 block truncate text-[15px] text-[#4F4D4E]">
                  {book.author}
                </span>
                <span className="mt-1 block text-[15px] text-[#A89F94] tabular-nums">
                  {book.completedLabel}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-1 pb-5">
        <h2 id={TITLE_ID} className="text-[17px] font-bold text-[#4F4D4E]">
          {UNLOCKED_BOOK_SHEET.title}
        </h2>

        <button
          type="button"
          onClick={() => setOrder((current) => (current === "latest" ? "oldest" : "latest"))}
          aria-label={`정렬 기준 ${UNLOCKED_SORT_LABEL[order]}, 눌러서 변경`}
          className="flex items-center gap-2 text-[15px] text-[#54555A]"
        >
          {UNLOCKED_SORT_LABEL[order]}
          <AlignJustify aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div className="px-5 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">{renderBooks()}</div>
    </>
  );
}

export default function UnlockedBookSheet({ onSelect, onClose }: UnlockedBookSheetProps) {
  return (
    <BottomSheet labelledBy={TITLE_ID} onClose={onClose} panelClassName="bg-white">
      <UnlockedBookList onSelect={onSelect} />
    </BottomSheet>
  );
}

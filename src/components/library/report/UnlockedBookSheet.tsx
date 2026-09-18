import { AlignJustify, Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import BookCover from "@/components/common/bookCover/BookCover";
import BottomSheet from "@/components/common/bottomSheet/BottomSheet";
import { useBottomSheetClose } from "@/components/common/bottomSheet/bottomSheetContext";
import SectionState from "@/components/common/section/SectionState";
import { REPORT_BOOK_LIST_MODES, REPORT_BOOK_SHEET } from "@/constants/library/report";
import { useUnlockedBooks } from "@/hooks/library/report/useReportQueries";
import { usePendingUnlockBooks } from "@/hooks/library/unlock-quiz/useUnlockQuizQueries";

import type { ReportBookListMode } from "@/constants/library/report";
import type { UnlockedBookView } from "@/types/library/report";
import type { PendingUnlockBookView } from "@/types/library/unlockQuiz";

type UnlockedBookSheetProps = {
  onSelectUnlocked: (book: UnlockedBookView) => void;
  onSelectPending: (book: PendingUnlockBookView) => void;
  onClose: () => void;
};

type BookRow = {
  bookId: number;
  title: string;
  author: string;
  coverUrl: string;
  dateLabel: string;
  select: () => void;
};

const TITLE_ID = "report-book-sheet-title";

function ModeMenu({
  mode,
  onChange,
}: {
  mode: ReportBookListMode;
  onChange: (mode: ReportBookListMode) => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // 메뉴 밖을 누르면 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const current = REPORT_BOOK_LIST_MODES.find((item) => item.id === mode);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`${REPORT_BOOK_SHEET.modeMenuLabel}, 현재 ${current?.label}`}
        className="flex h-10 items-center gap-2 text-[15px] text-[#54555A]"
      >
        {current?.label}
        <AlignJustify aria-hidden="true" className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-full right-0 z-10 mt-1 w-32 overflow-hidden rounded-xl bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.14)]"
        >
          {REPORT_BOOK_LIST_MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitemradio"
              aria-checked={item.id === mode}
              onClick={() => {
                onChange(item.id);
                setIsOpen(false);
              }}
              className="flex h-11 w-full items-center justify-between px-4 text-[15px] text-[#2C2A2B] active:bg-[#F2F0EA]"
            >
              {item.label}
              {item.id === mode && (
                <Check aria-hidden="true" strokeWidth={2.5} className="h-4 w-4 text-[#B8BC9F]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ReportBookList({
  onSelectUnlocked,
  onSelectPending,
}: Omit<UnlockedBookSheetProps, "onClose">) {
  const requestClose = useBottomSheetClose();

  const [mode, setMode] = useState<ReportBookListMode>("unlocked");

  const unlockedQuery = useUnlockedBooks(mode === "unlocked");
  const pendingQuery = usePendingUnlockBooks(mode === "pending");
  const activeQuery = mode === "unlocked" ? unlockedQuery : pendingQuery;

  // 시트가 내려간 뒤 선택 동작 실행
  const rows = useMemo<BookRow[]>(
    () =>
      mode === "unlocked"
        ? (unlockedQuery.data ?? []).map((book) => ({
            ...book,
            dateLabel: book.unlockedLabel,
            select: () => requestClose(() => onSelectUnlocked(book)),
          }))
        : (pendingQuery.data ?? []).map((book) => ({
            ...book,
            dateLabel: book.completedLabel,
            select: () => requestClose(() => onSelectPending(book)),
          })),
    [mode, unlockedQuery.data, pendingQuery.data, requestClose, onSelectUnlocked, onSelectPending],
  );

  const emptyText = REPORT_BOOK_LIST_MODES.find((item) => item.id === mode)?.emptyText;

  const renderBooks = () => {
    if (activeQuery.isError) {
      return <SectionState isError onRetry={() => void activeQuery.refetch()} className="h-40" />;
    }

    if (activeQuery.isPending) {
      return [0, 1, 2].map((item) => (
        <div key={item} className="mb-3 h-24 animate-pulse rounded-2xl bg-[#EFEDE7]" />
      ));
    }

    if (rows.length === 0) {
      return (
        <p className="py-12 text-center text-[15px] leading-6 whitespace-pre-line text-[#8F8B85]">
          {emptyText}
        </p>
      );
    }

    return (
      <ul className="flex flex-col gap-3">
        {rows.map((book) => (
          <li key={book.bookId}>
            <button
              type="button"
              onClick={book.select}
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
                  {book.dateLabel}
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
      <div className="flex items-center justify-between px-5 pt-1 pb-4">
        <h2 id={TITLE_ID} className="text-[17px] font-bold text-[#4F4D4E]">
          {REPORT_BOOK_SHEET.title}
        </h2>

        <ModeMenu mode={mode} onChange={setMode} />
      </div>

      <div className="px-5 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">{renderBooks()}</div>
    </>
  );
}

// 해금완료 책은 독후감 작성, 해금예정 책은 해금 퀴즈로 연결
export default function UnlockedBookSheet({
  onSelectUnlocked,
  onSelectPending,
  onClose,
}: UnlockedBookSheetProps) {
  return (
    <BottomSheet labelledBy={TITLE_ID} onClose={onClose} panelClassName="bg-white">
      <ReportBookList onSelectUnlocked={onSelectUnlocked} onSelectPending={onSelectPending} />
    </BottomSheet>
  );
}

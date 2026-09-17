import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "@/components/common/header/Header";
import { useReadingRecords } from "@/hooks/useReadingRecords";

const tabs = ["전체", "완독", "독후감"] as const;

export default function LibraryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAddedNotice, setShowAddedNotice] = useState(location.state?.bookAdded === true);

  useEffect(() => {
    if (!showAddedNotice) return;
    // Consume the navigation notice so refresh/back does not show it again.
    navigate("/library", { replace: true, state: null });
    const timeout = window.setTimeout(() => setShowAddedNotice(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [navigate, showAddedNotice]);

  const [tab, setTab] = useState<(typeof tabs)[number]>("전체");
  const { data, isPending, isError } = useReadingRecords(
    tab === "완독" ? "COMPLETED" : "ALL",
    tab !== "독후감",
  );
  const libraryBooks = tab === "독후감" || isError ? [] : (data?.items ?? []);

  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef<{ pointerId: number; startX: number; scrollLeft: number } | null>(null);
  const moved = useRef(false);
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const selectedBook =
    libraryBooks.find((book) => book.recordId === selectedRecordId) ?? libraryBooks[0];

  const handleReadBook = () => {
    navigate("/library/read");
  };

  return (
    <main
      className="flex-1 pb-2 text-[#4F4D4E]"
      style={{ fontFamily: "Arial, 'Malgun Gothic', sans-serif" }}
    >
      {showAddedNotice && (
        <div
          role="status"
          className="pointer-events-none fixed top-28 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[#5F5D5E] px-4 py-3 text-sm whitespace-nowrap text-white shadow-sm"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5 shrink-0"
          >
            <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          서재에 추가되었습니다
        </div>
      )}
      <Header title="서재" action="search" onActionClick={() => navigate("/library/search")} />
      <div role="tablist" aria-label="서재 도서 분류" className="mx-5 mt-4 flex">
        {tabs.map((item) => (
          <button
            key={item}
            id={`library-tab-${item}`}
            type="button"
            role="tab"
            aria-selected={tab === item}
            aria-controls="library-books"
            onClick={() => {
              setTab(item);
              setSelectedRecordId(null);
            }}
            className={`flex-1 border-b-4 py-3 text-base font-bold ${tab === item ? "border-[#4F4D4E] text-[#4F4D4E]" : "border-[#C4C4C4] text-[#C4C4C4]"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div id="library-books" role="tabpanel" aria-labelledby={`library-tab-${tab}`}>
        {/* 상단 도서 목록 */}
        <section aria-label="서재 도서 목록" className="mt-6">
          <div
            className={`flex items-end gap-3 overflow-x-auto px-5 pt-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pointer-fine:select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            onPointerDown={(event) => {
              moved.current = false;
              if (event.pointerType !== "mouse" || event.button !== 0 || !event.isPrimary) return;
              drag.current = {
                pointerId: event.pointerId,
                startX: event.clientX,
                scrollLeft: event.currentTarget.scrollLeft,
              };
              setIsDragging(true);
            }}
            onPointerMove={(event) => {
              const current = drag.current;
              if (!current || current.pointerId !== event.pointerId) return;
              const distance = event.clientX - current.startX;
              if (!moved.current && Math.abs(distance) < 5) return;
              moved.current = true;
              // Capture only a confirmed drag so a simple click still targets its book.
              if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.setPointerCapture(event.pointerId);
              }
              event.preventDefault();
              event.currentTarget.scrollLeft = current.scrollLeft - distance;
            }}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={endDrag}
            onPointerLeave={(event) => {
              if (!event.currentTarget.hasPointerCapture(event.pointerId)) endDrag(event);
            }}
            onClickCapture={(event) => {
              if (moved.current && event.detail !== 0) {
                event.preventDefault();
                event.stopPropagation();
                moved.current = false;
              }
            }}
          >
            {libraryBooks.map((book) => {
              const isSelected = book.recordId === selectedBook?.recordId;

              return (
                <button
                  key={book.recordId}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedRecordId(book.recordId)}
                  className={`${isSelected ? "w-22" : "w-18"} shrink-0 cursor-inherit`}
                >
                  {/* 책 표지 */}
                  <div
                    className={`overflow-hidden bg-white shadow-md ${
                      isSelected ? "h-32 border border-[#555555]" : "h-27 border border-transparent"
                    }`}
                  >
                    <img
                      src={book.coverImageUrl}
                      alt={`${book.bookTitle} 표지`}
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* 책 제목 */}
                  <p
                    className={`mt-2 truncate text-center text-xs leading-tight ${
                      isSelected ? "font-bold text-[#555555]" : "font-semibold text-[#8B8B8B]"
                    }`}
                  >
                    {book.bookTitle}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* 선택된 도서 */}
        {selectedBook ? (
          <section aria-label="선택한 도서" className="mt-3 flex flex-col items-center px-4">
            {/* 대표 책 영역 */}
            <div className="relative flex h-64 w-60 items-center justify-center">
              {/* 왼쪽 배경 */}
              <div className="absolute top-3 left-3 h-61 w-40 -rotate-8 bg-[#A5BBCC]" />

              {/* 오른쪽 배경 */}
              <div className="absolute top-3 right-3 h-61 w-40 rotate-3 bg-[#B8BE9F]" />

              {/* 대표 책 */}
              <img
                src={selectedBook.coverImageUrl}
                alt={`${selectedBook.bookTitle} 표지`}
                className="relative z-10 h-61 w-43 border border-[#555555] object-cover shadow-md"
              />
            </div>

            {/* 독서 진행 정보 */}
            <p className="mt-2 text-sm font-semibold text-[#555555]">
              {selectedBook.completedAt
                ? "완독"
                : selectedBook.lastPageNumber > 0
                  ? `읽는 중 · ${selectedBook.lastPageNumber}p · ${selectedBook.progressRate}%`
                  : "아직 읽기 전이에요"}
            </p>

            {/* 이어 읽기 버튼 */}
            <button
              type="button"
              onClick={handleReadBook}
              className="mt-2 flex h-14 w-full cursor-pointer items-center justify-center bg-[#4F4D4E] text-base font-bold text-white"
            >
              {selectedBook.completedAt
                ? "다시 읽기"
                : selectedBook.lastPageNumber > 0
                  ? `${selectedBook.lastPageNumber}p부터 이어 읽기`
                  : "읽기 시작하기"}
            </button>
          </section>
        ) : (
          <p
            role={tab !== "독후감" && isError ? "alert" : "status"}
            className="px-5 py-16 text-center text-sm text-[#8B8B8B]"
          >
            {tab === "독후감"
              ? "아직 독후감이 있는 도서가 없습니다."
              : isPending
                ? "서재를 불러오는 중입니다."
                : isError
                  ? "서재를 불러오지 못했습니다."
                  : tab === "완독"
                    ? "아직 완독한 도서가 없습니다."
                    : "검색에서 첫 도서를 추가해 보세요."}
          </p>
        )}
      </div>
    </main>
  );
}

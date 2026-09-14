import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/common/header/Header";
import { books } from "@/mocks/books";

export default function LibraryPage() {
  const navigate = useNavigate();

  const libraryBooks = books.filter((book) => book.isInLibrary);

  const [selectedBookId, setSelectedBookId] = useState(libraryBooks[0]?.id ?? 1);

  const selectedBook = libraryBooks.find((book) => book.id === selectedBookId) ?? libraryBooks[0];

  if (!selectedBook) return null;

  const currentPage = selectedBook.currentPage ?? 0;
  const totalPages = selectedBook.totalPages ?? 0;

  const progress = totalPages > 0 ? Math.min((currentPage / totalPages) * 100, 100) : 0;

  const handleReadBook = () => {
    navigate("/library/read");
  };

  return (
    <main className="min-h-scree">
      <Header title="내 서재" action="search" />

      {/* 상단 도서 목록 */}
      <section className="mt-6">
        <div className="flex gap-3 overflow-x-auto px-3 pb-2 [scrollbar] [&::-webkit-scrollbar]:hidden">
          {libraryBooks.map((book) => {
            const isSelected = book.id === selectedBookId;

            return (
              <button
                key={book.id}
                type="button"
                onClick={() => setSelectedBookId(book.id)}
                className="w-21.5 shrink-0 cursor-pointer"
              >
                {/* 책 표지 */}
                <div
                  className={`h-31 w-21.5 overflow-hidden bg-white ${
                    isSelected ? "border border-[#555555]" : "border border-transparent"
                  }`}
                >
                  <img
                    src={book.coverUrl}
                    alt={`${book.title} 표지`}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* 책 제목 */}
                <p
                  className={`mt-2 truncate text-center text-[13px] leading-none ${
                    isSelected ? "font-bold text-[#555555]" : "font-semibold text-[#8B8B8B]"
                  }`}
                >
                  {book.title}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 선택된 도서 */}
      <section className="mt-10 flex flex-col items-center px-5">
        {/* 대표 책 영역 */}
        <div className="relative flex h-70 w-60 items-center justify-center">
          {/* 왼쪽 배경 */}
          <div className="absolute top-5 left-6.25 h-60 w-41.25 -rotate-7 bg-[#AFC4D4]" />

          {/* 오른쪽 배경 */}
          <div className="absolute top-5 right-5 h-60 w-41.25 rotate-5 bg-[#BCC3A4]" />

          {/* 대표 책 */}
          <img
            src={selectedBook.coverUrl}
            alt={`${selectedBook.title} 표지`}
            className="relative z-10 h-61 w-42 border border-[#555555] object-cover"
          />
        </div>

        {/* 독서 진행 정보 */}
        {totalPages > 0 ? (
          <>
            <p className="mt-5 text-[14px] font-semibold text-[#555555]">
              읽는 중 · {currentPage} / {totalPages}p
            </p>

            {/* 진행바 */}
            <div className="mt-4 h-1 w-full max-w-88 bg-[#D9DDE0]">
              <div
                className="h-full bg-[#555555] transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </>
        ) : (
          <p className="mt-5 text-[14px] font-semibold text-[#555555]">아직 읽기 전이에요</p>
        )}

        {/* 이어 읽기 버튼 */}
        <button
          type="button"
          onClick={handleReadBook}
          className="mt-4 flex h-14 w-full max-w-88 cursor-pointer items-center justify-center bg-[#555555] text-[17px] font-bold text-white"
        >
          {currentPage > 0 ? `${currentPage}p부터 이어 읽기` : "읽기 시작하기"}
        </button>
      </section>
    </main>
  );
}

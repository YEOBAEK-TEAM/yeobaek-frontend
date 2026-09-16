import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useBookDetail } from "@/hooks/useBookDetail";
import BookCover from "./components/BookCover";

import { ArrowIcon } from "./components/LibraryIcons";
import { useLibrary } from "./utils/useLibrary";

export default function BookDetailPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [saveError, setSaveError] = useState(false);

  const numericBookId = bookId && /^\d+$/.test(bookId) ? Number(bookId) : NaN;
  const validBookId = Number.isSafeInteger(numericBookId) && numericBookId > 0;
  const { data: book, isPending, isError } = useBookDetail(numericBookId);

  const addBook = useLibrary((state) => state.addBook);

  if (!validBookId || isPending || isError || !book) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <div className="text-center">
          <p role={validBookId && isPending ? "status" : "alert"}>
            {!validBookId
              ? "잘못된 도서 주소입니다."
              : isPending
                ? "도서를 불러오는 중입니다."
                : "도서 정보를 불러오지 못했습니다."}
          </p>
          <Link to="/library/search" className="mt-4 block">
            도서 검색으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col bg-[#F7F6F1] px-5 pt-8 pb-8">
      {/* 헤더 */}
      <header className="relative flex h-12 items-center justify-center">
        <Link to="/library/search" className="absolute left-0" aria-label="뒤로가기">
          <ArrowIcon back />
        </Link>

        <h1 className="max-w-60 truncate text-lg font-bold">{book.title}</h1>
      </header>

      {/* 책 정보 */}
      <section className="mt-6 flex gap-5">
        <BookCover
          src={book.coverImageUrl}
          title={book.title}
          className="w-28 shrink-0 rounded-lg object-contain"
        />

        <div className="min-w-0 flex-1 pt-2">
          <h2 className="text-lg font-bold leading-snug">{book.title}</h2>

          <p className="mt-2 text-base text-[#747474]">{book.author}</p>

          <p className="mt-1 text-sm text-[#747474]">
            {book.publisher} | {book.createdAt}
          </p>

          {/* 장르 */}
          {book.genre && (
            <div className="mt-4 flex flex-wrap gap-2">
              {[book.genre].map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-[#E7E1D6] px-3 py-2 text-sm text-[#555354]"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 평점 */}
      <div className="mt-5 flex items-center gap-2 text-[#555354]">
        <span>★</span>

        <span className="font-bold">—</span>

        <span className="text-sm text-[#999999]">(미제공)</span>
      </div>

      {/* 줄거리 */}
      <section className="mt-8">
        <h2 className="text-lg font-bold">줄거리</h2>

        <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-[#666666]">
          {book.description ?? "아직 등록된 줄거리가 없습니다."}
        </p>
      </section>

      {/* 내 서재에 추가 */}
      <button
        type="button"
        onClick={() => {
          try {
            addBook(numericBookId);
            navigate("/library", { state: { bookAdded: true } });
          } catch {
            setSaveError(true);
          }
        }}
        className="mt-auto h-14 w-full rounded-lg bg-[#BEC5A5] text-base font-semibold text-[#4F4D4E]"
      >
        내 서재에 추가
      </button>
      {saveError && (
        <p role="alert" className="mt-2 text-sm text-[#4F4D4E]">
          서재에 저장하지 못했습니다. 다시 시도해주세요.
        </p>
      )}
    </main>
  );
}

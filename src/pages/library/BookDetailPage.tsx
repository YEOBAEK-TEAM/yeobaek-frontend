import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { books } from "@/mocks/books";
import { ArrowIcon } from "./components/LibraryIcons";
import { useLibrary } from "./utils/useLibrary";

export default function BookDetailPage() {
  const { bookId } = useParams();
  const location = useLocation();
  const book = books.find((entry) => entry.id === Number(bookId));
  const { addedBookIds, addBook } = useLibrary();
  const [saveError, setSaveError] = useState(false);
  const fromSearch = location.state?.fromSearch;
  const backTo =
    typeof fromSearch === "string" && fromSearch.startsWith("/library/search")
      ? fromSearch
      : "/library/search";

  if (!book)
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 font-sans">
        <h1 className="text-xl font-bold">도서를 찾을 수 없습니다.</h1>
        <Link to="/library/search" className="underline">
          도서 검색으로 돌아가기
        </Link>
      </main>
    );

  const isAdded = book.isInLibrary || addedBookIds.includes(book.id);

  return (
    <main
      className="flex min-h-dvh flex-col px-7 pt-16 pb-12 text-[#302522]"
      style={{ fontFamily: "Arial, 'Malgun Gothic', sans-serif" }}
    >
      <header className="relative flex min-h-12 items-center justify-center">
        <Link to={backTo} aria-label="도서 검색으로 돌아가기" className="absolute -left-2 p-1">
          <ArrowIcon back />
        </Link>
        <h1 className="truncate px-7 text-center text-xl font-bold">{book.title}</h1>
      </header>
      <section aria-label="도서 정보" className="mt-7">
        <div className="flex items-center gap-7">
          <img
            src={book.coverUrl}
            alt={`${book.title} 표지`}
            className="h-48 w-2/5 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl leading-tight font-bold break-keep">{book.title}</h2>
            <p className="mt-3 text-xl text-[#747474]">{book.author}</p>
            <p className="text-lg text-[#747474]">
              {book.publisher} | {book.publishedAt}
            </p>
            {book.genre && (
              <div className="mt-6 flex flex-wrap gap-1.5">
                {book.genre.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-[#E7E1D6] px-4 py-2 text-sm font-bold text-[#555354]"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="mt-5 text-base font-bold text-[#555354]">
          {book.rating !== undefined ? (
            <>
              ★ {book.rating}{" "}
              <span className="font-medium text-[#999999]">
                ({(book.reviewCount ?? 0).toLocaleString("ko-KR")})
              </span>
            </>
          ) : (
            <span className="text-sm font-normal text-[#747474]">아직 등록된 평점이 없습니다.</span>
          )}
        </p>
      </section>
      <section className="mt-9 mb-12">
        <h2 className="text-xl font-bold">줄거리</h2>
        <p className="mt-4 whitespace-pre-line text-base leading-snug font-semibold text-[#666666]">
          {book.description ?? "아직 등록된 줄거리가 없습니다."}
        </p>
      </section>
      <div className="mt-auto px-1" aria-live="polite">
        <button
          type="button"
          disabled={isAdded}
          onClick={() => {
            try {
              addBook(book.id);
            } catch {
              setSaveError(true);
            }
          }}
          className="min-h-16 w-full rounded-lg bg-[#70785B] px-4 py-4 text-base font-bold text-white disabled:cursor-default"
        >
          {isAdded ? "내 서재에 추가됨" : "내 서재에 추가"}
        </button>
        {saveError && (
          <p className="mt-2 text-sm">이 브라우저에서는 추가 상태를 저장할 수 없습니다.</p>
        )}
      </div>
    </main>
  );
}

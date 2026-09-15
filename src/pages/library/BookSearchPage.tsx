import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import searchIcon from "@/assets/icons/SearchIcon.png";
import { books } from "@/mocks/books";
import { ArrowIcon, ChevronIcon } from "./components/LibraryIcons";

export default function BookSearchPage() {
  const [params, setParams] = useSearchParams();
  const keyword = params.get("q") ?? "";
  const [input, setInput] = useState(keyword);
  const normalized = keyword.trim().toLocaleLowerCase();
  const results = books.filter((book) =>
    `${book.title} ${book.author}`.toLocaleLowerCase().includes(normalized),
  );

  return (
    <main
      className="min-h-dvh pt-16 text-[#202020]"
      style={{ fontFamily: "Arial, 'Malgun Gothic', sans-serif" }}
    >
      <section className="min-h-[calc(100dvh-4rem)] rounded-t-4xl pb-10">
        <header className="relative px-5 pt-9 pb-6">
          <Link
            to="/library"
            aria-label="서재로 돌아가기"
            className="absolute top-9 left-4 rounded p-1 text-[#99958C]"
          >
            <ArrowIcon back />
          </Link>
          <h1 className="text-center text-base font-bold">도서 검색</h1>
          <form
            className="mt-7 flex h-15 items-center gap-4 rounded-xl bg-[#F7F6F1] px-4"
            onSubmit={(event) => {
              event.preventDefault();
              setParams(input ? { q: input } : {}, { replace: true });
            }}
            role="search"
          >
            <img src={searchIcon} alt="" className="h-7 w-7" />
            <input
              aria-label="도서 제목 또는 저자 검색"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setParams(event.target.value ? { q: event.target.value } : {}, { replace: true });
              }}
              className="min-w-0 flex-1 bg-transparent text-xl outline-none"
            />
            <button
              type="submit"
              aria-label="검색"
              className={`-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${input.trim() ? "bg-[#4F4D4E]" : "bg-[#99958C]"}`}
            >
              <ArrowIcon />
            </button>
          </form>
        </header>
        <div className="space-y-5 border-t border-[#999999] px-4 pt-6">
          {results.map((book) => (
            <Link
              key={book.id}
              to={`/library/books/${book.id}`}
              state={{ fromSearch: `/library/search${params.size ? `?${params}` : ""}` }}
              className="flex min-h-29 items-center gap-4 rounded-3xl border border-[#999999] px-3 py-2.5"
            >
              <img
                src={book.coverUrl}
                alt={`${book.title} 표지`}
                className="h-23 w-16 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xl font-semibold">{book.title}</h2>
                <p className="mt-1 truncate text-base text-[#96938D]">{book.author}</p>
                <p className="text-sm text-[#96938D]">
                  {book.publisher} | {book.publishedAt}
                </p>
              </div>
              <span className="text-[#96938D]">
                <ChevronIcon />
              </span>
            </Link>
          ))}
          {results.length === 0 && (
            <p role="status" className="py-12 text-center text-[#77746D]">
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

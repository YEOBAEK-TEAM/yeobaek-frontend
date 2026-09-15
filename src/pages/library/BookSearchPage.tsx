import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { books } from "@/mocks/books";
import BookSearchInput from "./components/BookSearchInput";
import BookSearchList from "./components/BookSearchList";

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
      className="relative isolate flex min-h-dvh flex-col bg-[#BDBAB2] pt-16 text-[#202020]"
      style={{ fontFamily: "Arial, 'Malgun Gothic', sans-serif" }}
    >
      <Link
        to="/library"
        aria-label="검색 닫고 홈으로 돌아가기"
        className="absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#4F4D4E]"
      />
      <section
        className="relative flex-1 rounded-t-4xl bg-[#FAFAFA] pb-10"
        aria-labelledby="book-search-title"
      >
        <header className="px-5 pt-9 pb-6">
          <h1 id="book-search-title" className="text-center text-base font-semibold">
            도서 검색
          </h1>
          <BookSearchInput
            value={input}
            onChange={(value) => {
              setInput(value);
              setParams(value ? { q: value } : {}, { replace: true });
            }}
            onSearch={() => setParams(input ? { q: input } : {}, { replace: true })}
          />
        </header>
        <BookSearchList
          books={results}
          fromSearch={`/library/search${params.size ? `?${params}` : ""}`}
        />
      </section>
    </main>
  );
}

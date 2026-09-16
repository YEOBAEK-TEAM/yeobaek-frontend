import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useSearchBooks } from "@/hooks/useSearchBooks";

import BookSearchInput from "./components/BookSearchInput";
import BookSearchList from "./components/BookSearchList";

export default function BookSearchPage() {
  const [params, setParams] = useSearchParams();

  const keyword = params.get("q") ?? "";
  const [input, setInput] = useState(keyword);

  const { data: results = [], isPending, isError, refetch } = useSearchBooks(keyword);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const normalizedInput = input.trim();

      if (normalizedInput !== keyword) {
        setParams(normalizedInput ? { q: normalizedInput } : {}, {
          replace: true,
        });
      }
    }, 200);

    return () => window.clearTimeout(timer);
  }, [input, keyword, setParams]);

  const handleSearch = () => {
    const normalizedInput = input.trim();

    if (normalizedInput === keyword && keyword) {
      void refetch();
      return;
    }

    setParams(normalizedInput ? { q: normalizedInput } : {}, {
      replace: true,
    });
  };

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

          <BookSearchInput value={input} onChange={setInput} onSearch={handleSearch} />
        </header>

        {keyword.trim() &&
          (isPending || isError ? (
            <p
              role={isError ? "alert" : "status"}
              className="border-t border-[#999999] px-4 py-12 text-center text-[#77746D]"
            >
              {isError
                ? "도서를 불러오지 못했습니다. 다시 검색해주세요."
                : "도서를 검색하고 있습니다."}
            </p>
          ) : (
            <BookSearchList books={results} fromSearch={`/library/search?${params}`} />
          ))}
      </section>
    </main>
  );
}

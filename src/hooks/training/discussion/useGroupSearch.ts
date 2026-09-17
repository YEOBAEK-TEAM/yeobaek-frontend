import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SEARCH_DEBOUNCE_MS = 250;

// 입력값은 즉시, 검색어는 debounce 후 URL 쿼리에 반영
export const useGroupSearch = () => {
  const [params, setParams] = useSearchParams();

  const keyword = params.get("q") ?? "";

  const [input, setInput] = useState(keyword);
  const [syncedKeyword, setSyncedKeyword] = useState(keyword);

  // 뒤로가기 등 URL 변경 시 입력값 동기화
  if (keyword !== syncedKeyword) {
    setSyncedKeyword(keyword);
    if (input.trim() !== keyword) setInput(keyword);
  }

  const applyKeyword = useCallback(
    (value: string) => {
      const next = value.trim();

      setParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);

          if (next) nextParams.set("q", next);
          else nextParams.delete("q");

          return nextParams;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  useEffect(() => {
    if (input.trim() === keyword) return;

    const timer = window.setTimeout(() => applyKeyword(input), SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [input, keyword, applyKeyword]);

  return {
    input,
    setInput,
    keyword,
    submit: () => applyKeyword(input),
  };
};

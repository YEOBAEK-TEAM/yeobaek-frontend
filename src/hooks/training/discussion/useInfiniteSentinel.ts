import { useEffect, useRef } from "react";

type UseInfiniteSentinelOptions = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isError: boolean;
  fetchNextPage: () => unknown;
};

// 목록 끝 센티널이 보이면 다음 페이지 요청
export const useInfiniteSentinel = ({
  hasNextPage,
  isFetchingNextPage,
  isError,
  fetchNextPage,
}: UseInfiniteSentinelOptions) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = sentinelRef.current;

    if (!target || !hasNextPage || isFetchingNextPage || isError) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void fetchNextPage();
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isError, fetchNextPage]);

  return sentinelRef;
};

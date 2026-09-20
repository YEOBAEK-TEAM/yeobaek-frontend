import { useQuery } from "@tanstack/react-query";

import { getCurrentReading, getRecommendedBooks, getTodaySentence } from "@/api/home/home";
import { latestReportQuery } from "@/hooks/library/report/useReportQueries";
import { toReadingProgressView, toRecentReportView, toTasteBooks } from "@/utils/home/toHomeView";

// 추천은 자주 바뀌지 않아 길게 보관
const RECOMMENDATION_STALE_TIME = 30 * 60_000;

// 홈 섹션별 query key 팩토리
export const homeKeys = {
  all: ["home"] as const,
  todaySentence: () => [...homeKeys.all, "today-sentence"] as const,
  tasteBooks: () => [...homeKeys.all, "taste-books"] as const,
  // 뷰어 진행률·완독 갱신에 함께 무효화되도록 독서 기록 키 사용
  currentReading: () => ["reading-records", "current"] as const,
};

export const useReadingProgress = () =>
  useQuery({
    queryKey: homeKeys.currentReading(),
    queryFn: ({ signal }) => getCurrentReading(signal),
    select: toReadingProgressView,
  });

// 서재 독후감 배너와 같은 캐시 사용
export const useRecentReport = () =>
  useQuery({
    ...latestReportQuery,
    select: toRecentReportView,
  });

export const useTodaySentence = () =>
  useQuery({ queryKey: homeKeys.todaySentence(), queryFn: getTodaySentence });

export const useTasteBooks = () =>
  useQuery({
    queryKey: homeKeys.tasteBooks(),
    queryFn: ({ signal }) => getRecommendedBooks(signal),
    select: toTasteBooks,
    staleTime: RECOMMENDATION_STALE_TIME,
  });

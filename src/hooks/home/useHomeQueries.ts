import { useQuery } from "@tanstack/react-query";

import {
  getReadingProgress,
  getRecentReport,
  getTasteBooks,
  getTasteTopBooks,
  getTodaySentence,
} from "@/api/home/home";

// 홈 섹션별 query key 팩토리
export const homeKeys = {
  all: ["home"] as const,
  readingProgress: () => [...homeKeys.all, "reading-progress"] as const,
  recentReport: () => [...homeKeys.all, "recent-report"] as const,
  todaySentence: () => [...homeKeys.all, "today-sentence"] as const,
  tasteBooks: () => [...homeKeys.all, "taste-books"] as const,
  tasteTopBooks: () => [...homeKeys.all, "taste-top-books"] as const,
};

export const useReadingProgress = () =>
  useQuery({ queryKey: homeKeys.readingProgress(), queryFn: getReadingProgress });

export const useRecentReport = () =>
  useQuery({ queryKey: homeKeys.recentReport(), queryFn: getRecentReport });

export const useTodaySentence = () =>
  useQuery({ queryKey: homeKeys.todaySentence(), queryFn: getTodaySentence });

export const useTasteBooks = () =>
  useQuery({ queryKey: homeKeys.tasteBooks(), queryFn: getTasteBooks });

export const useTasteTopBooks = (enabled: boolean) =>
  useQuery({ queryKey: homeKeys.tasteTopBooks(), queryFn: getTasteTopBooks, enabled });

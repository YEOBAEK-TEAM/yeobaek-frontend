import { useQuery } from "@tanstack/react-query";

import {
  getBookmarks,
  getComprehensionSummary,
  getLibraryBooks,
} from "@/api/training/comprehension/library";

export const useLibraryBooks = () => {
  return useQuery({
    queryKey: ["trainings", "library-books"],
    queryFn: () => getLibraryBooks(),
    staleTime: 60_000,
  });
};

export const useBookmarks = () => {
  return useQuery({
    queryKey: ["trainings", "bookmarks"],
    queryFn: () => getBookmarks(),
    staleTime: 60_000,
  });
};

export const useComprehensionSummary = () => {
  return useQuery({
    queryKey: ["trainings", "comprehension-summary"],
    queryFn: () => getComprehensionSummary(),
    staleTime: 60_000,
  });
};

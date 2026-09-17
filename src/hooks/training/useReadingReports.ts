import { useQuery } from "@tanstack/react-query";

import { getLearningSummary, getReadingReports } from "@/api/training/readingReport";

export const useReadingReports = () => {
  return useQuery({
    queryKey: ["trainings", "reading-reports"],
    queryFn: () => getReadingReports(),
    staleTime: 60_000,
  });
};

export const useLearningSummary = () => {
  return useQuery({
    queryKey: ["trainings", "learning-summary"],
    queryFn: () => getLearningSummary(),
    staleTime: 60_000,
  });
};

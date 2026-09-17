import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getReportEditor, saveReportDraft, submitReport } from "@/api/library/report";
import { libraryReportKeys } from "@/hooks/library/report/useReportQueries";

export const useReportEditor = (reportId: number | null, bookId: number | null) =>
  useQuery({
    queryKey: [...libraryReportKeys.all, "editor", { reportId, bookId }] as const,
    queryFn: () => getReportEditor({ reportId, bookId }),
    enabled: reportId !== null || bookId !== null,
    refetchOnWindowFocus: false,
    // 첫 임시저장 후 주소가 바뀌어도 입력 화면 유지
    placeholderData: keepPreviousData,
  });

const useInvalidateReportLists = () => {
  const queryClient = useQueryClient();

  return () =>
    [libraryReportKeys.draft(), libraryReportKeys.mine()].forEach(
      (queryKey) => void queryClient.invalidateQueries({ queryKey }),
    );
};

export const useSaveReportDraft = () => {
  const invalidate = useInvalidateReportLists();

  return useMutation({ mutationFn: saveReportDraft, onSuccess: invalidate });
};

export const useSubmitReport = () => {
  const invalidate = useInvalidateReportLists();

  return useMutation({ mutationFn: submitReport, onSuccess: invalidate });
};

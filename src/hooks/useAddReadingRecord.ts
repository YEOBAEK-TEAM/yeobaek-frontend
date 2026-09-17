import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addReadingRecord } from "@/api/readingRecord";

export const useAddReadingRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addReadingRecord,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reading-records"] }),
  });
};

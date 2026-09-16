import { useQuery } from "@tanstack/react-query";

import { getSentenceList } from "@/api/sentence";

export const useSentenceList = (enabled = true) => {
  return useQuery({
    queryKey: ["highlights"],
    queryFn: () => getSentenceList(),
    enabled,
  });
};

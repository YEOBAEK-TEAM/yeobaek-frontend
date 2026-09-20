import { useQuery } from "@tanstack/react-query";

import { getReadingRecords } from "@/api/readingRecord";
import type { ReadingRecordStatus } from "@/types/readingRecord";

export const useReadingRecords = (status: ReadingRecordStatus = "ALL", enabled = true) =>
  useQuery({
    queryKey: ["reading-records", status],
    queryFn: ({ signal }) => getReadingRecords({ status }, signal),
    enabled,
  });

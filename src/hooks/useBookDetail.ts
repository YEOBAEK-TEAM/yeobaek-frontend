import { useQuery } from "@tanstack/react-query";
import { getBookDetail } from "@/api/book";
export const useBookDetail = (bookId: number) =>
  useQuery({
    queryKey: ["books", "detail", bookId],
    queryFn: ({ signal }) => getBookDetail(bookId, signal),
    enabled: Number.isSafeInteger(bookId) && bookId > 0,
  });

import { useQuery } from "@tanstack/react-query";
import { searchBooks } from "@/api/book";
export const useSearchBooks = (keyword: string) => {
  const normalized = keyword.trim();

  return useQuery({
    queryKey: ["books", "search", normalized],
    queryFn: ({ signal }) => searchBooks(normalized, signal),
  });
};

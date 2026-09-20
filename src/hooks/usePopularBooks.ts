import { useQuery } from "@tanstack/react-query";

import { getPopularBooks } from "@/api/book";

export const usePopularBooks = (page = 0, size = 20, enabled = true) =>
  useQuery({
    queryKey: ["books", "popular", page, size],
    queryFn: ({ signal }) => getPopularBooks(page, size, signal),
    enabled,
  });

const all = ["content-pages"] as const;

export const contentPageKeys = {
  all,
  detail: (pageId: number) => [...all, pageId] as const,
  chapter: (bookId: number, pageNumber: number) => [...all, "chapter", bookId, pageNumber] as const,
};

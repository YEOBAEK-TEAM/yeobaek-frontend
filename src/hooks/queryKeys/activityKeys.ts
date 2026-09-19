const all = ["activity"] as const;
const likedPages = [...all, "liked-pages"] as const;
const bookmarkedPages = [...all, "bookmarked-pages"] as const;
const likedComments = [...all, "liked-comments"] as const;

export const activityKeys = {
  all,
  likedPages: {
    all: likedPages,
    list: (bookId?: number) => [...likedPages, { bookId }] as const,
    books: [...likedPages, "books"] as const,
  },
  bookmarkedPages: {
    all: bookmarkedPages,
    list: (bookId?: number) => [...bookmarkedPages, { bookId }] as const,
    books: [...bookmarkedPages, "books"] as const,
  },
  likedComments: {
    all: likedComments,
    list: (userId: number | null) => [...likedComments, userId] as const,
  },
};

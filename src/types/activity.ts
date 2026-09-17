export type ActivityPage = {
  pageId: number;
  bookId: number;
  bookTitle: string;
  coverImageUrl: string;
  pageNumber: number;
  firstSentence: string | null;
  savedAt: string;
};

export type ActivityPageList = {
  items: ActivityPage[];
  nextCursorSavedAt: string | null;
  nextCursorId: number | null;
  hasNext: boolean;
};

export type ActivityPageParams = {
  bookId?: number;
  cursorSavedAt?: string;
  cursorId?: number;
  size?: number;
};

export type ActivityBook = Pick<ActivityPage, "bookId" | "bookTitle" | "coverImageUrl">;
export type LikedActivityBook = ActivityBook & { likeCount: number };
export type BookmarkedActivityBook = ActivityBook & { bookmarkCount: number };
export type ActivityKind = "liked-pages" | "bookmarked-pages";

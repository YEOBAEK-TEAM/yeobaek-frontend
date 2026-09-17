import type { ChatBaseMessage } from "@/types/training/chat";

export type LibraryBook = {
  bookId: number;
  title: string;
  author: string;
  coverUrl: string;
};

export type Bookmark = LibraryBook & {
  bookmarkId: string;
  startPage: number;
  endPage: number;
};

// 서재에서 고르면 bookmarkId 없이 책만 지정
export type BookSelection = {
  bookId: number;
  bookmarkId: string | null;
};

export type ComprehensionMessage = ChatBaseMessage;

export type ComprehensionPhase =
  | { type: "selecting" }
  | { type: "connecting" }
  | { type: "chatting" }
  | { type: "confirmEnd" }
  | { type: "ended" };

export type ComprehensionSummary = {
  bookTitle: string;
  pageRange: string;
  topic: string;
};

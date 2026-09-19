import type { ReaderAnchor } from "../utils/paginateReaderText";
import type { ReaderSelectionRange } from "../utils/readerSelection";

export type ReaderComment = {
  type?: "sentence" | "page" | "reply";
  parentCommentId?: string;
  user?: { id: number | string; nickname: string; profileImage?: string; isFan?: boolean };
  likes?: number;
  dislikes?: number;
  replyCount?: number;
  myVote?: "like" | "dislike";
  replyTo?: string;
  createdAt?: string;
  readerAnchor?: ReaderAnchor;
  id: string;
  page: number;
  pages?: number[];
  quote?: string;
  text: string;
  ranges?: ReaderSelectionRange[];
};

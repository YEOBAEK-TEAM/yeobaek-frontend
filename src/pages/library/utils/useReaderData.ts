import { useState } from "react";
import type { SetStateAction } from "react";
import type { ReaderSelection } from "./readerSelection";
import type { ReaderComment } from "../types/readerComment";

export type ReaderHighlight = {
  id: string;
  page: number;
  start: number;
  end: number;
  text: string;
  color: string;
};
export type ReaderWord = ReaderSelection & { id: string };
type ReaderData = {
  reportedCommentIds?: string[];
  liked: boolean;
  bookmarks: number[];
  readerBookmarks?: { pdfPage: number; start: number; imageId?: string }[];
  highlights: ReaderHighlight[];
  words: ReaderWord[];
  comments: ReaderComment[];
};
const empty: ReaderData = { liked: false, bookmarks: [], highlights: [], words: [], comments: [] };
const storageKey = "yeobaek:little-prince:reader:v1";

export function useReaderData() {
  const [data, setStoredData] = useState<ReaderData>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (
        saved &&
        typeof saved.liked === "boolean" &&
        [saved.bookmarks, saved.highlights, saved.words, saved.comments].every(Array.isArray)
      )
        return {
          ...saved,
          comments: saved.comments.map((comment: ReaderComment) => ({
            ...comment,
            ...(comment.parentCommentId || comment.replyTo
              ? { parentCommentId: comment.parentCommentId ?? comment.replyTo }
              : {}),
            type:
              comment.parentCommentId || comment.replyTo
                ? "reply"
                : (comment.type ?? (comment.ranges?.length || comment.quote ? "sentence" : "page")),
          })),
          // Legacy entries have no source location. Keep them in the collection
          // without guessing which occurrence in the book should be marked.
          words: saved.words.map((word: string | ReaderWord, index: number) =>
            typeof word === "string"
              ? { id: `legacy-word:${index}`, text: word, ranges: [] }
              : word,
          ),
          readerBookmarks: Array.isArray(saved.readerBookmarks) ? saved.readerBookmarks : undefined,
        };
    } catch {
      /* Start with an empty collection when storage is unavailable. */
    }
    return empty;
  });
  const [storageError, setStorageError] = useState(false);
  const setData = (update: SetStateAction<ReaderData>) => {
    const next = typeof update === "function" ? update(data) : update;
    setStoredData(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setStorageError(true);
    }
  };
  return { data, setData, storageError };
}

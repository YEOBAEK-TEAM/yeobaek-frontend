import { useState } from "react";
import type { SetStateAction } from "react";

export type ReaderHighlight = {
  id: string;
  page: number;
  start: number;
  end: number;
  text: string;
  color: string;
};
export type ReaderComment = { id: string; page: number; quote: string; text: string };
type ReaderData = {
  liked: boolean;
  bookmarks: number[];
  readerBookmarks?: { pdfPage: number; start: number }[];
  highlights: ReaderHighlight[];
  words: string[];
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

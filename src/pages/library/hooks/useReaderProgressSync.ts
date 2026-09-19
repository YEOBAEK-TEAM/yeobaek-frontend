import { useEffect, useRef } from "react";
import { useUpdateReadingProgress } from "@/hooks/useUpdateReadingProgress";

// The reader is keyed by bookId, so changing books resets this hook and its save history.
export function useReaderProgressSync({
  bookId,
  pageId,
  settingsOpen,
}: {
  bookId: number;
  pageId: number | undefined;
  settingsOpen: boolean;
}) {
  const { mutate: saveProgress, isError } = useUpdateReadingProgress(bookId);
  const lastSaved = useRef<{ pageId: number; at: number } | null>(null);

  useEffect(() => {
    if (!pageId || settingsOpen) return;
    let timer: number | undefined;
    const schedule = () => {
      window.clearTimeout(timer);
      if (document.visibilityState !== "visible") return;
      timer = window.setTimeout(() => {
        const previous = lastSaved.current;
        if (previous?.pageId === pageId && Date.now() - previous.at < 30_000) return;
        const attempt = { pageId: pageId, at: Date.now() };
        lastSaved.current = attempt;
        saveProgress(pageId, {
          onError: () => {
            if (lastSaved.current === attempt) lastSaved.current = null;
          },
        });
      }, 3000);
    };
    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [pageId, saveProgress, settingsOpen]);

  return { isError };
}

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { extractPdfPageContent } from "./extractPdfPageContent";
import type { ReaderBlock } from "./readerBlocks";
import { findReaderPage, paginateReaderBlocks } from "./paginateReaderText";
import type { ReaderAnchor, ReaderPage } from "./paginateReaderText";

export function useReaderPagination(
  pdf: PDFDocumentProxy | null,
  bodyRef: RefObject<HTMLDivElement | null>,
  typographyKey = "",
) {
  const scheduleRef = useRef<(() => void) | null>(null);
  const readingAnchor = useRef<ReaderAnchor | undefined>(undefined);
  const [state, setState] = useState({
    pages: [] as ReaderPage[],
    index: 0,
    loading: true,
    error: "",
    prepared: 0,
  });
  useEffect(() => {
    const body = bodyRef.current;
    if (!pdf || !body) return;
    const cache = new Map<number, Promise<ReaderBlock[]>>();
    let generation = 0;
    let disposed = false;
    let timer: number;
    let lastSize = "";
    const build = async () => {
      const run = ++generation;
      const width = body.clientWidth;
      const height = body.clientHeight - 4; // reserve ink space for highlight marks
      if (width <= 0 || height <= 0) return;
      setState((current) => ({ ...current, loading: true, error: "", prepared: 0 }));
      const measure = document.createElement("article");
      measure.className = "book-reader__text book-reader__measure";
      measure.style.width = `${width}px`;
      measure.setAttribute("aria-hidden", "true");
      body.append(measure);
      try {
        await document.fonts.ready;
        const stream: ReaderBlock[] = [];
        for (let pdfPage = 1; pdfPage <= pdf.numPages; pdfPage++) {
          if (disposed || run !== generation) return;
          let text = cache.get(pdfPage);
          if (!text) {
            text = extractPdfPageContent(pdf, pdfPage);
            cache.set(pdfPage, text);
            void text.catch(() => cache.delete(pdfPage));
          }
          const blocks = await text;
          if (disposed || run !== generation) return;
          stream.push(...blocks);
          setState((current) => ({ ...current, prepared: pdfPage }));
          // Give input, resize and paint a turn during initial book preparation.
          await new Promise((resolve) => window.setTimeout(resolve, 0));
        }
        if (!disposed && run === generation) {
          // Only the viewport height ends a reader page, never a source PDF boundary.
          const pages = paginateReaderBlocks(stream, 1, measure, height);
          setState((current) => ({
            pages,
            index: findReaderPage(pages, readingAnchor.current ?? current.pages[current.index]),
            loading: false,
            error: "",
            prepared: pdf.numPages,
          }));
        }
      } catch (error) {
        if (!disposed && run === generation)
          setState((current) => ({
            ...current,
            loading: false,
            error: error instanceof Error ? error.message : "본문을 준비하지 못했습니다.",
          }));
      } finally {
        measure.remove();
      }
    };
    const schedule = () => {
      generation++;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => void build(), 120);
    };
    scheduleRef.current = schedule;
    const observer = new ResizeObserver(() => {
      const size = `${body.clientWidth}:${body.clientHeight}`;
      if (size === lastSize) return;
      lastSize = size;
      schedule();
    });
    observer.observe(body);
    document.fonts.addEventListener("loadingdone", schedule);
    return () => {
      scheduleRef.current = null;
      disposed = true;
      generation++;
      window.clearTimeout(timer);
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", schedule);
    };
  }, [pdf, bodyRef]);
  // Re-measure with the inherited reader typography without re-extracting PDF
  // content. build restores the current anchor.
  useEffect(() => {
    scheduleRef.current?.();
  }, [typographyKey]);
  const goToPage = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, state.pages.length - 1));
    const page = state.pages[nextIndex];
    if (page) readingAnchor.current = { pdfPage: page.pdfPage, start: page.start };
    setState((current) => ({ ...current, index: nextIndex }));
  };
  return {
    readerPages: state.pages,
    pageIndex: state.index,
    loading: state.loading,
    error: state.error,
    prepared: state.prepared,
    goToPage,
  };
}

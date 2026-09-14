import { useCallback, useEffect, useRef, useState } from "react";
import type { ReaderPage } from "../utils/paginateReaderText";
import type { ReaderHighlight } from "../utils/useReaderData";
import { getReaderSelection } from "../utils/readerSelection";
import type { ReaderSelection } from "../utils/readerSelection";

type Props = {
  page: ReaderPage;
  active: boolean;
  highlights: ReaderHighlight[];
  onHighlight: (selection: ReaderSelection, color: string) => void;
  onWord: (text: string) => void;
  onComment: (text: string, pdfPages: number[]) => void;
};
const colors = ["#c6d8d4", "#c7cfe7", "#d6cadb", "#e9e59c", "#d1d1d1"];
const colorNames = ["민트", "파랑", "보라", "노랑", "회색"];

export default function BookTextReader({
  page,
  active,
  highlights,
  onHighlight,
  onWord,
  onComment,
}: Props) {
  const pageNumber = page.pdfPage;

  const [selection, setSelection] = useState<ReaderSelection | null>(null);
  const [menuTop, setMenuTop] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setSelection(null);
        setPaletteOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const captureSelection = useCallback(() => {
    const selected = window.getSelection();
    const article = articleRef.current;
    if (!active || !article || !selected || selected.isCollapsed || !selected.rangeCount) return;
    const range = selected.getRangeAt(0);
    if (!article.contains(range.startContainer) || !article.contains(range.endContainer)) return;
    const result = getReaderSelection(article, range, page.fragments);
    if (!result.text.trim() || !result.ranges.length) return;
    setSelection(result);
    const rect = range.getBoundingClientRect();
    setMenuTop(
      Math.max(
        8,
        Math.min(
          rect.bottom - article.getBoundingClientRect().top + 6,
          (article.parentElement?.clientHeight ?? 225) - 120,
        ),
      ),
    );
    setPaletteOpen(false);
  }, [active, page.fragments]);
  useEffect(() => {
    if (!active) return;
    // Mobile selection handles can change the range after pointerup/touchend.
    document.addEventListener("selectionchange", captureSelection);
    return () => document.removeEventListener("selectionchange", captureSelection);
  }, [active, captureSelection]);
  const finish = () => {
    setSelection(null);
    setPaletteOpen(false);
    window.getSelection()?.removeAllRanges();
  };
  if (!page.fragments.length)
    return (
      <p role="status" className="book-reader__message">
        이 페이지에는 표시할 수 있는 텍스트나 이미지가 없습니다.
      </p>
    );

  return (
    <div className="book-reader__text-container">
      <article
        ref={articleRef}
        aria-label={`PDF ${page.pdfPages.join(", ")}페이지 본문`}
        data-page-number={pageNumber}
        className="book-reader__text"
        onPointerUp={active ? captureSelection : undefined}
        onKeyUp={active ? captureSelection : undefined}
        onTouchEnd={active ? captureSelection : undefined}
      >
        {page.fragments.map((fragment) => {
          if (fragment.type === "image")
            return (
              <img
                key={fragment.id}
                src={fragment.src}
                alt={`PDF ${fragment.pdfPage}페이지 삽화`}
                data-pdf-page={fragment.pdfPage}
                className="book-reader__image"
                data-image-id={fragment.id}
                width={fragment.width}
                height={fragment.height}
                style={{ width: fragment.displayWidth, height: fragment.displayHeight }}
                draggable={false}
              />
            );
          const { text: paragraph, start, end, paragraph: index } = fragment;

          const relevant = highlights.filter(
            (highlight) =>
              highlight.page === fragment.pdfPage && highlight.start < end && highlight.end > start,
          );
          const sourceAt = (offset: number) => fragment.sourceOffsets?.[offset] ?? start + offset;
          const displayRange = (highlight: ReaderHighlight) => {
            let from = 0;
            while (from < paragraph.length && sourceAt(from + 1) <= highlight.start) from++;
            let to = from;
            while (to < paragraph.length && sourceAt(to) < highlight.end) to++;
            return [from, to];
          };
          const boundaries = [
            ...new Set([0, paragraph.length, ...relevant.flatMap(displayRange)]),
          ].sort((a, b) => a - b);
          return (
            <p
              key={fragment.id}
              dir="auto"
              data-paragraph-id={`${fragment.pdfPage}-${index}`}
              data-fragment-id={fragment.id}
              data-pdf-page={fragment.pdfPage}
              data-source-start={start}
              data-source-end={end}
            >
              {boundaries.slice(0, -1).map((position, part) => {
                const next = boundaries[part + 1];
                const highlight = relevant.findLast(
                  (entry) => entry.start < sourceAt(next) && entry.end > sourceAt(position),
                );
                const text = paragraph.slice(position, next);
                return highlight ? (
                  <mark
                    key={position}
                    style={{ backgroundColor: highlight.color }}
                    data-highlight-id={highlight.id}
                  >
                    {text}
                  </mark>
                ) : (
                  <span key={position}>{text}</span>
                );
              })}
            </p>
          );
        })}
      </article>
      {active && selection && (
        <div
          ref={menuRef}
          className="book-reader__selection"
          style={{ top: menuTop }}
          onPointerDown={(event) => event.preventDefault()}
          onKeyDown={(event) => {
            if (event.key === "Escape") finish();
          }}
        >
          <div
            className="book-reader__selection-actions"
            role="group"
            aria-label="선택한 텍스트 작업"
          >
            <button
              type="button"
              className={paletteOpen ? "is-active" : ""}
              aria-expanded={paletteOpen}
              onClick={() => setPaletteOpen(!paletteOpen)}
            >
              문장 수집
            </button>
            <button
              type="button"
              onClick={() => {
                onWord(selection.text);
                finish();
              }}
            >
              단어장
            </button>
            <button
              type="button"
              onClick={() => {
                onComment(selection.text, [
                  ...new Set(selection.ranges.map((range) => range.pdfPage)),
                ]);
                finish();
              }}
            >
              댓글쓰기
            </button>
          </div>
          {paletteOpen && (
            <div className="book-reader__palette" role="group" aria-label="형광펜 색상">
              {colors.map((color, index) => (
                <button
                  type="button"
                  key={color}
                  style={{ backgroundColor: color }}
                  aria-label={`${colorNames[index]} 형광펜으로 문장 수집`}
                  onClick={() => {
                    onHighlight(selection, color);
                    finish();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

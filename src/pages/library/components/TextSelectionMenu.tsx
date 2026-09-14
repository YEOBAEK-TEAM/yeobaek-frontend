import { useLayoutEffect } from "react";
import type { RefObject } from "react";
import type { SelectionMode } from "../utils/useTextSelection";
import HighlightColorPicker from "./HighlightColorPicker";
import CommentInput from "./CommentInput";

type Props = {
  menuRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  anchor: { top: number; bottom: number };
  mode: SelectionMode;
  selectedColor: string;
  onHighlight: () => void;
  onWord: () => void;
  onComment: () => void;
  onColor: (color: string) => void;
  onSubmitComment: (text: string) => void;
};

export default function TextSelectionMenu({
  menuRef,
  containerRef,
  anchor,
  mode,
  selectedColor,
  onHighlight,
  onWord,
  onComment,
  onColor,
  onSubmitComment,
}: Props) {
  useLayoutEffect(() => {
    const menu = menuRef.current;
    const container = containerRef.current;
    if (!menu || !container) return;
    const position = () => {
      const rect = container.getBoundingClientRect();
      const viewport = window.visualViewport;
      const top = Math.max(0, (viewport?.offsetTop ?? 0) - rect.top) + 4;
      const bottom =
        Math.min(
          rect.bottom,
          (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight),
        ) -
        rect.top -
        4;
      menu.style.maxHeight = `${Math.max(0, bottom - top)}px`;
      const height = menu.offsetHeight;
      const below = anchor.bottom + 8;
      const above = anchor.top - height - 8;
      const preferred = below + height <= bottom ? below : above >= top ? above : below;
      menu.style.top = `${Math.max(top, Math.min(preferred, bottom - height))}px`;
    };
    const observer = new ResizeObserver(position);
    observer.observe(menu);
    position();
    window.visualViewport?.addEventListener("resize", position);
    window.visualViewport?.addEventListener("scroll", position);
    return () => {
      observer.disconnect();
      window.visualViewport?.removeEventListener("resize", position);
      window.visualViewport?.removeEventListener("scroll", position);
    };
  }, [menuRef, containerRef, anchor, mode]);
  return (
    <div
      ref={menuRef}
      className="book-reader__selection"
      data-mode={mode}
      onPointerDown={(event) => {
        // Preserve the source range on buttons; allow normal input focus/caret use.
        if (!(event.target instanceof HTMLInputElement)) event.preventDefault();
      }}
    >
      {mode === "comment" ? (
        <CommentInput onSubmit={onSubmitComment} />
      ) : (
        <>
          <div
            className="book-reader__selection-actions"
            role="group"
            aria-label="선택한 텍스트 작업"
          >
            <button
              type="button"
              className={mode === "highlight" ? "is-active" : ""}
              aria-expanded={mode === "highlight"}
              onClick={onHighlight}
            >
              문장 수집
            </button>
            <button
              type="button"
              className={mode === "word" ? "is-active" : ""}
              aria-pressed={mode === "word"}
              onClick={onWord}
            >
              단어장
            </button>
            <button type="button" onClick={onComment}>
              댓글쓰기
            </button>
          </div>
          {mode === "highlight" && (
            <HighlightColorPicker selectedColor={selectedColor} onSelect={onColor} />
          )}
        </>
      )}
    </div>
  );
}

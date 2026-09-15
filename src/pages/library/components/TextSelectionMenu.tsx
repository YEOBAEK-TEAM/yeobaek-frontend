import type { RefObject } from "react";
import type { SelectionMode } from "../utils/useTextSelection";
import HighlightColorPicker from "./HighlightColorPicker";
import CommentInput from "./CommentInput";

type Props = {
  menuRef: RefObject<HTMLDivElement | null>;
  mode: SelectionMode;
  selectedColor: string;
  onHighlight: () => void;
  onWord: () => void;
  onComment: () => void;
  onColor: (color: string) => void;
  onSubmitComment: (text: string) => void;
  onClose: () => void;
};

export default function TextSelectionMenu({
  menuRef,
  mode,
  selectedColor,
  onHighlight,
  onWord,
  onComment,
  onColor,
  onSubmitComment,
  onClose,
}: Props) {
  return (
    <div
      ref={menuRef}
      className="book-reader__selection book-reader__selection--inline"
      data-mode={mode}
      onPointerDown={(event) => {
        // Preserve the source range on buttons; allow normal input focus/caret use.
        if (!(event.target instanceof HTMLInputElement)) event.preventDefault();
      }}
    >
      <button type="button" aria-label="선택 메뉴 닫기" onClick={onClose}>
        ×
      </button>
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

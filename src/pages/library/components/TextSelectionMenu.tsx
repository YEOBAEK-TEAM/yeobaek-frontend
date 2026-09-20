import type { ReactNode, RefObject } from "react";
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
  onSubmitComment: (text: string) => void | boolean | Promise<boolean>;
  commentPending?: boolean;
  commentError?: boolean;
  onClose: () => void;
  wordCard?: ReactNode;
  wordSaved?: boolean;
  collectionDisabled?: boolean;
  commentDisabled?: boolean;
  showCloseButton?: boolean;
  colorDisabled?: boolean;
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
  wordCard,
  wordSaved = false,
  collectionDisabled = false,
  commentDisabled = false,
  commentPending = false,
  commentError = false,
  showCloseButton = true,
  colorDisabled = false,
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
      {showCloseButton && mode !== "comment" && (
        <button
          className="book-reader__selection-close"
          type="button"
          aria-label="선택 메뉴 닫기"
          onClick={onClose}
        >
          ×
        </button>
      )}
      {mode === "comment" ? (
        <CommentInput onSubmit={onSubmitComment} pending={commentPending} error={commentError} />
      ) : (
        <>
          {!(mode === "word" && wordSaved) && (
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
                disabled={collectionDisabled}
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
              <button type="button" onClick={onComment} disabled={commentDisabled}>
                댓글쓰기
              </button>
            </div>
          )}
          {mode === "word" && wordCard}
          {mode === "highlight" && (
            <HighlightColorPicker
              selectedColor={selectedColor}
              onSelect={onColor}
              disabled={colorDisabled}
            />
          )}
        </>
      )}
    </div>
  );
}

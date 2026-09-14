import { useRef } from "react";
import type { ReaderPage } from "../utils/paginateReaderText";
import type { ReaderComment, ReaderHighlight, ReaderWord } from "../utils/useReaderData";
import type { ReaderSelection } from "../utils/readerSelection";
import { getAnnotatedTextParts } from "../utils/readerAnnotations";
import { useTextSelection } from "../utils/useTextSelection";
import TextSelectionMenu from "./TextSelectionMenu";

type Props = {
  page: ReaderPage;
  active: boolean;
  highlights: ReaderHighlight[];
  words: ReaderWord[];
  comments: ReaderComment[];
  onHighlight: (selection: ReaderSelection, color: string) => void;
  onWord: (selection: ReaderSelection) => void;
  onComment: (selection: ReaderSelection, text: string) => void;
};

export default function BookTextReader({
  page,
  active,
  highlights,
  words,
  comments,
  onHighlight,
  onWord,
  onComment,
}: Props) {
  const articleRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { selection, mode, anchor, capture, activate, finish } = useTextSelection(
    page,
    active,
    articleRef,
    menuRef,
  );
  const selectedColor = highlights.at(-1)?.color ?? "#c6d8d4";
  const preview =
    selection && (mode === "highlight" || mode === "comment")
      ? { selection, color: mode === "comment" ? "#c6d8d4" : selectedColor }
      : undefined;

  return (
    <div ref={containerRef} className="book-reader__text-container">
      <article
        ref={articleRef}
        aria-label={`PDF ${page.pdfPages.join(", ")}페이지 본문`}
        data-page-number={page.pdfPage}
        className="book-reader__text"
        onPointerUp={active ? capture : undefined}
        onKeyUp={active ? capture : undefined}
        onTouchEnd={active ? capture : undefined}
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
          return (
            <p
              key={fragment.id}
              dir="auto"
              data-paragraph-id={`${fragment.pdfPage}-${fragment.paragraph}`}
              data-fragment-id={fragment.id}
              data-pdf-page={fragment.pdfPage}
              data-source-start={fragment.start}
              data-source-end={fragment.end}
            >
              {getAnnotatedTextParts(fragment, highlights, words, comments, preview).map((part) => {
                const Tag = part.background ? "mark" : "span";
                return (
                  <Tag
                    key={part.position}
                    style={{ backgroundColor: part.background }}
                    className={part.wordId ? "book-reader__word" : undefined}
                    data-highlight-id={part.highlightId}
                    data-word-id={part.wordId}
                    data-comment-id={part.commentId}
                    data-selection-preview={part.preview || undefined}
                  >
                    {part.text}
                  </Tag>
                );
              })}
            </p>
          );
        })}
      </article>
      {active && selection && (
        <TextSelectionMenu
          menuRef={menuRef}
          containerRef={containerRef}
          anchor={anchor}
          mode={mode}
          selectedColor={selectedColor}
          onHighlight={() => activate("highlight")}
          onWord={() => {
            if (mode !== "word") {
              activate("word");
              onWord(selection);
            }
          }}
          onComment={() => activate("comment")}
          onColor={(color) => {
            onHighlight(selection, color);
            finish();
          }}
          onSubmitComment={(text) => {
            onComment(selection, text);
            finish();
          }}
        />
      )}
    </div>
  );
}

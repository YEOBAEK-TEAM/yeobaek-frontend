import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SyntheticEvent, PointerEvent as ReactPointerEvent } from "react";
import type { ReaderPage } from "../utils/paginateReaderText";
import type { ReaderComment, ReaderHighlight, ReaderWord } from "../utils/useReaderData";
import type { ReaderSelection } from "../utils/readerSelection";
import { getAnnotatedTextParts } from "../utils/readerAnnotations";
import { getReaderSelection } from "../utils/readerSelection";
import { useTextSelection } from "../utils/useTextSelection";
import TextSelectionMenu from "./TextSelectionMenu";
import CollectedSentenceMenu from "./CollectedSentenceMenu";
import WordMeaningCard from "./WordMeaningCard";
import { isDictionaryWord } from "../../../mocks/dictionary";

type Props = {
  page: ReaderPage;
  active: boolean;
  onSwipeDisabledChange: (disabled: boolean) => void;
  highlights: ReaderHighlight[];
  words: ReaderWord[];
  comments: ReaderComment[];
  onHighlight: (selection: ReaderSelection, color: string) => void;
  onUpdateHighlight: (id: string, color?: string) => void;
  onWord: (selection: ReaderSelection) => void;
  onComment: (selection: ReaderSelection, text: string) => void;
};

export default function BookTextReader({
  page,
  active,
  onSwipeDisabledChange,
  highlights,
  words,
  comments,
  onHighlight,
  onUpdateHighlight,
  onWord,
  onComment,
}: Props) {
  const articleRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    selection,
    mode,
    activate,
    openSelection,
    finish,
    isSelecting,
    selectionMenuOpen,
    pointerDown,
    pointerMove,
    pointerUp,
    doubleClick,
    pointerCancel,
    isMousePointer,
  } = useTextSelection(page, active, articleRef, menuRef);
  const [collected, setCollected] = useState<{ id: string; left: number; top: number } | null>(
    null,
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const collectedRef = useRef<HTMLDivElement>(null);
  const savedHighlight = highlights.find((entry) => entry.id === collected?.id);
  useEffect(() => {
    if (!collected) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== "Escape") return;
      if (event instanceof PointerEvent && collectedRef.current?.contains(event.target as Node))
        return;
      setCollected(null);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [collected]);
  useEffect(() => {
    if (active) onSwipeDisabledChange(isSelecting || selectionMenuOpen || !!collected);
  }, [active, isSelecting, selectionMenuOpen, collected, onSwipeDisabledChange]);
  const editingHighlight = highlights.find(
    (entry) =>
      entry.id === editingId &&
      selection?.ranges.length === 1 &&
      selection.ranges[0].pdfPage === entry.page &&
      selection.ranges[0].start === entry.start &&
      selection.ranges[0].end === entry.end,
  );
  const selectedColor = editingHighlight?.color ?? highlights.at(-1)?.color ?? "#c6d8d4";
  const preview = selection
    ? {
        selection,
        color:
          mode === "default" || mode === "word" || mode === "comment" ? "#d1d1d1" : selectedColor,
      }
    : undefined;

  const savedWord =
    selection &&
    words.find(
      (word) =>
        word.ranges.length === selection.ranges.length &&
        word.ranges.every((range, index) => {
          const selected = selection.ranges[index];
          return (
            range.pdfPage === selected.pdfPage &&
            range.start === selected.start &&
            range.end === selected.end
          );
        }),
    );
  const inlineMenu = active && selection && (
    <TextSelectionMenu
      menuRef={menuRef}
      mode={mode}
      selectedColor={selectedColor}
      onHighlight={() => activate("highlight")}
      onWord={() => activate("word")}
      wordSaved={!!savedWord}
      wordCard={
        <WordMeaningCard
          key={JSON.stringify(selection.ranges)}
          text={selection.text}
          saved={!!savedWord}
          canSave={isDictionaryWord(selection.text)}
          onComplete={finish}
          onSave={() => {
            if (!savedWord && isDictionaryWord(selection.text)) onWord(selection);
          }}
        />
      }
      onComment={() => activate("comment")}
      onColor={(color) => {
        if (editingHighlight) onUpdateHighlight(editingHighlight.id, color);
        else onHighlight(selection, color);
        finish();
      }}
      onSubmitComment={(text) => {
        onComment(selection, text);
        finish();
      }}
      onClose={finish}
    />
  );
  const openWord = (id: string) => {
    const word = words.find((entry) => entry.id === id);
    if (!word?.ranges.length) return;
    setCollected(null);
    setEditingId(null);
    openSelection(word, "word");
  };
  const openCollected = (id: string) => {
    const container = containerRef.current;
    const article = articleRef.current;
    if (!container || !article) return;
    const rects = [...article.querySelectorAll<HTMLElement>("[data-highlight-id]")]
      .filter((mark) => mark.dataset.highlightId === id)
      .flatMap((mark) => [...mark.getClientRects()]);
    if (!rects.length) return;
    const origin = container.getBoundingClientRect();
    const left =
      (Math.min(...rects.map((r) => r.left)) + Math.max(...rects.map((r) => r.right))) / 2 -
      origin.left;
    const top = Math.min(...rects.map((r) => r.top)) - origin.top;
    finish();
    setEditingId(null);
    setCollected({ id, left, top: Math.max(4, top - 44) });
  };
  const completeSelection = (event: SyntheticEvent) => {
    if ((event.target as Element).closest(".book-reader__selection")) return;
    const clickedHighlight = (event.target as Element).closest<HTMLElement>("[data-highlight-id]")
      ?.dataset.highlightId;
    const clickedWord = (event.target as Element).closest<HTMLElement>("[data-word-id]")?.dataset
      .wordId;
    const openSaved = (selected: ReaderSelection) => {
      if (clickedWord) {
        openWord(clickedWord);
        return;
      }
      if (clickedHighlight) {
        openCollected(clickedHighlight);
        return;
      }
      const saved = highlights.find(
        (entry) =>
          selected.ranges.length > 0 &&
          selected.ranges.every(
            (part) =>
              part.pdfPage === entry.page && part.start >= entry.start && part.end <= entry.end,
          ),
      );
      if (saved) openCollected(saved.id);
    };
    if (event.type === "pointerup") {
      const pointer = event as ReactPointerEvent<HTMLElement>;
      pointerUp(pointer, openSaved);
      if (pointer.pointerType === "mouse") return;
    } else pointerUp();
    const native = window.getSelection();
    if (!active || !articleRef.current || !native?.rangeCount || native.isCollapsed) return;
    const range = native.getRangeAt(0);
    if (!articleRef.current.contains(range.commonAncestorContainer)) return;
    const selected = getReaderSelection(articleRef.current, range, page.fragments);
    const saved = highlights.find(
      (entry) =>
        selected.ranges.length > 0 &&
        selected.ranges.every(
          (part) =>
            part.pdfPage === entry.page && part.start >= entry.start && part.end <= entry.end,
        ),
    );
    if (saved) openCollected(saved.id);
  };
  // Splitting a paragraph for inline controls must not discard the native range.
  useLayoutEffect(() => {
    if (!selection || mode !== "default" || !articleRef.current) return;
    const nodes = [...articleRef.current.querySelectorAll<HTMLElement>("[data-fragment-id]")];
    const locate = (pdfPage: number, offset: number, end: boolean) => {
      const candidates = nodes.filter(
        (node) =>
          Number(node.dataset.pdfPage) === pdfPage &&
          Number(node.dataset.sourceStart) <= offset &&
          Number(node.dataset.sourceEnd) >= offset,
      );
      const element = end ? candidates[0] : candidates.at(-1);
      if (!element) return null;
      const fragment = page.fragments.find((item) => item.id === element.dataset.fragmentId);
      if (!fragment || fragment.type !== "text") return null;
      let display = Number(element.dataset.displayStart ?? 0);
      while (
        display < fragment.text.length &&
        (fragment.sourceOffsets?.[display] ?? fragment.start + display) < offset
      )
        display++;
      let remaining = display - Number(element.dataset.displayStart ?? 0);
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (remaining <= node.textContent!.length) return { node, offset: remaining };
        remaining -= node.textContent!.length;
      }
      return null;
    };
    const first = selection.ranges[0],
      last = selection.ranges.at(-1)!;
    const from = locate(first.pdfPage, first.start, false),
      to = locate(last.pdfPage, last.end, true);
    if (from && to) {
      const range = document.createRange();
      range.setStart(from.node, from.offset);
      range.setEnd(to.node, to.offset);
      const native = window.getSelection();
      native?.removeAllRanges();
      native?.addRange(range);
    }
  }, [selection, mode, page.fragments]);
  useLayoutEffect(() => {
    if (!selection) {
      if (containerRef.current) containerRef.current.scrollTop = 0;
      return;
    }
    const container = containerRef.current;
    const menu = menuRef.current;
    if (!container || !menu) return;
    // Card expansions happen inside WordMeaningCard, without changing selection
    // or mode. Keep the inline controls inside this reader's scroll viewport.
    const reveal = () => {
      const bounds = container.getBoundingClientRect();
      const controls = menu.getBoundingClientRect();
      const delta =
        controls.bottom > bounds.bottom
          ? controls.bottom - bounds.bottom
          : controls.height <= container.clientHeight && controls.top < bounds.top
            ? controls.top - bounds.top
            : 0;
      container.scrollTop += delta;
    };
    reveal();
    const observer = new ResizeObserver(reveal);
    observer.observe(menu);
    observer.observe(container);
    return () => observer.disconnect();
  }, [selection, mode]);
  return (
    <div
      ref={containerRef}
      className={`book-reader__text-container${selection ? " has-inline-menu" : ""}`}
    >
      <article
        ref={articleRef}
        aria-label={`PDF ${page.pdfPages.join(", ")}페이지 본문`}
        data-page-number={page.pdfPage}
        className="book-reader__text"
        data-comment-editing={mode === "comment" || undefined}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={active ? completeSelection : undefined}
        onPointerCancel={active ? pointerCancel : undefined}
        onDoubleClick={active ? doubleClick : undefined}
        onKeyUp={active ? completeSelection : undefined}
        onTouchEnd={active ? completeSelection : undefined}
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
          const lastFragment =
            selection &&
            page.fragments.findLast(
              (item) =>
                item.type === "text" &&
                selection.ranges.some(
                  (range) =>
                    range.pdfPage === item.pdfPage &&
                    range.end > item.start &&
                    range.start < item.end,
                ),
            );
          const last = selection?.ranges.findLast(
            (range) =>
              range.pdfPage === fragment.pdfPage &&
              range.start < fragment.end &&
              range.end > fragment.start,
          );
          const insert =
            active &&
            last &&
            last.pdfPage === fragment.pdfPage &&
            last.end > fragment.start &&
            lastFragment?.id === fragment.id;
          let cut = fragment.text.length;
          if (insert) {
            cut = 0;
            while (
              cut < fragment.text.length &&
              (fragment.sourceOffsets?.[cut] ?? fragment.start + cut) < last.end
            )
              cut++;
          }
          const pieces = insert
            ? [
                [0, cut],
                [cut, fragment.text.length],
              ]
            : [[0, fragment.text.length]];
          return (
            <Fragment key={fragment.id}>
              {pieces.map(([from, to], index) => {
                const piece = {
                  ...fragment,
                  text: fragment.text.slice(from, to),
                  start: fragment.sourceOffsets?.[from] ?? fragment.start + from,
                  end: fragment.sourceOffsets?.[to] ?? fragment.start + to,
                  sourceOffsets: fragment.sourceOffsets?.slice(from, to + 1),
                };
                return (
                  <Fragment key={index}>
                    {to > from && (
                      <p
                        dir="auto"
                        data-fragment-id={fragment.id}
                        data-display-start={from}
                        data-pdf-page={fragment.pdfPage}
                        data-source-start={piece.start}
                        data-source-end={piece.end}
                      >
                        {getAnnotatedTextParts(piece, highlights, words, comments, preview).map(
                          (part) => {
                            const Tag = part.background ? "mark" : "span";
                            return (
                              <Tag
                                key={part.position}
                                style={{ backgroundColor: part.background }}
                                className={part.wordId ? "book-reader__word" : undefined}
                                data-highlight-id={part.highlightId}
                                data-word-id={part.wordId}
                                role={part.wordEnd ? "button" : undefined}
                                tabIndex={part.wordEnd ? 0 : undefined}
                                aria-label={
                                  part.wordEnd
                                    ? `${words.find((word) => word.id === part.wordId)?.text} 뜻 보기`
                                    : undefined
                                }
                                onKeyDown={(event) => {
                                  if (
                                    active &&
                                    part.wordId &&
                                    (event.key === "Enter" || event.key === " ")
                                  ) {
                                    event.preventDefault();
                                    openWord(part.wordId);
                                  }
                                }}
                                data-comment-id={part.commentId}
                                data-selection-preview={part.preview || undefined}
                                onClick={(event) => {
                                  if (
                                    !active ||
                                    mode === "comment" ||
                                    (!part.highlightId && !part.wordId) ||
                                    event.detail > 1 ||
                                    isMousePointer() ||
                                    window.getSelection()?.toString()
                                  )
                                    return;
                                  if (part.wordId) openWord(part.wordId);
                                  else if (part.highlightId) openCollected(part.highlightId);
                                }}
                              >
                                {active && mode === "default" && part.selectionStart && (
                                  <span
                                    className="book-reader__selection-edge book-reader__selection-edge--start"
                                    aria-hidden="true"
                                  />
                                )}
                                {part.text}
                                {active && mode === "default" && part.selectionEnd && (
                                  <span
                                    className="book-reader__selection-edge book-reader__selection-edge--end"
                                    aria-hidden="true"
                                  />
                                )}
                                {part.wordEnd && (
                                  <span className="book-reader__saved-dot" aria-hidden="true" />
                                )}
                              </Tag>
                            );
                          },
                        )}
                      </p>
                    )}
                    {insert && index === 0 && inlineMenu}
                  </Fragment>
                );
              })}
            </Fragment>
          );
        })}
      </article>
      {active && collected && savedHighlight && (
        <CollectedSentenceMenu
          menuRef={collectedRef}
          left={collected.left}
          top={collected.top}
          onChangeColor={() => {
            const { page: pdfPage, start, end, text, id } = savedHighlight;
            setEditingId(id);
            setCollected(null);
            openSelection({ text, ranges: [{ pdfPage, start, end, text }] }, "highlight");
          }}
          onDelete={() => {
            onUpdateHighlight(savedHighlight.id);
            setCollected(null);
          }}
          onNote={() => {
            const { page: pdfPage, start, end, text, id } = savedHighlight;
            setEditingId(id);
            setCollected(null);
            openSelection({ text, ranges: [{ pdfPage, start, end, text }] });
          }}
        />
      )}
    </div>
  );
}

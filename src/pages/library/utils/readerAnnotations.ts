import type { ReaderComment } from "../types/readerComment";
import type { ReaderFragment } from "./paginateReaderText";
import type { ReaderHighlight, ReaderWord } from "./useReaderData";
import type { ReaderSelection } from "./readerSelection";

type Annotation = {
  id: string;
  start: number;
  end: number;
  kind: "highlight" | "word" | "comment" | "preview";
  color?: string;
};

export function getAnnotatedTextParts(
  fragment: Extract<ReaderFragment, { type: "text" }>,
  highlights: ReaderHighlight[],
  words: ReaderWord[],
  comments: ReaderComment[],
  preview?: { selection: ReaderSelection; color: string },
) {
  const { start, end, pdfPage, text } = fragment;
  const annotations: Annotation[] = [];
  const add = (entry: Annotation, page: number) => {
    if (page === pdfPage && entry.start < end && entry.end > start) annotations.push(entry);
  };
  highlights.forEach((entry) => add({ ...entry, kind: "highlight" }, entry.page));
  words.forEach((word) =>
    word.ranges.forEach((range) => add({ ...range, id: word.id, kind: "word" }, range.pdfPage)),
  );
  comments.forEach((comment) =>
    comment.ranges?.forEach((range) =>
      add({ ...range, id: comment.id, kind: "comment" }, range.pdfPage),
    ),
  );
  preview?.selection.ranges.forEach((range) =>
    add({ ...range, id: "preview", kind: "preview", color: preview.color }, range.pdfPage),
  );
  const sourceAt = (offset: number) => fragment.sourceOffsets?.[offset] ?? start + offset;
  const bounds = new Set([0, text.length]);
  for (const annotation of annotations) {
    let from = 0;
    while (from < text.length && sourceAt(from + 1) <= annotation.start) from++;
    let to = from;
    while (to < text.length && sourceAt(to) < annotation.end) to++;
    bounds.add(from);
    bounds.add(to);
  }
  const boundaries = [...bounds].sort((a, b) => a - b);
  return boundaries.slice(0, -1).map((position, index) => {
    const next = boundaries[index + 1];
    const overlaps = annotations.filter(
      (entry) => entry.start < sourceAt(next) && entry.end > sourceAt(position),
    );
    const highlight = overlaps.findLast((entry) => entry.kind === "highlight");
    const word = overlaps.findLast((entry) => entry.kind === "word");
    const wordLastRange = word && words.find((entry) => entry.id === word.id)?.ranges.at(-1);
    const comment = overlaps.findLast((entry) => entry.kind === "comment");
    const temporary = overlaps.findLast((entry) => entry.kind === "preview");
    const firstSelected = preview?.selection.ranges[0];
    const lastSelected = preview?.selection.ranges.at(-1);
    return {
      position,
      text: text.slice(position, next),
      background: temporary?.color ?? highlight?.color,
      highlightId: highlight?.id,
      wordId: word?.id,
      wordEnd:
        !!word &&
        sourceAt(next) >= word.end &&
        wordLastRange?.pdfPage === pdfPage &&
        wordLastRange.end === word.end,
      commentId: comment?.id,
      preview: !!temporary,
      selectionStart:
        !!temporary &&
        firstSelected?.pdfPage === pdfPage &&
        sourceAt(position) === firstSelected.start,
      selectionEnd:
        !!temporary && lastSelected?.pdfPage === pdfPage && sourceAt(next) === lastSelected.end,
    };
  });
}

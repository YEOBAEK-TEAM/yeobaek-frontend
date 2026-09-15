import type { ReaderFragment } from "./paginateReaderText";

export type ReaderSelectionRange = { pdfPage: number; start: number; end: number; text: string };
export type ReaderSelection = { text: string; ranges: ReaderSelectionRange[] };

export function getSentenceRangeFromOffset(text: string, offset: number) {
  const segments = new Intl.Segmenter("ko", { granularity: "sentence" }).segment(text);
  for (const part of segments) {
    if (offset < part.index || offset >= part.index + part.segment.length) continue;
    const start = part.index + part.segment.length - part.segment.trimStart().length;
    return { start, end: part.index + part.segment.trimEnd().length };
  }
  return null;
}

// Hit-test actual glyph rectangles so paragraph padding and line-end whitespace
// remain empty-area clicks, even while native selection is disabled by CSS.
export function getReaderTextPoint(article: HTMLElement, x: number, y: number) {
  for (const element of article.querySelectorAll<HTMLElement>("[data-fragment-id]")) {
    const bounds = element.getBoundingClientRect();
    if (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) continue;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let displayed = Number(element.dataset.displayStart ?? 0);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent ?? "";
      for (let offset = 0; offset < text.length;) {
        const length = String.fromCodePoint(text.codePointAt(offset)!).length;
        const range = document.createRange();
        range.setStart(node, offset);
        range.setEnd(node, offset + length);
        if (
          text.slice(offset, offset + length).trim() &&
          [...range.getClientRects()].some(
            (rect) => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom,
          )
        )
          return { fragmentId: element.dataset.fragmentId!, offset: displayed + offset };
        offset += length;
      }
      displayed += text.length;
    }
  }
  return null;
}

export function getReaderSelectionAtPoint(
  fragments: ReaderFragment[],
  point: { fragmentId: string; offset: number },
  word: boolean,
): ReaderSelection | null {
  // Join visible text fragments; offsets below still map to each original PDF page.
  const entries: { fragment: Extract<ReaderFragment, { type: "text" }>; start: number }[] = [];
  let text = "";
  for (const fragment of fragments) {
    if (fragment.type !== "text") continue;
    if (text) text += " ";
    entries.push({ fragment, start: text.length });
    text += fragment.text;
  }
  const entry = entries.find(({ fragment }) => fragment.id === point.fragmentId);
  if (!entry) return null;
  const offset = entry.start + point.offset;
  const segment = word
    ? [...new Intl.Segmenter("ko", { granularity: "word" }).segment(text)].find(
        (part) =>
          part.isWordLike && offset >= part.index && offset < part.index + part.segment.length,
      )
    : null;
  const range = word
    ? segment && { start: segment.index, end: segment.index + segment.segment.length }
    : getSentenceRangeFromOffset(text, offset);
  if (!range) return null;
  const ranges = entries.flatMap(({ fragment, start }) => {
    const from = Math.max(0, range.start - start);
    const to = Math.min(fragment.text.length, range.end - start);
    return from < to
      ? [
          {
            pdfPage: fragment.pdfPage,
            start: fragment.sourceOffsets?.[from] ?? fragment.start + from,
            end: fragment.sourceOffsets?.[to] ?? fragment.start + to,
            text: fragment.text.slice(from, to),
          },
        ]
      : [];
  });
  return ranges.length ? { text: ranges.map((part) => part.text).join(""), ranges } : null;
}

// DOM offsets belong to the displayed paragraph; durable offsets belong to its
// source PDF page, including whitespace that was repaired for display.
export function getReaderSelection(
  article: HTMLElement,
  range: Range,
  fragments: ReaderFragment[],
): ReaderSelection {
  const paragraphs = [...article.querySelectorAll<HTMLElement>("[data-fragment-id]")];
  const ranges: ReaderSelectionRange[] = [];
  for (const fragment of fragments) {
    if (fragment.type !== "text") continue;
    for (const element of paragraphs.filter((entry) => entry.dataset.fragmentId === fragment.id)) {
      if (!element || !range.intersectsNode(element)) continue;
      const part = range.cloneRange();
      if (!element.contains(range.startContainer)) part.setStart(element, 0);
      if (!element.contains(range.endContainer)) part.setEnd(element, element.childNodes.length);
      const text = part.toString();
      if (!text.length) continue;
      const prefix = part.cloneRange();
      prefix.selectNodeContents(element);
      prefix.setEnd(part.startContainer, part.startOffset);
      const from = prefix.toString().length + Number(element.dataset.displayStart ?? 0);
      const to = from + text.length;
      const start = fragment.sourceOffsets?.[from] ?? fragment.start + from;
      const end = fragment.sourceOffsets?.[to] ?? fragment.start + to;
      const previous = ranges[ranges.length - 1];
      if (previous?.pdfPage === fragment.pdfPage && previous.end === start) {
        previous.end = end;
        previous.text += text;
      } else ranges.push({ pdfPage: fragment.pdfPage, start, end, text });
    }
  }
  // Inline controls are not part of the PDF's selected text.
  return { text: ranges.map((entry) => entry.text).join(""), ranges };
}

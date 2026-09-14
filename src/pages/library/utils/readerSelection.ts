import type { ReaderFragment } from "./paginateReaderText";

export type ReaderSelectionRange = { pdfPage: number; start: number; end: number; text: string };
export type ReaderSelection = { text: string; ranges: ReaderSelectionRange[] };

// DOM offsets belong to the displayed paragraph; durable offsets belong to its
// source PDF page, including whitespace that was repaired for display.
export function getReaderSelection(
  article: HTMLElement,
  range: Range,
  fragments: ReaderFragment[],
): ReaderSelection {
  const paragraphs = new Map(
    [...article.querySelectorAll<HTMLElement>("[data-fragment-id]")].map((element) => [
      element.dataset.fragmentId,
      element,
    ]),
  );
  const ranges: ReaderSelectionRange[] = [];
  for (const fragment of fragments) {
    if (fragment.type !== "text") continue;
    const element = paragraphs.get(fragment.id);
    if (!element || !range.intersectsNode(element)) continue;
    const part = range.cloneRange();
    if (!element.contains(range.startContainer)) part.setStart(element, 0);
    if (!element.contains(range.endContainer)) part.setEnd(element, element.childNodes.length);
    const text = part.toString();
    if (!text.length) continue;
    const prefix = part.cloneRange();
    prefix.selectNodeContents(element);
    prefix.setEnd(part.startContainer, part.startOffset);
    const from = prefix.toString().length;
    const to = from + text.length;
    const start = fragment.sourceOffsets?.[from] ?? fragment.start + from;
    const end = fragment.sourceOffsets?.[to] ?? fragment.start + to;
    const previous = ranges[ranges.length - 1];
    if (previous?.pdfPage === fragment.pdfPage && previous.end === start) {
      previous.end = end;
      previous.text += text;
    } else ranges.push({ pdfPage: fragment.pdfPage, start, end, text });
  }
  return { text: range.toString(), ranges };
}

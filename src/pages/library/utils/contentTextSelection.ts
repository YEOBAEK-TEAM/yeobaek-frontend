export type ContentTextSelection = { text: string; sentenceId: number };

export function sentenceElement(root: HTMLElement, node: Node): HTMLElement | null {
  const element = node instanceof Element ? node : node.parentElement;
  const sentence = element?.closest<HTMLElement>("[data-sentence-id]") ?? null;
  return sentence && root.contains(sentence) ? sentence : null;
}

export function getContentTextSelection(
  root: HTMLElement,
  range: Range,
): ContentTextSelection | null {
  const start = sentenceElement(root, range.startContainer);
  const end = sentenceElement(root, range.endContainer);
  if (!start || start !== end) return null;
  const sentenceId = Number(start.dataset.sentenceId);
  const text = range.toString().trim();
  return text && Number.isSafeInteger(sentenceId) && sentenceId > 0 ? { text, sentenceId } : null;
}

// DOM offsets are transient word-boundary coordinates, never API identities.
export function contentWordRange(root: HTMLElement, x: number, y: number): Range | null {
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  const caret = doc.caretPositionFromPoint?.(x, y);
  const fallback = caret ? null : doc.caretRangeFromPoint?.(x, y);
  const node = caret?.offsetNode ?? fallback?.startContainer;
  const offset = caret?.offset ?? fallback?.startOffset;
  if (
    !node ||
    offset === undefined ||
    !sentenceElement(root, node) ||
    node.nodeType !== Node.TEXT_NODE
  )
    return null;
  const text = node.textContent ?? "";
  const part = [...new Intl.Segmenter("ko", { granularity: "word" }).segment(text)].find(
    (segment) =>
      segment.isWordLike &&
      offset >= segment.index &&
      offset < segment.index + segment.segment.length,
  );
  if (!part) return null;
  const range = document.createRange();
  range.setStart(node, part.index);
  range.setEnd(node, part.index + part.segment.length);
  return range;
}

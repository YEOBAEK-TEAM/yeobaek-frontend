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
  const sentence = sentenceElement(root, node)!;
  const prefix = document.createRange();
  prefix.selectNodeContents(sentence);
  prefix.setEnd(node, offset);
  const sentenceOffset = prefix.toString().length;
  // A saved highlight can split one word across plain text and a mark node.
  const text = sentence.textContent ?? "";
  const part = [...new Intl.Segmenter("ko", { granularity: "word" }).segment(text)].find(
    (segment) =>
      segment.isWordLike &&
      sentenceOffset >= segment.index &&
      sentenceOffset < segment.index + segment.segment.length,
  );
  if (!part) return null;
  const range = document.createRange();
  const walker = document.createTreeWalker(sentence, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  let position = 0;
  let started = false;
  while (current) {
    const end = position + (current.textContent?.length ?? 0);
    if (!started && part.index < end) {
      range.setStart(current, part.index - position);
      started = true;
    }
    const wordEnd = part.index + part.segment.length;
    if (started && wordEnd <= end) {
      range.setEnd(current, wordEnd - position);
      return range;
    }
    position = end;
    current = walker.nextNode();
  }
  return null;
}

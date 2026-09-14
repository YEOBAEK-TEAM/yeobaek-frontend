export type ReaderFragment = { text: string; start: number; paragraph: number };
export type ReaderPage = {
  id: string;
  pdfPage: number;
  start: number;
  end: number;
  fragments: ReaderFragment[];
};

// Measure real browser layout, including paragraph margins and the reader's font.
// Offsets always refer to the unmodified source PDF text (UTF-16, like DOM Range).
export function paginateReaderText(
  paragraphs: string[],
  pdfPage: number,
  measure: HTMLElement,
  height: number,
): ReaderPage[] {
  const pages: ReaderPage[] = [];
  let fragments: ReaderFragment[] = [];
  let sourceOffset = 0;
  measure.replaceChildren();
  const fits = () => measure.getBoundingClientRect().height <= height;
  const flush = () => {
    if (!fragments.length) return;
    const start = fragments[0].start;
    const last = fragments[fragments.length - 1];
    pages.push({
      id: `${pdfPage}:${start}`,
      pdfPage,
      start,
      end: last.start + last.text.length,
      fragments,
    });
    fragments = [];
    measure.replaceChildren();
  };
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  paragraphs.forEach((text, paragraph) => {
    const boundaries = [...segmenter.segment(text)].map((part) => part.index);
    boundaries.push(text.length);
    let consumed = 0;
    while (consumed < boundaries.length - 1) {
      const node = document.createElement("p");
      node.dir = "auto";
      measure.append(node);
      const start = boundaries[consumed];
      let low = consumed;
      let high = boundaries.length - 1;
      while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        node.textContent = text.slice(start, boundaries[middle]);
        if (fits()) low = middle;
        else high = middle - 1;
      }
      if (low === consumed) {
        node.remove();
        if (!fragments.length)
          throw new Error("본문 영역이 한 줄보다 작습니다. 화면 높이를 늘려 주세요.");
        flush();
        continue;
      }
      const value = text.slice(start, boundaries[low]);
      node.textContent = value;
      fragments.push({ text: value, start: sourceOffset + start, paragraph });
      consumed = low;
      if (consumed < boundaries.length - 1) flush();
    }
    sourceOffset += text.length;
  });
  flush();
  if (!pages.length) pages.push({ id: `${pdfPage}:0`, pdfPage, start: 0, end: 0, fragments: [] });
  return pages;
}

export function findReaderPage(pages: ReaderPage[], anchor?: { pdfPage: number; start: number }) {
  if (!anchor) return 0;
  const index = pages.findIndex(
    (page) =>
      page.pdfPage === anchor.pdfPage &&
      page.start <= anchor.start &&
      (page.end > anchor.start || page.start === page.end),
  );
  return index < 0
    ? Math.max(
        0,
        pages.findIndex((page) => page.pdfPage === anchor.pdfPage),
      )
    : index;
}

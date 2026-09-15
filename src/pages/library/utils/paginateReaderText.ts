import type { ReaderBlock, ReaderImageBlock } from "./readerBlocks";

export type ReaderFragment =
  | {
      type: "text";
      id: string;
      text: string;
      pdfPage: number;
      start: number;
      end: number;
      sourceOffsets?: number[];
      paragraph: number;
    }
  | (ReaderImageBlock & { displayWidth: number; displayHeight: number });
export type ReaderAnchor = { pdfPage: number; start: number; imageId?: string };
export type ReaderPage = ReaderAnchor & {
  id: string;
  end: number;
  pdfPages: number[];
  fragments: ReaderFragment[];
};

// Measure the same HTML/CSS as the visible reader. Images reserve their final
// dimensions before loading, and are never split or cropped across reader pages.
export function paginateReaderBlocks(
  blocks: ReaderBlock[],
  pdfPage: number,
  measure: HTMLElement,
  height: number,
): ReaderPage[] {
  const pages: ReaderPage[] = [];
  let fragments: ReaderFragment[] = [];
  measure.replaceChildren();
  const fits = () => measure.getBoundingClientRect().height <= height;
  const flush = () => {
    if (!fragments.length) return;
    const first = fragments[0];
    const last = fragments[fragments.length - 1];
    pages.push({
      id: `${first.pdfPage}:${first.type === "image" ? first.id : first.start}`,
      pdfPage: first.pdfPage,
      pdfPages: [...new Set(fragments.map((fragment) => fragment.pdfPage))],
      start: first.start,
      imageId: first.type === "image" ? first.id : undefined,
      end: last.type === "text" ? last.end : last.start,
      fragments,
    });
    fragments = [];
    measure.replaceChildren();
  };
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  for (const block of blocks) {
    if (block.type === "image") {
      const available = height - 48; // the same 24px top/bottom margin as the image CSS
      if (available <= 0)
        throw new Error("삽화를 표시할 본문 높이가 부족합니다. 화면 높이를 늘려 주세요.");
      const width = Math.min(block.width, measure.clientWidth * block.widthRatio);
      const displayHeight = Math.min(available, (width * block.height) / block.width);
      const displayWidth = (displayHeight * block.width) / block.height;
      const node = document.createElement("img");
      node.className = "book-reader__image";
      node.alt = "";
      node.style.width = `${displayWidth}px`;
      node.style.height = `${displayHeight}px`;
      measure.append(node);
      if (!fits()) {
        node.remove();
        flush();
        measure.append(node);
      }
      if (!fits()) throw new Error("삽화를 독서 페이지에 배치하지 못했습니다.");
      fragments.push({ ...block, displayWidth, displayHeight });
      continue;
    }
    const text = block.content;
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
      fragments.push({
        type: "text",
        id: `${block.id}:${start}`,
        text: value,
        pdfPage: block.pdfPage,
        start: block.sourceOffsets?.[start] ?? block.start + start,
        end: block.sourceOffsets?.[boundaries[low]] ?? block.start + boundaries[low],
        sourceOffsets: block.sourceOffsets?.slice(start, boundaries[low] + 1),
        paragraph: block.paragraph,
      });
      consumed = low;
      if (consumed < boundaries.length - 1) flush();
    }
  }
  flush();
  if (!pages.length)
    pages.push({
      id: `${pdfPage}:0`,
      pdfPage,
      pdfPages: [pdfPage],
      start: 0,
      end: 0,
      fragments: [],
    });
  return pages;
}

// Compatibility for callers that only have PDF text.
export function paginateReaderText(
  paragraphs: string[],
  pdfPage: number,
  measure: HTMLElement,
  height: number,
): ReaderPage[] {
  let start = 0;
  const blocks = paragraphs.map((content, paragraph): ReaderBlock => {
    const block: ReaderBlock = {
      type: "text",
      id: `text:${pdfPage}:${start}`,
      content,
      pdfPage,
      start,
      paragraph,
    };
    start += content.length;
    return block;
  });
  return paginateReaderBlocks(blocks, pdfPage, measure, height);
}

export function readerPageContainsAnchor(page: ReaderPage, anchor: ReaderAnchor) {
  if (anchor.imageId)
    return page.fragments.some(
      (fragment) =>
        fragment.pdfPage === anchor.pdfPage &&
        fragment.type === "image" &&
        fragment.id === anchor.imageId,
    );
  return (
    page.fragments.some(
      (fragment) =>
        fragment.pdfPage === anchor.pdfPage &&
        fragment.type === "text" &&
        fragment.start <= anchor.start &&
        anchor.start < fragment.end,
    ) ||
    (!page.fragments.length && page.pdfPage === anchor.pdfPage && page.start === anchor.start)
  );
}

export function findReaderPage(pages: ReaderPage[], anchor?: ReaderAnchor) {
  if (!anchor) return 0;
  const index = pages.findIndex((page) => readerPageContainsAnchor(page, anchor));
  return index < 0
    ? Math.max(
        0,
        pages.findIndex((page) => page.pdfPages.includes(anchor.pdfPage)),
      )
    : index;
}

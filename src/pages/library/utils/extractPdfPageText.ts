import type { PDFDocumentProxy } from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

type Line = { text: string; sourceText: string; x: number; y: number; end: number; height: number };
export type PdfTextParagraph = {
  text: string;
  column: number;
  lines: { text: string; sourceText: string; x: number; y: number }[];
};

// Sparse tracking spaces can already exist INSIDE one PDF.js item. Only collapse
// runs of 3+ single Hangul syllables when their measured gaps are below a word gap.
export function normalizePdfItemText(item: TextItem, advance: number): string {
  if (!/^(?:[가-힣]\s+){2,}[가-힣]$/u.test(item.str)) return item.str;
  const letters = item.str.replace(/\s/gu, "");
  const gaps = item.str.match(/\s+/gu)?.length ?? 1;
  return (item.width - letters.length * advance) / gaps < advance * 0.24 ? letters : item.str;
}

// Whitespace-only repairs keep the previous extraction's offsets as durable
// anchors. A boundary maps displayed UTF-16 text back to that original text.
export function mapSourceOffsets(source: string, displayed: string, start: number): number[] {
  const offsets = [start];
  let position = 0;
  for (let i = 0; i < displayed.length; i++) {
    while (
      source[position] !== displayed[i] &&
      /\s/u.test(source[position] ?? "") &&
      position < source.length
    )
      position++;
    if (source[position] !== displayed[i])
      throw new Error("PDF 텍스트 위치를 연결하지 못했습니다.");
    position++;
    offsets.push(start + position);
  }
  offsets[offsets.length - 1] = start + source.length;
  return offsets;
}

// Use PDF line boundaries to detect paragraphs; HTML wraps the prose itself.
function toParagraphs(items: TextItem[], column: number): PdfTextParagraph[] {
  const advances = new Map<string, number[]>();
  const words = new Set(items.flatMap((item) => item.str.match(/[가-힣]{2,}/gu) ?? []));
  for (const item of items)
    if (/^[가-힣]+$/u.test(item.str) && item.width > 0) {
      const values = advances.get(item.fontName) ?? [];
      values.push(item.width / item.str.length);
      advances.set(item.fontName, values);
    }
  const typicalAdvance = new Map(
    [...advances].map(([font, values]) => [
      font,
      values.sort((a, b) => a - b)[Math.floor(values.length / 2)],
    ]),
  );
  const lines: Line[] = [];
  let line: Line | undefined;
  const flush = () => {
    if (line?.sourceText.trim())
      lines.push({ ...line, text: line.text.trim(), sourceText: line.sourceText.trim() });
    line = undefined;
  };
  for (const item of items) {
    const x = item.transform[4];
    const y = item.transform[5];
    const height = Math.max(item.height, 1);
    if (line && Math.abs(y - line.y) > Math.max(height, line.height) * 0.5) flush();
    if (item.str) {
      if (!line) line = { text: "", sourceText: "", x, y, end: x, height };
      // Adjacent glyphs are not necessarily separate words.
      const gap = x - line.end;
      if (
        line.sourceText &&
        gap > height * 0.2 &&
        !/\s$/.test(line.sourceText) &&
        !/^\s/.test(item.str)
      )
        line.sourceText += " ";
      if (line.text && gap > height * 0.3 && !/\s$/.test(line.text) && !/^\s/.test(item.str))
        line.text += " ";
      line.sourceText += item.str;
      line.text += normalizePdfItemText(
        item,
        typicalAdvance.get(item.fontName) ?? Math.abs(item.transform[0]) * 0.94,
      );
      line.end = x + item.width;
      line.height = Math.max(line.height, height);
    }
    if (item.hasEOL) flush();
  }
  flush();
  lines.sort((a, b) => b.y - a.y || a.x - b.x);
  const rightEdge = Math.max(...lines.map((entry) => entry.end));
  const paragraphs: PdfTextParagraph[] = [];
  let previous: Line | undefined;
  for (const current of lines) {
    const newParagraph =
      !previous ||
      Math.abs(previous.y - current.y) > Math.max(previous.height, current.height) * 2 ||
      current.x - previous.x > current.height * 0.7 ||
      Math.abs(previous.height - current.height) > current.height * 0.2 ||
      /^[“「『]/u.test(current.text);
    if (newParagraph)
      paragraphs.push({
        text: current.text,
        column,
        lines: [{ text: current.text, sourceText: current.sourceText, x: current.x, y: current.y }],
      });
    else {
      const paragraph = paragraphs[paragraphs.length - 1];
      const lastWord = previous?.text.match(/[가-힣]+$/u)?.[0];
      const firstWord = current.text.match(/^[가-힣]+/u)?.[0];
      const fullLine = previous && rightEdge - previous.end < previous.height * 1.2;
      const joinsWord =
        fullLine &&
        lastWord &&
        firstWord &&
        (words.has(lastWord + firstWord) ||
          /^(?:의|은|는|을|를|에서|에게|으로|까지|부터|처럼|보다|히)(?=\s|[,.!?…]|$)/u.test(
            current.text,
          ));
      const text = `${joinsWord ? "" : " "}${current.text}`;
      paragraph.text += text;
      paragraph.lines.push({
        text,
        sourceText: ` ${current.sourceText}`,
        x: current.x,
        y: current.y,
      });
    }
    previous = current;
  }
  return paragraphs;
}

export async function extractPdfPageTextLayout(
  pdf: PDFDocumentProxy,
  pageNumber: number,
): Promise<PdfTextParagraph[]> {
  const page = await pdf.getPage(pageNumber);
  const content = await page.getTextContent();
  const [left, bottom, right, top] = page.view;
  const width = right - left;
  const height = top - bottom;
  const items = content.items.filter((item): item is TextItem => "str" in item);
  // Omit isolated printed page numbers in the bottom margin.
  const body = items.filter(
    (item) => !(/^\s*\d+\s*$/.test(item.str) && item.transform[5] < bottom + height * 0.08),
  );
  // This book uses landscape spreads. Read the left leaf before the right;
  // navigation still counts each original PDF page exactly once.
  if (width > height) {
    const middle = left + width / 2;
    return [
      ...toParagraphs(
        body.filter((item) => item.transform[4] < middle),
        0,
      ),
      ...toParagraphs(
        body.filter((item) => item.transform[4] >= middle),
        1,
      ),
    ];
  }
  return toParagraphs(body, 0);
}

// Keep the existing text-only API; layout lines also retain legacy source text.
export async function extractPdfPageText(
  pdf: PDFDocumentProxy,
  pageNumber: number,
): Promise<string[]> {
  return (await extractPdfPageTextLayout(pdf, pageNumber)).map((paragraph) => paragraph.text);
}

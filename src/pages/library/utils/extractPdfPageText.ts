import type { PDFDocumentProxy } from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

type Line = { text: string; x: number; y: number; end: number; height: number };
export type PdfTextParagraph = {
  text: string;
  column: number;
  lines: { text: string; x: number; y: number }[];
};

// Use PDF line boundaries to detect paragraphs; HTML wraps the prose itself.
function toParagraphs(items: TextItem[], column: number): PdfTextParagraph[] {
  const lines: Line[] = [];
  let line: Line | undefined;
  const flush = () => {
    if (line?.text.trim()) lines.push({ ...line, text: line.text.trim() });
    line = undefined;
  };
  for (const item of items) {
    const x = item.transform[4];
    const y = item.transform[5];
    const height = Math.max(item.height, 1);
    if (line && Math.abs(y - line.y) > Math.max(height, line.height) * 0.5) flush();
    if (item.str) {
      if (!line) line = { text: "", x, y, end: x, height };
      // Adjacent glyphs are not necessarily separate words.
      const gap = x - line.end;
      if (line.text && gap > height * 0.2 && !/\s$/.test(line.text) && !/^\s/.test(item.str))
        line.text += " ";
      line.text += item.str;
      line.end = x + item.width;
      line.height = Math.max(line.height, height);
    }
    if (item.hasEOL) flush();
  }
  flush();
  lines.sort((a, b) => b.y - a.y || a.x - b.x);
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
        lines: [{ text: current.text, x: current.x, y: current.y }],
      });
    else {
      const paragraph = paragraphs[paragraphs.length - 1];
      const text = ` ${current.text}`;
      paragraph.text += text;
      paragraph.lines.push({ text, x: current.x, y: current.y });
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

// Preserve the existing text API and exact character offsets used by highlights.
export async function extractPdfPageText(
  pdf: PDFDocumentProxy,
  pageNumber: number,
): Promise<string[]> {
  return (await extractPdfPageTextLayout(pdf, pageNumber)).map((paragraph) => paragraph.text);
}

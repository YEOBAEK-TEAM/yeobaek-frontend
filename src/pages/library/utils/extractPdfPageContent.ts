import type { PDFDocumentProxy } from "pdfjs-dist";
import { extractPdfPageTextLayout, mapSourceOffsets } from "./extractPdfPageText";
import type { ReaderBlock } from "./readerBlocks";

export async function extractPdfPageContent(
  pdf: PDFDocumentProxy,
  pdfPage: number,
): Promise<ReaderBlock[]> {
  const paragraphs = await extractPdfPageTextLayout(pdf, pdfPage);
  let offset = 0;
  // Layout orders columns and lines. Preserve the original text offsets.
  return paragraphs.map((paragraph, index) => {
    const sourceOffsets = [offset];
    const block: ReaderBlock = {
      type: "text",
      id: "text:" + pdfPage + ":" + offset,
      content: "",
      pdfPage,
      start: offset,
      paragraph: index,
      sourceOffsets,
    };
    for (const line of paragraph.lines) {
      block.content += line.text;
      sourceOffsets.push(...mapSourceOffsets(line.sourceText, line.text, offset).slice(1));
      offset += line.sourceText.length;
    }
    return block;
  });
}

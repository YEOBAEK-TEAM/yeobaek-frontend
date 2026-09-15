import type { PDFDocumentProxy } from "pdfjs-dist";
import { extractPdfPageTextLayout, mapSourceOffsets } from "./extractPdfPageText";
import { extractPdfPageImages, PdfImageResources } from "./extractPdfPageImages";
import type { ReaderBlock } from "./readerBlocks";

export async function extractPdfPageContent(
  pdf: PDFDocumentProxy,
  pdfPage: number,
  resources: PdfImageResources,
): Promise<ReaderBlock[]> {
  const page = await pdf.getPage(pdfPage);
  const [paragraphs, images] = await Promise.all([
    extractPdfPageTextLayout(pdf, pdfPage),
    extractPdfPageImages(page, resources),
  ]);
  const [left, bottom, right, top] = page.view;
  const spread = right - left > top - bottom;
  const leafWidth = (right - left) / (spread ? 2 : 1);
  const blocks: ReaderBlock[] = [];
  let offset = 0;
  for (let column = 0; column < (spread ? 2 : 1); column++) {
    const pictures = images
      .filter((image) => (spread && image.x >= left + leafWidth ? 1 : 0) === column)
      .sort((a, b) => b.y - a.y || a.x - b.x);
    let pictureIndex = 0;
    const insertPictures = (y: number) => {
      while (pictureIndex < pictures.length && pictures[pictureIndex].y >= y) {
        const image = pictures[pictureIndex++];
        blocks.push({
          type: "image",
          id: image.id,
          src: image.src,
          pdfPage,
          start: offset,
          width: image.width,
          height: image.height,
          widthRatio: Math.min(1, image.placedWidth / (leafWidth * 0.7)),
        });
      }
    };
    paragraphs.forEach((paragraph, index) => {
      if (paragraph.column !== column) return;
      paragraph.lines.forEach((line) => {
        insertPictures(line.y);
        const sourceOffsets = mapSourceOffsets(line.sourceText, line.text, offset);
        const last = blocks[blocks.length - 1];
        if (last?.type === "text" && last.paragraph === index) {
          last.content += line.text;
          last.sourceOffsets?.push(...sourceOffsets.slice(1));
        } else
          blocks.push({
            type: "text",
            id: `text:${pdfPage}:${offset}`,
            content: line.text,
            pdfPage,
            start: offset,
            paragraph: index,
            sourceOffsets,
          });
        offset += line.sourceText.length;
      });
    });
    insertPictures(-Infinity);
  }
  return blocks;
}

export type ReaderTextBlock = {
  type: "text";
  id: string;
  content: string;
  pdfPage: number;
  start: number;
  paragraph: number;
  sourceOffsets?: number[];
};
export type ReaderBlock = ReaderTextBlock;

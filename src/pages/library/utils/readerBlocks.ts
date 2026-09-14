export type ReaderTextBlock = {
  type: "text";
  id: string;
  content: string;
  pdfPage: number;
  start: number;
  paragraph: number;
  sourceOffsets?: number[];
};
export type ReaderImageBlock = {
  type: "image";
  id: string;
  src: string;
  pdfPage: number;
  start: number;
  width: number;
  height: number;
  widthRatio: number;
};
export type ReaderBlock = ReaderTextBlock | ReaderImageBlock;

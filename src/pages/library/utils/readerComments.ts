import { findReaderPage } from "./paginateReaderText";
import type { ReaderPage } from "./paginateReaderText";
import type { ReaderComment } from "../types/readerComment";

export function getCommentReaderPageIndex(comment: ReaderComment, pages: ReaderPage[]) {
  const anchor = comment.readerAnchor ?? comment.ranges?.[0];
  if (anchor) return findReaderPage(pages, anchor);
  // Legacy page-only comments have no exact position. Show them once, on the
  // first reader page containing that PDF page, rather than on every split page.
  return pages.findIndex((page) => page.pdfPages.includes(comment.page));
}

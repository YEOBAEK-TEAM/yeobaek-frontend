import type { ContentChapterPage } from "@/types/contentPage";
import { usePageCommentsSheet } from "../hooks/usePageCommentsSheet";
import ReaderCommentsSheet from "./ReaderCommentsSheet";

export default function PageCommentsSheet({
  pageId,
  pageNumber,
  commentCount,
  sentences,
  onClose,
}: {
  pageId: number;
  pageNumber: number;
  commentCount: number;
  sentences: ContentChapterPage["sentences"];
  onClose: () => void;
}) {
  const sheet = usePageCommentsSheet({ pageId, pageNumber, commentCount, sentences });
  return <ReaderCommentsSheet {...sheet} pageNumber={pageNumber} onClose={onClose} />;
}

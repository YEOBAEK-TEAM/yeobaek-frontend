// 문장 상세/목데이터용
export type SentenceItem = {
  id: number;
  content: string;
  bookTitle: string;
  page: number;
  memo: string;
  hasComment: boolean;
  collectedAt: string;
};

// 문장 목록 UI용
export type SentenceListItem = {
  id: number;
  content: string;
  bookTitle: string;
  page: number;
  collectedAt: string;
};

// 수집한 문장 목록 API 응답 항목
export type HighlightColor = "YELLOW" | "GREEN" | "BLUE" | "PINK" | "GRAY";
export type HighlightRequest = { sentenceId: number; content: string; color: HighlightColor };
export type HighlightResponse = HighlightRequest & { createdAt: string };

export type SentenceHighlightListItemResponse = {
  sentenceId: number;
  content: string;
  color: HighlightColor;
  createdAt: string;
  bookId: number;
  bookTitle: string;
  pageId: number;
  pageNumber: number;
  chapter: string;
};

export type SentenceDetailResponse = SentenceHighlightListItemResponse & {
  memo: string | null;
};

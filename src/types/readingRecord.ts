export type ReadingRecordStatus = "ALL" | "COMPLETED";

export type ReadingRecordItem = {
  recordId: number;
  bookId: number;
  bookTitle: string;
  author: string;
  coverImageUrl: string;
  allPage: number;
  progressRate: number;
  lastPageId: number;
  lastPageNumber: number;
  lastReadAt: string;
  startedAt: string;
  completedAt: string | null;
  repeatCount: number;
};

export type ReadingRecordList = {
  items: ReadingRecordItem[];
  nextCursor: number | null;
  hasNext: boolean;
};

// Swagger의 생성 응답 확인 전에는 응답 필드를 추정하지 않습니다.
export type AddReadingRecordResponse = unknown;

export type ReadingRecordParams = {
  status?: ReadingRecordStatus;
  cursor?: number;
  size?: number;
};

export type UpdateReadingProgressRequest = {
  pageId: number;
};

export type UpdateReadingProgressResponse = {
  recordId: number;
  lastPageNumber: number;
  progressRate: number;
  lastReadAt: string;
};

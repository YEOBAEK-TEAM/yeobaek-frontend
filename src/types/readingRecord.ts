export type ReadingRecordStatus = "ALL" | "COMPLETED";

export type ReadingRecordItem = {
  recordId: number;
  bookId: number;
  bookTitle: string;
  coverImageUrl: string;
  progressRate: number;
  lastPageNumber: number;
  startedAt: string;
  completedAt: string | null;
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

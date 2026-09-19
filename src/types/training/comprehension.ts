import type { ChatBaseMessage } from "@/types/training/chat";

export type UnderstandMessageRole = "AI" | "USER";

export type UnderstandMessageType = "TEXT" | "IMAGE" | "FILE";

// END_CONFIRM은 예·아니요 응답을 기다리는 상태
export type UnderstandRoomStatus = "IN_PROGRESS" | "END_CONFIRM" | "COMPLETED";

export type BookmarkPageInfo = {
  pageId: number;
  pageNumber: number;
};

// 같은 책에서 연속된 페이지는 한 묶음으로 내려옴
export type BookmarkItemResponse = {
  bookId: number;
  bookTitle: string;
  author: string | null;
  coverImageUrl: string | null;
  startPageNumber: number;
  endPageNumber: number;
  pages: BookmarkPageInfo[];
  firstSentence: string | null;
  savedAt: string;
};

export type BookmarkListResponse = {
  items: BookmarkItemResponse[];
  nextCursorSavedAt: string | null;
  nextCursorId: number | null;
  hasNext: boolean;
};

export type UnderstandStartRequest = {
  // 선택한 묶음의 모든 페이지 ID
  targetIds: number[];
};

export type UnderstandStartResponse = {
  understandRoomId: number;
  bookId: number;
  bookTitle: string;
  author: string | null;
  bookImageUrl: string | null;
  startPageNumber: number;
  endPageNumber: number;
  firstQuestion: string;
  // 바로 골라 보낼 수 있는 예시 질문, 이력에는 저장되지 않음
  options: string[];
};

export type UnderstandSummationResponse = {
  understandRoomId: number;
  bookTitle: string;
  range: string;
  subject: string;
  result: string;
};

export type UnderstandMessageItemResponse = {
  role: UnderstandMessageRole;
  content: string;
  type: UnderstandMessageType;
  createdAt: string;
};

export type UnderstandMessageListResponse = {
  items: UnderstandMessageItemResponse[];
  status: UnderstandRoomStatus;
  bookTitle: string;
  author: string | null;
  bookImageUrl: string | null;
  startPageNumber: number;
  endPageNumber: number;
  nextCursor: number | null;
  hasNext: boolean;
};

export type UnderstandMessageResponse = {
  understandChatId: number;
  role: UnderstandMessageRole;
  messageType: UnderstandMessageType;
  content: string;
  createdAt: string;
  end: boolean;
  // true면 예·아니요 버튼을 띄우고 고른 값을 그대로 다시 전송
  awaitingEndConfirmation: boolean;
  summation: UnderstandSummationResponse | null;
};

export type UnderstandRoomListItemResponse = {
  understandRoomId: number;
  bookId: number;
  startPageNumber: number | null;
  endPageNumber: number | null;
  bookTitle: string;
  author: string | null;
  bookImageUrl: string | null;
  status: UnderstandRoomStatus;
};

export type UnderstandRoomListResponse = {
  items: UnderstandRoomListItemResponse[];
  nextCursor: number | null;
  hasNext: boolean;
};

// 책갈피 선택 화면 항목
export type BookmarkView = {
  key: string;
  bookId: number;
  title: string;
  author: string;
  coverUrl: string;
  pageLabel: string;
  targetIds: number[];
};

// 채팅 상단 고정 영역
export type ComprehensionBookView = {
  title: string;
  author: string;
  coverUrl: string;
  pageLabel: string;
};

export type ComprehensionMessage = ChatBaseMessage;

export type ComprehensionPhase =
  { type: "selecting" } | { type: "chatting" } | { type: "confirmEnd" } | { type: "ended" };

export type ComprehensionSummary = {
  bookTitle: string;
  pageRange: string;
  topic: string;
};

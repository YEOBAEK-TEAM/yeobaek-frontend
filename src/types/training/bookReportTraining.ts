export type TrainingMessageRole = "AI" | "USER";

export type TrainingMessageType = "TEXT" | "IMAGE" | "FILE";

// 작성한 독후감이 없으면 404
export type TrainingEntryResponse = {
  nickname: string;
  reviewId: number;
  bookId: number;
  bookTitle: string;
};

export type StartTrainingRequest = {
  reviewId: number;
  // 화면에 보여준 리티 첫 인사말, 서버에 AI 메시지로 저장
  message: string;
};

export type StartTrainingResponse = {
  trainingRoomId: number;
};

export type TrainingMessageItemResponse = {
  role: TrainingMessageRole;
  content: string;
  type: TrainingMessageType;
  createdAt: string;
};

// 메시지 목록은 최신순
export type TrainingMessageListResponse = {
  items: TrainingMessageItemResponse[];
  nextCursor: number | null;
  hasNext: boolean;
};

export type SendTrainingMessageRequest = {
  trainingRoomId: number;
  content: string;
  signal?: AbortSignal;
};

// 저장된 AI 답변만 반환
export type SendTrainingMessageResponse = {
  trainingChatId: number;
  role: TrainingMessageRole;
  messageType: TrainingMessageType;
  content: string;
  createdAt: string;
};

export type TrainingSummationResponse = {
  trainingRoomId: number;
  bookTitle: string;
  subject: string;
  upgradePoint: string;
  firstThink: string;
  finalThink: string;
};

export type TrainingReviewStatus = "DRAFT" | "PUBLISHED";

export type TrainingReviewItemResponse = {
  reviewId: number;
  bookId: number;
  bookTitle: string;
  title: string | null;
  status: TrainingReviewStatus;
  writtenAt: string;
  updatedAt: string;
};

// 독후감 목록은 0부터 시작하는 페이지, 최근순
export type TrainingReviewListResponse = {
  items: TrainingReviewItemResponse[];
  page: number;
  hasNext: boolean;
  totalCount: number;
};

export type TrainingMessageRole = "AI" | "USER";

export type TrainingSendMessageType = "TEXT" | "IMAGE" | "FILE";

// 관점 카드와 요약 카드는 content 대신 전용 필드가 채워짐
export type TrainingMessageType = TrainingSendMessageType | "OTHER_PERSPECTIVE" | "GROWTH_SUMMARY";

export type StartTrainingResponse = {
  trainingRoomId: number;
  // 진단 직후 AI가 만든 첫 질문, 이미 이력에 저장된 상태
  firstQuestion: string;
};

export type OtherPerspectiveResponse = {
  bookReviewId: number;
  nickname: string;
  content: string;
};

export type TrainingSummationResponse = {
  trainingRoomId: number;
  bookTitle: string;
  introMessage: string;
  subject: string;
  upgradePoint: string;
  firstThink: string;
  finalThink: string;
  closingMessage: string;
};

export type TrainingMessageItemResponse = {
  role: TrainingMessageRole;
  type: TrainingMessageType;
  content: string | null;
  otherPerspective: OtherPerspectiveResponse | null;
  growthSummary: TrainingSummationResponse | null;
  createdAt: string;
};

// 메시지 목록은 최신순
export type TrainingMessageListResponse = {
  reviewId: number;
  reviewTitle: string;
  items: TrainingMessageItemResponse[];
  nextCursor: number | null;
  hasNext: boolean;
};

export type SendTrainingMessageRequest = {
  trainingRoomId: number;
  content: string;
  signal?: AbortSignal;
};

export type SendTrainingMessageResponse = {
  trainingChatId: number;
  role: TrainingMessageRole;
  messageType: TrainingMessageType;
  content: string;
  createdAt: string;
  // true면 대화가 끝나 summation이 함께 내려옴
  end: boolean;
  summation: TrainingSummationResponse | null;
  // true면 다른 관점 선택 버튼을 띄우고 전송을 막아야 함
  perspectiveAvailable: boolean;
};

export type TrainingReviewStatus = "DRAFT" | "PUBLISHED";

export type TrainingReviewItemResponse = {
  reviewId: number;
  bookId: number;
  bookTitle: string;
  coverImageUrl: string | null;
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

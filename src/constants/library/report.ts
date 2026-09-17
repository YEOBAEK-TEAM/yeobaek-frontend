import type { UnlockedBookSortOrder } from "@/types/library/report";

// 서재 페이지를 독후감 탭으로 여는 이동 상태
export const LIBRARY_REPORT_TAB_STATE = { tab: "독후감" };

// 라우트 준비 전 이동 경로
export const REPORT_PATH = {
  write: (bookId: number) => `/library/reports/new?bookId=${bookId}`,
  edit: (reportId: number) => `/library/reports/${reportId}`,
};

export const DRAFT_REPORT = {
  continueLabel: "독후감 마저 쓰기",
  completedPrefix: "완독",
  reportCompletedLabel: "독후감 작성완료",
  newReportLabel: "새로운 독후감 작성",
  emptyText: "완독한 책으로\n독후감을 써보세요",
  writeLabel: "독후감 쓰기",
};

export const MY_REPORT_SECTION = {
  title: "내가 쓴 독후감",
  writeLabel: "독후감 쓰기",
  emptyText: "아직 작성한 독후감이 없어요",
};

export const getReportLikeLabel = (bookTitle: string) => `${bookTitle} 독후감 좋아요`;

export const REPORT_LIKE_ERROR_TEXT = "좋아요를 반영하지 못했어요";

export const DRAFT_EXISTS_MESSAGE =
  "아직 작성중인 독후감이 있습니다.\n해당 독후감을 저장하셔야 다음 독후감을\n작성하실수있습니다";

export const UNLOCKED_BOOK_SHEET = {
  title: "해금 목록",
  emptyText: "완독한 책이 생기면\n독후감을 쓸 수 있어요",
};

export const UNLOCKED_SORT_LABEL: Record<UnlockedBookSortOrder, string> = {
  latest: "최신순",
  oldest: "오래된순",
};

export const getWriteConfirmMessage = (bookTitle: string) =>
  `${bookTitle}에 대한 독후감을 작성하시겠습니까?`;

export const REPORT_EDITOR = {
  titleSuffix: "에 대해서",
  titleLabel: "제목",
  titlePlaceholder: "부제목 쓰는 칸",
  dateLabel: "날짜",
  contentLabel: "독후감 내용",
  contentPlaceholder: "이 책을 읽고 느낀 점을 자유롭게 적어주세요",
  tempSaveLabel: "임시저장",
  submitLabel: "제출하기",
  savedToast: "임시저장되었어요",
  exitMessage: "임시저장하고 나가시겠습니까?",
  loadErrorText: "독후감을 불러오지 못했어요",
};

export const REPORT_TITLE_MAX_LENGTH = 40;

export const REPORT_SAVE_ERROR_MESSAGE: Record<string, string> = {
  DRAFT_EXISTS: "작성중인 독후감이 있어 임시저장할 수 없어요",
};

export const REPORT_SAVE_ERROR_FALLBACK = "저장하지 못했어요. 다시 시도해 주세요";

export const MODAL_ANSWER = {
  yes: "예",
  no: "아니오",
};

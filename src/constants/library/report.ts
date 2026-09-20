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
  newReportLabel: "새 독후감을 작성해보세요",
  emptyText: "완독한 책으로\n독후감을 써보세요",
  writeLabel: "독후감 쓰기",
};

export const REPORT_UNTITLED = "제목 없음";

// 책 선택 시트를 여는 주소 파라미터
export const REPORT_WRITE_PARAM = "write";

export const REPORT_WRITE_PATH = `/library?${REPORT_WRITE_PARAM}=1`;

export type ReportStatusTab = "DRAFT" | "PUBLISHED";

export const REPORT_STATUS_TABS: {
  id: ReportStatusTab;
  label: string;
  datePrefix: string;
  emptyText: string;
}[] = [
  {
    id: "DRAFT",
    label: "작성중",
    datePrefix: "마지막 수정 :",
    emptyText: "작성 중인 독후감이 없어요",
  },
  {
    id: "PUBLISHED",
    label: "작성 완료",
    datePrefix: "완료 :",
    emptyText: "작성한 독후감이 없어요",
  },
];

export type ReportSortOrder = "latest" | "oldest";

export const REPORT_SORT_OPTIONS: { id: ReportSortOrder; label: string }[] = [
  { id: "latest", label: "최신순" },
  { id: "oldest", label: "오래된순" },
];

export const REPORT_SORT_MENU_LABEL = "정렬 기준";

export const getReportLikeLabel = (bookTitle: string) => `${bookTitle} 독후감 좋아요`;

export const REPORT_LIKE_ERROR_TEXT = "좋아요를 반영하지 못했어요";

export type ReportBookListMode = "unlocked" | "pending";

export const REPORT_BOOK_SHEET = {
  title: "독후감 쓸 책 선택",
  modeMenuLabel: "목록 선택",
};

export const REPORT_BOOK_LIST_MODES: {
  id: ReportBookListMode;
  label: string;
  emptyText: string;
}[] = [
  {
    id: "unlocked",
    label: "해금완료",
    emptyText: "완독한 책의 문제를 풀면\n독후감을 쓸 수 있어요",
  },
  { id: "pending", label: "해금예정", emptyText: "해금을 기다리는 책이 없어요" },
];

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
  submittedToast: "독후감 작성 완료",
  exitMessage: "임시저장하고 나가시겠습니까?",
  loadErrorText: "독후감을 불러오지 못했어요",
  publicAriaLabel: "공개 상태, 눌러서 나만 보기로 바꾸기",
  privateAriaLabel: "나만 보기 상태, 눌러서 공개로 바꾸기",
  publicToast: "공개로 바꿨어요\n다른 관점 보기에 요약이 보여요",
  privateToast: "나만 보기로 바꿨어요\n다른 분들에게 보이지 않아요",
  bookNotFoundText: "독후감을 쓸 수 있는 책을 찾지 못했어요",
};

export const REPORT_TITLE_MAX_LENGTH = 40;

export const REPORT_SAVE_ERROR_FALLBACK = "저장하지 못했어요. 다시 시도해 주세요";

export const MODAL_ANSWER = {
  yes: "예",
  no: "아니오",
};

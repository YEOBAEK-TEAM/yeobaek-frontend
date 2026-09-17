import { getRememberedUnlocks } from "@/api/library/mockUnlockMemory";
import { books } from "@/mocks/books";
import {
  mockDraftReport,
  mockMyReports,
  mockReportBodies,
  mockReportLikeFails,
  mockUnlockedBooks,
} from "@/mocks/library/report";

import type {
  DraftReportResponse,
  MyReportResponse,
  ReportEditorResponse,
  SaveReportRequest,
  SaveReportResponse,
  UnlockedBookResponse,
} from "@/types/library/report";

const MOCK_DELAY_MS = 300;

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

// 좋아요 결과를 재조회에 반영하기 위한 목 메모리
const likeMemory = new Map<number, boolean>();

type SavedReport = SaveReportRequest & {
  reportId: number;
  status: "draft" | "submitted";
};

// 임시저장·제출 결과를 재조회에 반영하기 위한 목 메모리, undefined면 목 기본 초안 사용
const savedReports = new Map<number, SavedReport>();
let draftReportId: number | null | undefined;
let reportSequence = 100;

const findBookById = (bookId: number) => books.find((book) => book.id === bookId);

const getCurrentDraftId = () =>
  draftReportId === undefined ? (mockDraftReport?.reportId ?? null) : draftReportId;

const toLocalDate = (date = new Date()) => date.toLocaleDateString("sv-SE");

// 작성 중인 독후감 조회, 없으면 null
export const getDraftReport = async (): Promise<DraftReportResponse | null> => {
  if (draftReportId === undefined) return mockDraftReport;

  const saved = draftReportId === null ? undefined : savedReports.get(draftReportId);
  if (!saved) return null;

  const book = findBookById(saved.bookId);
  const unlocked = mockUnlockedBooks.find((item) => item.bookId === saved.bookId);

  return {
    reportId: saved.reportId,
    bookId: saved.bookId,
    bookTitle: book?.title ?? "",
    bookSubtitle: `${book?.author ?? ""} 장편소설`,
    coverUrl: book?.coverUrl ?? "",
    completedAt: unlocked?.unlockedAt ?? saved.reportDate,
  };
};

// 내가 쓴 독후감 조회
export const getMyReports = async (): Promise<MyReportResponse[]> => {
  const baseIds = new Set(mockMyReports.map((report) => report.reportId));

  const submitted = [...savedReports.values()]
    .filter((report) => report.status === "submitted" && !baseIds.has(report.reportId))
    .map((report): MyReportResponse => {
      const book = findBookById(report.bookId);

      return {
        reportId: report.reportId,
        bookId: report.bookId,
        bookTitle: book?.title ?? "",
        coverUrl: book?.coverUrl ?? "",
        reportTitle: report.title,
        createdAt: report.reportDate,
        isLiked: false,
        bookSubtitle: `${book?.author ?? ""} 장편소설`,
        completedAt: report.reportDate,
      };
    });

  return [...mockMyReports, ...submitted].map((report) => {
    const saved = savedReports.get(report.reportId);

    return {
      ...report,
      reportTitle: saved?.title ?? report.reportTitle,
      createdAt: saved?.reportDate ?? report.createdAt,
      isLiked: likeMemory.get(report.reportId) ?? report.isLiked,
    };
  });
};

// 독후감을 쓸 수 있는 완독 도서 조회
export const getUnlockedBooks = async (): Promise<UnlockedBookResponse[]> => {
  const listedIds = new Set(mockUnlockedBooks.map((book) => book.bookId));

  // 퀴즈로 새로 해금한 책을 목록에 합침
  const unlockedByQuiz = getRememberedUnlocks()
    .filter(([bookId]) => !listedIds.has(bookId))
    .map(([bookId, unlockedAt]): UnlockedBookResponse => {
      const book = findBookById(bookId);

      return {
        bookId,
        bookTitle: book?.title ?? "",
        author: book?.author ?? "",
        coverUrl: book?.coverUrl ?? "",
        unlockedAt,
      };
    });

  return [...unlockedByQuiz, ...mockUnlockedBooks];
};

// 독후감 작성 화면 조회, reportId가 있으면 저장된 내용으로 채움
export const getReportEditor = async ({
  reportId,
  bookId,
}: {
  reportId: number | null;
  bookId: number | null;
}): Promise<ReportEditorResponse> => {
  await wait(MOCK_DELAY_MS);

  if (reportId !== null) {
    const saved = savedReports.get(reportId);

    if (saved) {
      return { ...saved, bookTitle: findBookById(saved.bookId)?.title ?? "" };
    }

    const report = mockMyReports.find((item) => item.reportId === reportId);
    const draft = mockDraftReport?.reportId === reportId ? mockDraftReport : null;
    const source = report ?? draft;
    const body = mockReportBodies[reportId];

    if (!source || !body) throw new Error("REPORT_NOT_FOUND");

    return {
      reportId,
      bookId: source.bookId,
      bookTitle: source.bookTitle,
      title: body.title ?? report?.reportTitle ?? "",
      reportDate: body.reportDate ?? report?.createdAt ?? toLocalDate(),
      content: body.content,
    };
  }

  const book = bookId === null ? undefined : findBookById(bookId);
  if (!book) throw new Error("BOOK_NOT_FOUND");

  return {
    reportId: null,
    bookId: book.id,
    bookTitle: book.title,
    title: "",
    reportDate: toLocalDate(),
    content: "",
  };
};

// 독후감 임시저장, 작성 중인 독후감은 하나만 허용
export const saveReportDraft = async (request: SaveReportRequest): Promise<SaveReportResponse> => {
  await wait(MOCK_DELAY_MS);

  const reportId = request.reportId ?? (reportSequence += 1);

  const isSubmitted =
    savedReports.get(reportId)?.status === "submitted" ||
    (!savedReports.has(reportId) && mockMyReports.some((report) => report.reportId === reportId));

  // 이미 제출한 독후감은 내용만 갱신, 작성 중 독후감 개수 제한과 무관
  if (isSubmitted) {
    savedReports.set(reportId, { ...request, reportId, status: "submitted" });
    return { reportId };
  }

  const currentDraftId = getCurrentDraftId();
  if (currentDraftId !== null && currentDraftId !== reportId) throw new Error("DRAFT_EXISTS");

  savedReports.set(reportId, { ...request, reportId, status: "draft" });
  draftReportId = reportId;

  return { reportId };
};

// 독후감 제출
export const submitReport = async (request: SaveReportRequest): Promise<SaveReportResponse> => {
  await wait(MOCK_DELAY_MS);

  const reportId = request.reportId ?? (reportSequence += 1);

  savedReports.set(reportId, { ...request, reportId, status: "submitted" });
  if (getCurrentDraftId() === reportId) draftReportId = null;

  return { reportId };
};

// 독후감 좋아요 상태 변경
export const updateReportLike = async ({
  reportId,
  isLiked,
}: {
  reportId: number;
  isLiked: boolean;
}): Promise<void> => {
  await wait(MOCK_DELAY_MS);

  if (mockReportLikeFails) throw new Error("REPORT_LIKE_FAILED");

  likeMemory.set(reportId, isLiked);
};

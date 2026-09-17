import { books } from "@/mocks/books";

import type {
  DraftReportResponse,
  MyReportResponse,
  UnlockedBookResponse,
} from "@/types/library/report";

const findBook = (title: string) => books.find((book) => book.title === title);

const toMyReport = (
  reportId: number,
  title: string,
  reportTitle: string,
  createdAt: string,
  completedAt: string,
  isLiked: boolean,
): MyReportResponse => {
  const book = findBook(title);

  return {
    reportId,
    bookId: book?.id ?? 0,
    bookTitle: title,
    coverUrl: book?.coverUrl ?? "",
    reportTitle,
    createdAt,
    isLiked,
    bookSubtitle: `${book?.author ?? ""} 장편소설`,
    completedAt,
  };
};

const toUnlockedBook = (title: string, completedAt: string): UnlockedBookResponse => {
  const book = findBook(title);

  return {
    bookId: book?.id ?? 0,
    bookTitle: title,
    author: book?.author ?? "",
    coverUrl: book?.coverUrl ?? "",
    completedAt,
  };
};

const aquarium = findBook("수족관");

// 상태별 확인용 목데이터
export const mockDraftReportStates = {
  writing: {
    reportId: 30,
    bookId: aquarium?.id ?? 0,
    bookTitle: "수족관",
    bookSubtitle: `${aquarium?.author ?? ""} 장편소설`,
    coverUrl: aquarium?.coverUrl ?? "",
    completedAt: "2026-09-01",
  },
  none: null,
} satisfies Record<string, DraftReportResponse | null>;

export const mockMyReportStates = {
  filled: [
    toMyReport(21, "궤도", "계속 생각나는 이야기", "2026-09-15", "2026-09-01", true),
    toMyReport(
      22,
      "참을 수 없는 존재의 가벼움",
      "가벼움 뒤의 무게",
      "2026-09-12",
      "2026-08-28",
      true,
    ),
    toMyReport(23, "모순", "나를 더 이해하게 된 시간", "2026-09-10", "2026-08-25", true),
    toMyReport(
      24,
      "우리가 빛의 속도로 갈 수 없다면",
      "닿지 못해도 향하는 마음",
      "2026-09-14",
      "2026-08-30",
      false,
    ),
    toMyReport(25, "급류", "휩쓸린 뒤에 남는 것들", "2026-09-05", "2026-08-20", false),
  ],
  none: [],
} satisfies Record<string, MyReportResponse[]>;

export const mockUnlockedBookStates = {
  filled: [
    toUnlockedBook("어린 왕자", "2026-09-06"),
    toUnlockedBook("투명한 나선", "2026-09-04"),
    toUnlockedBook("양면의 조개껍데기", "2026-09-02"),
    toUnlockedBook("궤도", "2026-09-01"),
    toUnlockedBook("우리가 빛의 속도로 갈 수 없다면", "2026-08-30"),
    toUnlockedBook("참을 수 없는 존재의 가벼움", "2026-08-28"),
    toUnlockedBook("모순", "2026-08-25"),
    toUnlockedBook("급류", "2026-08-20"),
  ],
  none: [],
} satisfies Record<string, UnlockedBookResponse[]>;

// 목록을 바꾸면 각 상태를 바로 확인 가능
export const mockDraftReport: DraftReportResponse | null = mockDraftReportStates.writing;

export const mockMyReports: MyReportResponse[] = mockMyReportStates.filled;

export const mockUnlockedBooks: UnlockedBookResponse[] = mockUnlockedBookStates.filled;

// 독후감 본문, 제목이 없으면 내가 쓴 독후감의 한줄 제목 사용
export const mockReportBodies: Record<
  number,
  { title?: string; reportDate?: string; content: string }
> = {
  30: {
    title: "유리 너머의 마음",
    reportDate: "2026-09-15",
    content: "수족관을 읽으며 투명한 벽 너머에서 서로를 바라보는 인물들이 계속 떠올랐다.",
  },
  21: { content: "궤도를 도는 인물들의 이야기가 책을 덮은 뒤에도 오래 머물렀다." },
  22: { content: "가벼움을 택한 선택들이 결국 가장 무겁게 남는다는 점이 인상 깊었다." },
  23: { content: "모순된 감정을 인정하는 과정에서 나 자신을 조금 더 이해하게 되었다." },
  24: { content: "닿을 수 없는 거리에도 계속 마음을 보내는 이야기들이 따뜻했다." },
  25: { content: "거센 물살 같은 시간을 지나 남은 관계에 대해 생각해 보았다." },
};

// 좋아요 실패 확인용, true면 요청이 항상 실패
export const mockReportLikeFails: boolean = false;

import type {
  TrainingMessageItemResponse,
  TrainingMessageListResponse,
  TrainingReviewItemResponse,
  TrainingSummationResponse,
} from "@/types/training/bookReportTraining";
import type { BookReportMessage, ThoughtComparison } from "@/types/training/bookReportChat";
import type { LearningSummary, ReadingReport } from "@/types/training/readingReport";

export const toReadingReport = (review: TrainingReviewItemResponse): ReadingReport => ({
  reportId: review.reviewId,
  bookId: review.bookId,
  bookTitle: review.bookTitle,
  coverUrl: review.coverImageUrl ?? "",
  reportTitle: review.title ?? "",
  createdAt: review.writtenAt,
});

export const toThoughtComparison = (summation: TrainingSummationResponse): ThoughtComparison => ({
  before: summation.firstThink,
  after: summation.finalThink,
});

const toChatMessage = (item: TrainingMessageItemResponse, id: string): BookReportMessage => {
  if (item.type === "OTHER_PERSPECTIVE" && item.otherPerspectives?.length) {
    return { id, role: "riti", kind: "perspectiveCard", perspectives: item.otherPerspectives };
  }

  if (item.type === "GROWTH_SUMMARY" && item.growthSummary) {
    return {
      id,
      role: "riti",
      kind: "thoughtSummary",
      thought: toThoughtComparison(item.growthSummary),
    };
  }

  return {
    id,
    role: item.role === "AI" ? "riti" : "user",
    kind: "text",
    text: item.content ?? "",
    sentAt: item.createdAt,
  };
};

// 최신순 페이지를 오래된 메시지부터 화면 메시지로 변환
export const toTrainingChatMessages = (
  pages: TrainingMessageListResponse[],
): BookReportMessage[] => {
  const items = pages.flatMap((page) => page.items).reverse();
  const counts = new Map<string, number>();

  return items.map((item) => {
    // 응답에 메시지 id가 없어 시각·발신자 기준 key 생성
    const baseId = `${item.role}-${item.type}-${item.createdAt}`;
    const count = counts.get(baseId) ?? 0;
    counts.set(baseId, count + 1);

    return toChatMessage(item, `training-${baseId}-${count}`);
  });
};

export const toLearningSummary = (summation: TrainingSummationResponse): LearningSummary => ({
  bookTitle: summation.bookTitle,
  topic: summation.subject,
  growthPoint: summation.upgradePoint,
});

import type {
  TrainingMessageItemResponse,
  TrainingMessageListResponse,
  TrainingReviewItemResponse,
  TrainingSummationResponse,
} from "@/types/training/bookReportTraining";
import type { ThoughtComparison } from "@/types/training/bookReportChat";
import type { ChatTextMessage } from "@/types/training/chat";
import type { LearningSummary, ReadingReport } from "@/types/training/readingReport";

// 표지는 아직 응답에 없어 빈 값
export const toReadingReport = (review: TrainingReviewItemResponse): ReadingReport => ({
  reportId: review.reviewId,
  bookId: review.bookId,
  bookTitle: review.bookTitle,
  coverUrl: "",
  reportTitle: review.title ?? "",
  createdAt: review.writtenAt,
});

// 최신순 페이지를 오래된 메시지부터 화면 메시지로 변환
export const toTrainingChatMessages = (pages: TrainingMessageListResponse[]): ChatTextMessage[] => {
  const items = pages.flatMap((page) => page.items).reverse();
  const counts = new Map<string, number>();

  return items.map((item: TrainingMessageItemResponse) => {
    // 응답에 메시지 id가 없어 시각·발신자 기준 key 생성
    const baseId = `${item.role}-${item.createdAt}`;
    const count = counts.get(baseId) ?? 0;
    counts.set(baseId, count + 1);

    return {
      id: `training-${baseId}-${count}`,
      role: item.role === "AI" ? "riti" : "user",
      kind: "text",
      text: item.content,
      sentAt: item.createdAt,
    };
  });
};

export const toThoughtComparison = (summation: TrainingSummationResponse): ThoughtComparison => ({
  before: summation.firstThink,
  after: summation.finalThink,
});

export const toLearningSummary = (summation: TrainingSummationResponse): LearningSummary => ({
  bookTitle: summation.bookTitle,
  topic: summation.subject,
  growthPoint: summation.upgradePoint,
});

import type { TrainingRoomListItemResponse } from "@/types/training/bookReportTraining";
import type { UnderstandRoomListItemResponse } from "@/types/training/comprehension";
import type { OngoingTraining } from "@/types/training/ongoingTraining";

const toStatus = (status: string) => (status === "COMPLETED" ? "completed" : "in-progress");

export const toBookReportTraining = (
  item: TrainingRoomListItemResponse | undefined,
): OngoingTraining | null =>
  item
    ? {
        roomId: item.trainingRoomId,
        targetKey: String(item.reviewId),
        status: toStatus(item.status),
        programId: "book-report",
        bookTitle: item.bookTitle,
      }
    : null;

export const toComprehensionTraining = (
  item: UnderstandRoomListItemResponse | undefined,
): OngoingTraining | null =>
  item
    ? {
        roomId: item.understandRoomId,
        targetKey: `${item.bookId}-${item.startPageNumber}-${item.endPageNumber}`,
        status: toStatus(item.status),
        programId: "comprehension",
        bookTitle: item.bookTitle,
      }
    : null;

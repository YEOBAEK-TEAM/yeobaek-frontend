import { formatReportDate } from "@/utils/training/formatReportDate";

import type { PendingUnlockBookResponse, PendingUnlockBookView } from "@/types/library/unlockQuiz";

// 최근에 완독한 책부터
export const toPendingUnlockBookViews = (
  responses: PendingUnlockBookResponse[],
): PendingUnlockBookView[] =>
  responses
    .map((response) => ({
      bookId: response.bookId,
      title: response.bookTitle,
      author: response.author,
      coverUrl: response.coverUrl,
      completedAt: response.completedAt,
      completedLabel: formatReportDate(response.completedAt),
    }))
    .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt));

import { createMessageId } from "@/utils/training/createChatMessage";

import type { BookReportMessage, ThoughtComparison } from "@/types/training/bookReportChat";
import type { ReadingReport } from "@/types/training/readingReport";

export const ritiReportCard = (report: ReadingReport): BookReportMessage => ({
  id: createMessageId(),
  role: "riti",
  kind: "reportCard",
  report,
});

export const ritiThoughtSummary = (thought: ThoughtComparison): BookReportMessage => ({
  id: createMessageId(),
  role: "riti",
  kind: "thoughtSummary",
  thought,
});

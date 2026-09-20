import { createMessageId } from "@/utils/training/createChatMessage";

import type { BookReportMessage, ThoughtComparison } from "@/types/training/bookReportChat";

export const ritiThoughtSummary = (thought: ThoughtComparison): BookReportMessage => ({
  id: createMessageId(),
  role: "riti",
  kind: "thoughtSummary",
  thought,
});

import ChatBubble from "@/components/training/chat/ChatBubble";
import { SUMMARY_CLOSING_TEXT } from "@/constants/training/bookReportChat";

import type { ThoughtComparison } from "@/types/training/bookReportChat";

type ThoughtCompareBubbleProps = {
  nickname: string;
  thought: ThoughtComparison;
};

// 생각 비교 라벨 칩
const LABEL_CHIP_CLASS =
  "mt-3 inline-block rounded-lg bg-[#5E6347] px-3 py-1 text-[12px] font-bold text-white";

export default function ThoughtCompareBubble({ nickname, thought }: ThoughtCompareBubbleProps) {
  return (
    <ChatBubble variant="riti">
      <p>{`오늘 대화를 통해\n${nickname}님의 생각이 더 깊어졌어요!`}</p>

      <p className={LABEL_CHIP_CLASS}>처음 생각</p>
      <p className="mt-2">{thought.before}</p>

      <p className={LABEL_CHIP_CLASS}>대화 후 생각</p>
      <p className="mt-2">{thought.after}</p>

      <p className="mt-3">{SUMMARY_CLOSING_TEXT}</p>
    </ChatBubble>
  );
}

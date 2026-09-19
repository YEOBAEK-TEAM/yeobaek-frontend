import type { OtherPerspectiveResponse } from "@/types/training/bookReportTraining";

type PerspectiveCardProps = {
  perspectives: OtherPerspectiveResponse[];
};

// 같은 책을 읽은 다른 독자의 관점 묶음, 상세 조회는 제공되지 않아 표시 전용
export default function PerspectiveCard({ perspectives }: PerspectiveCardProps) {
  if (perspectives.length === 0) return null;

  return (
    <ul className="flex w-full flex-col gap-2.5 rounded-2xl bg-[#DEE2D0] p-3">
      {perspectives.map((perspective) => (
        <li
          key={perspective.bookReviewId}
          className="rounded-xl bg-[#F7F8F4] px-4 py-3.5 text-left"
        >
          <p className="text-[15px] font-bold text-[#2C2A2B]">{perspective.nickname}</p>

          <p className="mt-1.5 text-[13px] leading-[19px] break-keep text-[#54555A]">
            “{perspective.content}”
          </p>
        </li>
      ))}
    </ul>
  );
}

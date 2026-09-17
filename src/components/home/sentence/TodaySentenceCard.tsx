import { TODAY_SENTENCE_TITLE } from "@/constants/home/home";

import type { TodaySentence } from "@/types/home/home";

const LINE_HEIGHT_PX = 34;

// 노트 가로 줄선
const RULED_BACKGROUND = `repeating-linear-gradient(to bottom, transparent 0, transparent ${
  LINE_HEIGHT_PX - 1
}px, #DADBD4 ${LINE_HEIGHT_PX - 1}px, #DADBD4 ${LINE_HEIGHT_PX}px)`;

const HOLES = [0, 1, 2, 3];

export default function TodaySentenceCard({ sentence }: { sentence: TodaySentence }) {
  return (
    <section className="relative mx-5 overflow-hidden bg-white py-4 shadow-[0_6px_16px_rgba(0,0,0,0.10)]">
      {/* 노트 펀칭 구멍 */}
      <span aria-hidden="true" className="absolute inset-y-4 left-4 flex flex-col justify-between">
        {HOLES.map((hole) => (
          <span
            key={hole}
            className="h-4.5 w-4.5 rounded-full bg-[#FFFEFB] shadow-[inset_0_1px_3px_rgba(0,0,0,0.22)]"
          />
        ))}
      </span>

      {/* 노트 세로 여백선 */}
      <span aria-hidden="true" className="absolute inset-y-0 left-11 w-px bg-[#BB7E7E]" />
      <span aria-hidden="true" className="absolute inset-y-0 left-12 w-px bg-[#BB7E7E]" />

      <div
        className="pr-4 pl-14"
        style={{
          backgroundImage: RULED_BACKGROUND,
          lineHeight: `${LINE_HEIGHT_PX}px`,
          fontFamily: "NanumMyeongjo, serif",
        }}
      >
        <div className="flex items-baseline gap-3">
          <h2 className="text-[17px] font-extrabold text-[#2C2A2B]">{TODAY_SENTENCE_TITLE}</h2>

          <span className="truncate text-[12px] text-[#8F8F8F]">
            {sentence.author} {sentence.genre}, {sentence.bookTitle} 中
          </span>
        </div>

        <p className="text-[14px] whitespace-pre-line text-[#2C2A2B]">{sentence.content}</p>
      </div>
    </section>
  );
}

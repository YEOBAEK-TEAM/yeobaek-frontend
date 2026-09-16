import { useState } from "react";

type Props = { initialMemo: string; onSave: (memo: string) => void };
export default function MemoSection({ initialMemo, onSave }: Props) {
  const [memo, setMemo] = useState(initialMemo);
  return (
    <section className="bg-[#FBFAF5] px-[15px] pt-4 pb-10">
      <h2 className="mb-2 ml-2 text-xl font-bold text-[#30201D]">
        <label htmlFor="sentence-memo">내 메모</label>
      </h2>
      <div className="relative">
        <textarea
          id="sentence-memo"
          maxLength={200}
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          placeholder="이 문장에 대한 생각을 적어보세요"
          aria-describedby="memo-count"
          className="block h-[271px] w-full resize-none rounded-xl border border-[#DDD9D4] bg-[#F7F6F1] px-6 pt-7 pb-12 text-[15px] leading-6 placeholder:text-[#808080] focus:outline-2 focus:outline-[#898F72]"
        />
        <span
          id="memo-count"
          className="pointer-events-none absolute right-5 bottom-4 text-[15px] font-bold text-[#808080]"
        >
          {memo.length}/200
        </span>
      </div>
      <button
        type="button"
        disabled={memo.length === 0}
        onClick={() => onSave(memo)}
        className="mt-6 ml-[7px] h-16 w-[calc(100%-7px)] rounded-lg bg-[#4B512F] text-base font-bold text-white disabled:bg-[#858584]"
      >
        저장하기
      </button>
    </section>
  );
}

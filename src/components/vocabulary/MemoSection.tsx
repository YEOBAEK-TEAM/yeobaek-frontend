import { useRef, useState } from "react";

type Props = {
  initialMemo: string;
  onSave: (memo: string) => Promise<string | null>;
  isSaving: boolean;
};
export default function MemoSection({ initialMemo, onSave, isSaving }: Props) {
  const [memo, setMemo] = useState(initialMemo);
  const saving = useRef(false);
  const handleSave = async () => {
    if (saving.current || isSaving) return;
    saving.current = true;
    try {
      const savedMemo = await onSave(memo);
      if (savedMemo !== null) {
        // Preserve edits made while the request was in flight.
        setMemo((current) => (current === memo ? savedMemo : current));
      }
    } finally {
      saving.current = false;
    }
  };
  return (
    <section className="bg-[#FBFAF5] px-4 pt-4 pb-10">
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
          className="block h-60 w-full resize-none rounded-xl border border-[#DDD9D4] bg-[#F7F6F1] px-6 pt-7 pb-12 text-[15px] leading-6 placeholder:text-[#808080] focus:outline-2 focus:outline-[#B7BD9E]"
        />
        <span
          id="memo-count"
          className="pointer-events-none absolute right-5 bottom-4 text-[15px] font-bold text-[#808080]"
        >
          {memo.length}/200
        </span>
      </div>
      <div className="mt-6 ml-1">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => void handleSave()}
          className="h-16 w-full rounded-lg bg-[#B7BD9E] text-base font-bold text-white disabled:bg-[#858584]"
        >
          저장하기
        </button>
      </div>
    </section>
  );
}

type ChatActionButtonsProps = {
  onApply: () => void;
  onContinue: () => void;
  onSaveAndStop: () => void;
};

export default function ChatActionButtons({
  onApply,
  onContinue,
  onSaveAndStop,
}: ChatActionButtonsProps) {
  return (
    <div className="shrink-0 space-y-3 px-5 pt-2 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
      <button
        type="button"
        onClick={onApply}
        className="h-13 w-full rounded-xl bg-[#B7BD9E] text-[15px] font-bold text-white"
      >
        독후감에 반영하기
      </button>

      <button
        type="button"
        onClick={onContinue}
        className="h-13 w-full rounded-xl bg-[#4F4D4E] text-[15px] font-bold text-white"
      >
        다른 주제로 이어가기
      </button>

      <button
        type="button"
        onClick={onSaveAndStop}
        className="h-13 w-full rounded-xl border border-[#C4BFB6] bg-white text-[15px] font-bold text-[#54555A]"
      >
        대화 내용 저장하고 중단하기
      </button>
    </div>
  );
}

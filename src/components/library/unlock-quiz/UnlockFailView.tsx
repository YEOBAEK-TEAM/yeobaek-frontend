import CompletionLayout from "@/components/common/completion/CompletionLayout";
import { UNLOCK_FAIL, UNLOCK_FAIL_CHARACTER } from "@/constants/library/unlockQuiz";

type UnlockFailViewProps = {
  onLater: () => void;
  onRetry: () => void;
};

export default function UnlockFailView({ onLater, onRetry }: UnlockFailViewProps) {
  return (
    <CompletionLayout
      character={UNLOCK_FAIL_CHARACTER}
      title={UNLOCK_FAIL.title}
      characterClassName="h-45"
      topClassName="pt-[25dvh]"
      footer={
        <div className="grid grid-cols-2 gap-4 pb-8">
          <button
            type="button"
            onClick={onLater}
            className="h-16 rounded-xl border-[1.5px] border-[#8E8A7E] bg-white text-[17px] font-bold text-[#6B6340]"
          >
            {UNLOCK_FAIL.laterLabel}
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="h-16 rounded-xl bg-[#B8BC9F] text-[17px] font-bold text-white"
          >
            {UNLOCK_FAIL.retryLabel}
          </button>
        </div>
      }
    />
  );
}

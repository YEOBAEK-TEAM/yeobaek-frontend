import { LoaderCircle } from "lucide-react";
import { useId } from "react";
import { useNavigate } from "react-router-dom";

import ModalShell from "@/components/common/modal/ModalShell";
import GuideRuleItem from "@/components/library/unlock-quiz/GuideRuleItem";
import { UNLOCK_GUIDE, UNLOCK_GUIDE_RULES, UNLOCK_QUIZ_PATH } from "@/constants/library/unlockQuiz";
import { useStartUnlockQuiz } from "@/hooks/library/unlock-quiz/useUnlockQuizQueries";
import { getApiErrorMessage } from "@/utils/common/getApiErrorMessage";

type UnlockGuideModalProps = {
  bookId: number;
  bookTitle: string;
  onClose: () => void;
};

// 서버 퀴즈는 항상 3문제
const QUESTION_COUNT = 3;

export default function UnlockGuideModal({ bookId, bookTitle, onClose }: UnlockGuideModalProps) {
  const titleId = useId();
  const navigate = useNavigate();

  const startQuiz = useStartUnlockQuiz(bookId);

  const start = () =>
    startQuiz.mutate(undefined, {
      onSuccess: () => navigate(UNLOCK_QUIZ_PATH(bookId), { state: { bookTitle } }),
    });

  return (
    <ModalShell
      labelledBy={titleId}
      onClose={onClose}
      className="max-w-71"
      bodyClassName="px-5 pt-14 pb-8"
    >
      <h2 id={titleId} className="text-center text-[18px] font-bold text-[#1E1E1E]">
        {UNLOCK_GUIDE.title}
      </h2>

      <p className="mt-3 text-center text-[15px] leading-[22px] font-semibold break-keep whitespace-pre-line text-[#6B6B6B]">
        {UNLOCK_GUIDE.getDescription(QUESTION_COUNT)}
      </p>

      <ul className="mt-6 flex flex-col gap-1.5">
        {UNLOCK_GUIDE_RULES.map((rule) => (
          <GuideRuleItem key={rule} text={rule} />
        ))}
      </ul>

      {startQuiz.isError && (
        <p role="alert" className="mt-2 text-center text-[12px] text-[#D91414]">
          {getApiErrorMessage(startQuiz.error, UNLOCK_GUIDE.loadErrorText)}
        </p>
      )}

      <button
        type="button"
        onClick={start}
        disabled={startQuiz.isPending}
        aria-busy={startQuiz.isPending}
        className="mt-3 flex h-13 w-full items-center justify-center rounded-md bg-[#B8BC9F] text-[16px] font-bold text-white disabled:opacity-80"
      >
        {startQuiz.isPending ? (
          <LoaderCircle
            aria-label="문제 불러오는 중"
            className="h-5 w-5 animate-spin motion-reduce:animate-none"
          />
        ) : (
          UNLOCK_GUIDE.startLabel
        )}
      </button>
    </ModalShell>
  );
}

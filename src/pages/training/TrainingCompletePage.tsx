import { useNavigate } from "react-router-dom";

import ReadingFinishCharacter from "@/assets/images/Training/ReadingFinishCharacter.png";
import LearningSummaryTable from "@/components/training/complete/LearningSummaryTable";
import {
  TRAINING_COMPLETE_SUBTITLE,
  TRAINING_COMPLETE_TITLE,
} from "@/constants/training/bookReportChat";
import { useLearningSummary } from "@/hooks/training/useReadingReports";

// 캐릭터 아래 타원 그림자
const ELLIPSE_SHADOW =
  "radial-gradient(ellipse at center, rgba(79,77,78,0.42) 0%, rgba(79,77,78,0.22) 45%, rgba(79,77,78,0) 74%)";

export default function TrainingCompletePage() {
  const navigate = useNavigate();

  const { data: summary } = useLearningSummary();

  return (
    <main className="flex min-h-dvh flex-col">
      <div className="flex-1 pt-24">
        <div className="mx-auto flex w-56 flex-col items-center">
          <div className="relative flex h-56 w-56 items-end justify-center">
            {/* 캐릭터 뒤 원형 글로우 */}
            <span
              aria-hidden="true"
              className="absolute inset-x-5 top-5 bottom-6 rounded-full bg-[#EDEFE3] blur-2xl"
            />

            <img
              src={ReadingFinishCharacter}
              alt=""
              className="relative h-52 w-auto object-contain"
            />
          </div>

          <span
            aria-hidden="true"
            className="-mt-9 h-6 w-40 rounded-[50%]"
            style={{ background: ELLIPSE_SHADOW }}
          />
        </div>

        <h1 className="mt-3 text-center text-[26px] font-bold text-[#4F4D4E]">
          {TRAINING_COMPLETE_TITLE}
        </h1>

        <p className="mt-3 text-center text-[15px] leading-[23px] whitespace-pre-line text-[#4F4D4E]">
          {TRAINING_COMPLETE_SUBTITLE}
        </p>

        {summary && (
          <div className="mt-12">
            <LearningSummaryTable summary={summary} />
          </div>
        )}
      </div>

      <div className="shrink-0 px-5 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        <button
          type="button"
          onClick={() => navigate("/training", { replace: true })}
          className="h-13 w-full rounded-xl bg-[#4F4D4E] text-[15px] font-bold text-white"
        >
          훈련 완료
        </button>
      </div>
    </main>
  );
}

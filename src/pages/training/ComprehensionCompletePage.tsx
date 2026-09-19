import { useNavigate, useSearchParams } from "react-router-dom";

import ComprehensiveFinishCharacter from "@/assets/images/Training/ComprehensiveFinishCharacter.png";
import TrainingCompleteLayout from "@/components/training/shared/complete/TrainingCompleteLayout";
import {
  TRAINING_COMPLETE_TITLE,
  TRAINING_RESTART_LABEL,
} from "@/constants/training/bookReportChat";
import { COMPREHENSION_COMPLETE_SUBTITLE } from "@/constants/training/comprehensionChat";
import { TRAINING_PATH } from "@/constants/training/trainingPrograms";
import { useUnderstandSummation } from "@/hooks/training/useComprehensionQueries";

const toId = (value: string | null) => {
  const id = Number(value);
  return value && Number.isSafeInteger(id) && id > 0 ? id : null;
};

export default function ComprehensionCompletePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: summary } = useUnderstandSummation(toId(searchParams.get("understandRoomId")));

  return (
    <TrainingCompleteLayout
      character={ComprehensiveFinishCharacter}
      title={TRAINING_COMPLETE_TITLE}
      subtitle={COMPREHENSION_COMPLETE_SUBTITLE}
      rows={
        summary
          ? [
              { label: "책", value: summary.bookTitle },
              { label: "범위", value: summary.pageRange },
              { label: "주요 주제", value: summary.topic },
            ]
          : []
      }
      onComplete={() => navigate(TRAINING_PATH.main, { replace: true })}
      restartLabel={TRAINING_RESTART_LABEL}
      // 책갈피 선택부터 다시 시작
      onRestart={() => navigate(TRAINING_PATH.comprehension, { replace: true })}
    />
  );
}

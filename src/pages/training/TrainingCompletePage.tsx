import { useNavigate, useSearchParams } from "react-router-dom";

import ReadingFinishCharacter from "@/assets/images/Training/ReadingFinishCharacter.png";
import TrainingCompleteLayout from "@/components/training/shared/complete/TrainingCompleteLayout";
import {
  TRAINING_COMPLETE_SUBTITLE,
  TRAINING_COMPLETE_TITLE,
  TRAINING_RESTART_LABEL,
} from "@/constants/training/bookReportChat";
import { TRAINING_PATH } from "@/constants/training/trainingPrograms";
import { useTrainingSummation } from "@/hooks/training/useBookReportTrainingQueries";

const toId = (value: string | null) => {
  const id = Number(value);
  return value && Number.isSafeInteger(id) && id > 0 ? id : null;
};

export default function TrainingCompletePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: summary } = useTrainingSummation(toId(searchParams.get("trainingRoomId")));

  return (
    <TrainingCompleteLayout
      character={ReadingFinishCharacter}
      title={TRAINING_COMPLETE_TITLE}
      subtitle={TRAINING_COMPLETE_SUBTITLE}
      rows={
        summary
          ? [
              { label: "책", value: summary.bookTitle },
              { label: "주제", value: summary.topic },
              { label: "발전 포인트", value: summary.growthPoint },
            ]
          : []
      }
      onComplete={() => navigate(TRAINING_PATH.main, { replace: true })}
      restartLabel={TRAINING_RESTART_LABEL}
      // 독후감 선택부터 다시 시작
      onRestart={() => navigate(TRAINING_PATH.bookReportSelect, { replace: true })}
    />
  );
}

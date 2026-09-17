import { useNavigate } from "react-router-dom";

import ReadingFinishCharacter from "@/assets/images/Training/ReadingFinishCharacter.png";
import TrainingCompleteLayout from "@/components/training/shared/complete/TrainingCompleteLayout";
import {
  TRAINING_COMPLETE_SUBTITLE,
  TRAINING_COMPLETE_TITLE,
} from "@/constants/training/bookReportChat";
import { useLearningSummary } from "@/hooks/training/useReadingReports";

export default function TrainingCompletePage() {
  const navigate = useNavigate();

  const { data: summary } = useLearningSummary();

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
      onComplete={() => navigate("/training", { replace: true })}
    />
  );
}

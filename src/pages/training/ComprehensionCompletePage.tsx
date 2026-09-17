import { useNavigate } from "react-router-dom";

import ComprehensiveFinishCharacter from "@/assets/images/Training/ComprehensiveFinishCharacter.png";
import TrainingCompleteLayout from "@/components/training/shared/complete/TrainingCompleteLayout";
import { TRAINING_COMPLETE_TITLE } from "@/constants/training/bookReportChat";
import { COMPREHENSION_COMPLETE_SUBTITLE } from "@/constants/training/comprehensionChat";
import { useComprehensionSummary } from "@/hooks/training/useComprehensionLibrary";

export default function ComprehensionCompletePage() {
  const navigate = useNavigate();

  const { data: summary } = useComprehensionSummary();

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
      onComplete={() => navigate("/training", { replace: true })}
    />
  );
}

import { useNavigate } from "react-router-dom";

import Header from "@/components/common/header/Header";
import { useOngoingTraining } from "@/hooks/training/useOngoingTraining";
import OngoingTrainingCard from "@/components/training/OngoingTrainingCard";
import TrainingGreeting from "@/components/training/TrainingGreeting";
import TrainingProgramCard from "@/components/training/TrainingProgramCard";
import TrainingSegmentTabs from "@/components/training/TrainingSegmentTabs";
import { TRAINING_PROGRAMS } from "@/constants/training/trainingPrograms";
import { useTrainingStore } from "@/stores/training/trainingTab";

export default function TrainingPage() {
  const navigate = useNavigate();

  const activeTab = useTrainingStore((state) => state.activeTab);

  const { data: ongoingTraining } = useOngoingTraining();

  return (
    <main className="flex-1">
      {/* 상단 헤더 */}
      <Header title="훈련" action="bell" className="px-5 pt-8 pb-5" />

      {/* 본문 컬럼 */}
      <div className="mx-auto w-88">
        <TrainingGreeting />

        <div className="mt-6">
          <TrainingSegmentTabs />
        </div>

        {activeTab === "lity" ? (
          <>
            {ongoingTraining && (
              <div className="mt-5">
                <OngoingTrainingCard training={ongoingTraining} />
              </div>
            )}

            <section className="mt-6 pb-6">
              <h2 className="text-base font-bold text-[#4F4D4E]">훈련 더보기</h2>

              <div className="mt-4 flex flex-col gap-4">
                {TRAINING_PROGRAMS.map((program) => (
                  <TrainingProgramCard
                    key={program.id}
                    program={program}
                    onClick={
                      program.id === "book-report"
                        ? () => navigate("/training/book-report")
                        : undefined
                    }
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          <p className="mt-20 text-center text-sm text-[#BBB8A5]">토론장은 준비 중이에요</p>
        )}
      </div>
    </main>
  );
}

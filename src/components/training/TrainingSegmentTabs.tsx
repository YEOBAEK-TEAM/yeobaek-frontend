import { TRAINING_TABS } from "@/constants/training/trainingPrograms";
import { useTrainingStore } from "@/stores/training/trainingTab";

export default function TrainingSegmentTabs() {
  const activeTab = useTrainingStore((state) => state.activeTab);
  const setActiveTab = useTrainingStore((state) => state.setActiveTab);

  // 세그먼트 탭 전환 애니메이션 위치 계산
  const activeIndex = TRAINING_TABS.findIndex((tab) => tab.id === activeTab);

  return (
    <div
      role="tablist"
      aria-label="훈련 방식"
      className="relative flex h-15 w-full rounded-2xl bg-[#F7F6F1]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/2 rounded-2xl bg-[#BEC5A5] transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />

      {TRAINING_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative flex-1 rounded-2xl text-base font-bold transition-colors duration-300 ${
            activeTab === tab.id ? "text-[#4F4D4E]" : "text-[#BBB8A5]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

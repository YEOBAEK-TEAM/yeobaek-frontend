import { useId, type ComponentType, type KeyboardEvent } from "react";

import MyGroupTabContent from "@/components/training/discussion/MyGroupTabContent";
import PendingGroupTabContent from "@/components/training/discussion/PendingGroupTabContent";
import RecommendTabContent from "@/components/training/discussion/RecommendTabContent";
import { DISCUSSION_SUB_TABS } from "@/constants/training/discussion/discussion";
import { useTabIndicator } from "@/hooks/training/discussion/useTabIndicator";
import { useDiscussionTabStore } from "@/stores/training/discussion/discussionTab";

import type { DiscussionSubTab } from "@/types/training/discussion/discussion";

const TAB_CONTENT: Record<DiscussionSubTab, ComponentType> = {
  recommend: RecommendTabContent,
  joined: MyGroupTabContent,
  pending: PendingGroupTabContent,
};

export default function DiscussionSubTabs() {
  const baseId = useId();

  const activeSubTab = useDiscussionTabStore((state) => state.activeSubTab);
  const setActiveSubTab = useDiscussionTabStore((state) => state.setActiveSubTab);

  const { containerRef, indicatorRef } = useTabIndicator(activeSubTab);

  const TabContent = TAB_CONTENT[activeSubTab];

  // 좌우 방향키·Home·End로 탭 이동
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const lastIndex = DISCUSSION_SUB_TABS.length - 1;
    const currentIndex = DISCUSSION_SUB_TABS.findIndex((tab) => tab.id === activeSubTab);

    const nextIndex = {
      ArrowRight: currentIndex === lastIndex ? 0 : currentIndex + 1,
      ArrowLeft: currentIndex === 0 ? lastIndex : currentIndex - 1,
      Home: 0,
      End: lastIndex,
    }[event.key];

    if (nextIndex === undefined) return;

    event.preventDefault();
    setActiveSubTab(DISCUSSION_SUB_TABS[nextIndex].id);
    event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[nextIndex]?.focus();
  };

  return (
    <>
      <div ref={containerRef} className="relative mt-4">
        <div
          role="tablist"
          aria-label="토론 그룹"
          onKeyDown={handleKeyDown}
          className="grid grid-cols-3 px-2"
        >
          {DISCUSSION_SUB_TABS.map((tab) => {
            const isSelected = tab.id === activeSubTab;

            return (
              <button
                key={tab.id}
                id={`${baseId}-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`${baseId}-panel`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveSubTab(tab.id)}
                className="flex h-14 items-center justify-center text-[15px] font-bold text-[#4F4D4E]"
              >
                <span data-tab-label={tab.id} className="px-2">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 bg-white" />

        <span
          ref={indicatorRef}
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-1.5 bg-[#B0B4A8] motion-safe:data-ready:transition-[transform,width] motion-safe:data-ready:duration-300 motion-safe:data-ready:ease-out"
        />
      </div>

      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${activeSubTab}`}>
        <TabContent />
      </div>
    </>
  );
}

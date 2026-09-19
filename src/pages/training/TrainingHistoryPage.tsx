import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BookCover from "@/components/common/bookCover/BookCover";
import Header from "@/components/common/header/Header";
import SectionState from "@/components/common/section/SectionState";
import {
  HISTORY_ENTRY_PARAM,
  HISTORY_ENTRY_VALUE,
  TRAINING_HISTORY_EMPTY_TEXT,
  TRAINING_HISTORY_TABS,
  TRAINING_HISTORY_TITLE,
} from "@/constants/training/trainingHistory";
import { TRAINING_PATH } from "@/constants/training/trainingPrograms";
import { useInfiniteSentinel } from "@/hooks/training/discussion/useInfiniteSentinel";
import { useBookReportHistory, useComprehensionHistory } from "@/hooks/training/useTrainingHistory";

import type { TrainingHistoryItem, TrainingHistoryTab } from "@/types/training/trainingHistory";

export default function TrainingHistoryPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TrainingHistoryTab>("book-report");

  const bookReport = useBookReportHistory(activeTab === "book-report");
  const comprehension = useComprehensionHistory(activeTab === "comprehension");

  const query = activeTab === "book-report" ? bookReport : comprehension;
  const items = query.data ?? [];

  const sentinelRef = useInfiniteSentinel({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isError: query.isError,
    fetchNextPage: query.fetchNextPage,
  });

  // 기록에서 들어가면 대화를 보기만 함
  const openRoom = (item: TrainingHistoryItem) => {
    const path =
      item.programId === "book-report"
        ? `${TRAINING_PATH.bookReportChat}?trainingRoomId=${item.roomId}`
        : `${TRAINING_PATH.comprehensionChat}?understandRoomId=${item.roomId}`;

    navigate(`${path}&${HISTORY_ENTRY_PARAM}=${HISTORY_ENTRY_VALUE}`);
  };

  const activeIndex = TRAINING_HISTORY_TABS.findIndex((tab) => tab.id === activeTab);

  const renderItems = () => {
    if (query.isPending) {
      return [0, 1].map((item) => (
        <li key={item} className="h-31 animate-pulse rounded-2xl bg-[#F4F3EF]" />
      ));
    }

    if (query.isError) {
      return <SectionState isError onRetry={() => void query.refetch()} className="h-40" />;
    }

    if (items.length === 0) {
      return (
        <p className="py-20 text-center text-[15px] text-[#8F8B85]">
          {TRAINING_HISTORY_EMPTY_TEXT}
        </p>
      );
    }

    return (
      <>
        {items.map((item) => (
          <li key={`${item.programId}-${item.roomId}`}>
            <button
              type="button"
              onClick={() => openRoom(item)}
              className="flex w-full items-center gap-4 rounded-2xl bg-[#FBFAF7] px-4 py-4 text-left active:bg-[#F2F0EA]"
            >
              <BookCover src={item.coverUrl} className="h-24 w-17 shrink-0 rounded-sm" />

              <span className="min-w-0 flex-1">
                <span className="block truncate text-[18px] font-bold text-[#2C2A2B]">
                  {item.title}
                </span>

                {item.subtitle && (
                  <span className="mt-1 block truncate text-[16px] text-[#8F8B85]">
                    {item.subtitle}
                  </span>
                )}

                {item.dateLabel && (
                  <span className="mt-0.5 block text-[16px] text-[#8F8B85]">{item.dateLabel}</span>
                )}
              </span>

              <ChevronRight aria-hidden="true" className="h-7 w-7 shrink-0 text-[#2C2A2B]" />
            </button>
          </li>
        ))}

        {query.hasNextPage && (
          <li>
            <div ref={sentinelRef} className="h-31 animate-pulse rounded-2xl bg-[#F4F3EF]" />
          </li>
        )}
      </>
    );
  };

  return (
    <main className="flex min-h-dvh flex-col">
      <Header title={TRAINING_HISTORY_TITLE} onBack={() => navigate(-1)} />

      <div role="tablist" aria-label={TRAINING_HISTORY_TITLE} className="mt-4 flex px-5">
        {TRAINING_HISTORY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 pb-3 text-[18px] font-bold ${
              activeTab === tab.id ? "text-[#2C2A2B]" : "text-[#C4C1BA]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 선택한 탭 아래 밑줄 */}
      <div className="mx-5 h-1 rounded-full bg-[#E7E5DF]">
        <div
          className="h-full w-1/2 rounded-full bg-[#4A5240] transition-transform"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
      </div>

      <ul className="flex flex-1 flex-col gap-4 px-5 pt-6 pb-8">{renderItems()}</ul>
    </main>
  );
}

import { REPORT_STATUS_TABS } from "@/constants/library/report";

import type { ReportStatusTab } from "@/constants/library/report";

type ReportStatusTabsProps = {
  tab: ReportStatusTab;
  counts: Record<ReportStatusTab, number>;
  onChange: (tab: ReportStatusTab) => void;
};

export default function ReportStatusTabs({ tab, counts, onChange }: ReportStatusTabsProps) {
  return (
    <div role="tablist" aria-label="독후감 상태" className="flex gap-1 rounded-xl bg-[#F7F6F1] p-1">
      {REPORT_STATUS_TABS.map((item) => {
        const isActive = item.id === tab;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-[16px] font-bold ${
              isActive ? "bg-[#BEC5A5] text-[#4F4D4E]" : "text-[#A1A7AD]"
            }`}
          >
            {item.label}

            {counts[item.id] > 0 && (
              <span
                className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[13px] tabular-nums ${
                  isActive ? "bg-[#9AA184] text-white" : "bg-[#E7E2DC] text-[#8F8F8F]"
                }`}
              >
                {counts[item.id]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

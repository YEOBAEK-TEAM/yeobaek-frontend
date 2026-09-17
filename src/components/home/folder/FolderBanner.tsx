import { ChevronRight } from "lucide-react";

import FolderEmptyState from "@/components/home/folder/FolderEmptyState";
import FolderTab from "@/components/home/folder/FolderTab";
import ReadingProgressPanel from "@/components/home/folder/ReadingProgressPanel";
import ReportPanel from "@/components/home/folder/ReportPanel";
import {
  FOLDER_ASPECT_RATIO,
  FOLDER_BODY_TOP,
  FOLDER_IMAGE,
  FOLDER_TAB_AREA,
} from "@/constants/home/folder";
import {
  READING_EMPTY_TEXT,
  READING_LINK_LABEL,
  READING_TAB_LABEL,
  REPORT_EMPTY_TEXT,
  REPORT_LINK_LABEL,
  REPORT_TAB_LABEL,
} from "@/constants/home/home";
import { useFolderBannerStore } from "@/stores/home/folderBanner";

import type { ReadingProgress, RecentReport } from "@/types/home/home";

type FolderBannerProps = {
  nickname: string;
  progress: ReadingProgress | null;
  report: RecentReport | null;
  onLinkClick: () => void;
};

export default function FolderBanner({
  nickname,
  progress,
  report,
  onLinkClick,
}: FolderBannerProps) {
  const activeTab = useFolderBannerStore((state) => state.activeTab);
  const setActiveTab = useFolderBannerStore((state) => state.setActiveTab);

  const backTab = activeTab === "reading" ? "report" : "reading";

  // 좌우 방향키로 폴더 전환
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    setActiveTab(backTab);
  };

  return (
    <section className="px-5">
      <div
        className="relative"
        role="tablist"
        aria-label="홈 배너"
        style={{ aspectRatio: FOLDER_ASPECT_RATIO }}
      >
        <img src={FOLDER_IMAGE[backTab]} alt="" className="absolute inset-0 z-0 h-full w-full" />

        <img src={FOLDER_IMAGE[activeTab]} alt="" className="absolute inset-0 z-10 h-full w-full" />

        {/* 폴더 탭 높이에 맞춘 이동 링크 */}
        <button
          type="button"
          onClick={onLinkClick}
          className="absolute top-0 right-1 z-30 flex items-center gap-0.5 text-[15px] font-semibold text-[#4F4D4E]"
          style={{ height: FOLDER_BODY_TOP }}
        >
          <span className="hover:underline active:underline">
            {activeTab === "reading" ? READING_LINK_LABEL : REPORT_LINK_LABEL}
          </span>

          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>

        <div
          role="tabpanel"
          id={`folder-panel-${activeTab}`}
          aria-labelledby={`folder-tab-${activeTab}`}
          className="absolute inset-x-0 bottom-0 z-20"
          style={{ top: FOLDER_BODY_TOP }}
        >
          {activeTab === "reading" &&
            (progress ? (
              <ReadingProgressPanel nickname={nickname} progress={progress} />
            ) : (
              <FolderEmptyState text={READING_EMPTY_TEXT} />
            ))}

          {activeTab === "report" &&
            (report ? (
              <ReportPanel nickname={nickname} report={report} />
            ) : (
              <FolderEmptyState text={REPORT_EMPTY_TEXT} />
            ))}
        </div>

        <FolderTab
          id="folder-tab-reading"
          label={READING_TAB_LABEL}
          controls="folder-panel-reading"
          active={activeTab === "reading"}
          className={FOLDER_TAB_AREA.reading}
          height={FOLDER_BODY_TOP}
          onSelect={() => setActiveTab("reading")}
          onKeyDown={handleKeyDown}
        />

        <FolderTab
          id="folder-tab-report"
          label={REPORT_TAB_LABEL}
          controls="folder-panel-report"
          active={activeTab === "report"}
          className={FOLDER_TAB_AREA.report}
          height={FOLDER_BODY_TOP}
          onSelect={() => setActiveTab("report")}
          onKeyDown={handleKeyDown}
        />
      </div>
    </section>
  );
}

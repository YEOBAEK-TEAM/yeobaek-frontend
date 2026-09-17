import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import SectionState from "@/components/common/section/SectionState";
import DraftReportCard from "@/components/library/report/DraftReportCard";
import MyReportSection from "@/components/library/report/MyReportSection";
import ReportWriteFlowModals from "@/components/library/report/ReportWriteFlowModals";
import { REPORT_PATH } from "@/constants/library/report";
import { useDraftReport, useMyReports } from "@/hooks/library/report/useReportQueries";
import { useReportWriteFlow } from "@/hooks/library/report/useReportWriteFlow";
import { toLatestReportView } from "@/utils/library/report/toReportView";

export default function ReportTabPanel() {
  const navigate = useNavigate();

  const draftQuery = useDraftReport();
  const draft = draftQuery.data ?? null;

  const myReportsQuery = useMyReports();
  const latestReport = useMemo(
    () => toLatestReportView(myReportsQuery.data ?? []),
    [myReportsQuery.data],
  );

  // 작성 중인 독후감이 없으면 최근 독후감 조회까지 기다린 뒤 배너 표시
  const isBannerPending = draftQuery.isPending || (!draft && myReportsQuery.isPending);

  const writeFlow = useReportWriteFlow();

  const startWrite = () => void writeFlow.startWrite();

  return (
    <div className="pt-4 pb-6">
      {isBannerPending || draftQuery.isError ? (
        <div className="px-8 py-9">
          <SectionState
            isError={draftQuery.isError}
            onRetry={() => void draftQuery.refetch()}
            className="h-60"
          />
        </div>
      ) : (
        <DraftReportCard
          draft={draft}
          latestReport={latestReport}
          onContinue={() => draft && navigate(REPORT_PATH.edit(draft.reportId))}
          onWrite={startWrite}
        />
      )}

      <MyReportSection
        onWrite={startWrite}
        onOpenReport={(reportId) => navigate(REPORT_PATH.edit(reportId))}
      />

      <ReportWriteFlowModals writeFlow={writeFlow} />
    </div>
  );
}

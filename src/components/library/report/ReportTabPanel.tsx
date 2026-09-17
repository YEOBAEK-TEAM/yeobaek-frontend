import { useNavigate } from "react-router-dom";

import SectionState from "@/components/common/section/SectionState";
import DraftReportCard from "@/components/library/report/DraftReportCard";
import MyReportSection from "@/components/library/report/MyReportSection";
import ReportWriteFlowModals from "@/components/library/report/ReportWriteFlowModals";
import { REPORT_PATH } from "@/constants/library/report";
import { useLatestReport } from "@/hooks/library/report/useReportQueries";
import { useReportWriteFlow } from "@/hooks/library/report/useReportWriteFlow";

export default function ReportTabPanel() {
  const navigate = useNavigate();

  const latestQuery = useLatestReport();

  const writeFlow = useReportWriteFlow();

  return (
    <div className="pt-4 pb-6">
      {latestQuery.isPending || latestQuery.isError ? (
        <div className="px-8 py-9">
          <SectionState
            isError={latestQuery.isError}
            onRetry={() => void latestQuery.refetch()}
            className="h-60"
          />
        </div>
      ) : (
        <DraftReportCard report={latestQuery.data} onWrite={writeFlow.startWrite} />
      )}

      <MyReportSection
        onWrite={writeFlow.startWrite}
        onOpenReport={(reportId) => navigate(REPORT_PATH.edit(reportId))}
      />

      <ReportWriteFlowModals writeFlow={writeFlow} />
    </div>
  );
}

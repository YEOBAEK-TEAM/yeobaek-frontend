import { useNavigate } from "react-router-dom";

import SectionState from "@/components/common/section/SectionState";
import ReportBannerCard from "@/components/library/report/ReportBannerCard";
import ReportListSection from "@/components/library/report/ReportListSection";
import ReportWriteFlowModals from "@/components/library/report/ReportWriteFlowModals";
import { REPORT_PATH } from "@/constants/library/report";
import { useLatestReport, useMyReports } from "@/hooks/library/report/useReportQueries";
import { toBannerDateLabel } from "@/utils/library/report/toReportView";
import { useReportWriteFlow } from "@/hooks/library/report/useReportWriteFlow";

export default function ReportTabPanel() {
  const navigate = useNavigate();

  const latestQuery = useLatestReport();
  const latest = latestQuery.data ?? null;

  // 배너 독후감의 수정 시각은 같은 캐시를 쓰는 목록에서 찾음
  const listQuery = useMyReports(latest?.isDraft ? "DRAFT" : "PUBLISHED");
  const bannerUpdatedAt = listQuery.data?.reports.find(
    (report) => report.reportId === latest?.reportId,
  )?.updatedAt;

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
        <ReportBannerCard
          report={latest}
          dateLabel={latest ? toBannerDateLabel(latest, bannerUpdatedAt) : ""}
          onContinue={(reportId) => navigate(REPORT_PATH.edit(reportId))}
          onWrite={writeFlow.startWrite}
        />
      )}

      <ReportListSection onOpenReport={(reportId) => navigate(REPORT_PATH.edit(reportId))} />

      <ReportWriteFlowModals writeFlow={writeFlow} />
    </div>
  );
}

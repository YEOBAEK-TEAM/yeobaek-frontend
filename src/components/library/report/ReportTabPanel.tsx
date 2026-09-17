import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import CommonModal from "@/components/common/modal/CommonModal";
import SectionState from "@/components/common/section/SectionState";
import DraftReportCard from "@/components/library/report/DraftReportCard";
import MyReportSection from "@/components/library/report/MyReportSection";
import UnlockedBookSheet from "@/components/library/report/UnlockedBookSheet";
import {
  DRAFT_EXISTS_MESSAGE,
  getWriteConfirmMessage,
  MODAL_ANSWER,
  REPORT_PATH,
} from "@/constants/library/report";
import { useDraftReport, useMyReports } from "@/hooks/library/report/useReportQueries";
import { toLatestReportView } from "@/utils/library/report/toReportView";

import type { UnlockedBookView } from "@/types/library/report";

type WriteFlow =
  | { step: "idle" }
  | { step: "draftExists" }
  | { step: "selectBook" }
  | { step: "confirm"; book: UnlockedBookView };

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

  const [flow, setFlow] = useState<WriteFlow>({ step: "idle" });

  const closeFlow = () => setFlow({ step: "idle" });

  // 작성 중인 독후감은 하나만 허용, 있으면 목록 대신 안내
  const startWrite = () => setFlow(draft ? { step: "draftExists" } : { step: "selectBook" });

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

      {flow.step === "draftExists" && (
        <CommonModal message={DRAFT_EXISTS_MESSAGE} onClose={closeFlow} />
      )}

      {flow.step === "selectBook" && (
        <UnlockedBookSheet
          onSelect={(book) => setFlow({ step: "confirm", book })}
          onClose={closeFlow}
        />
      )}

      {flow.step === "confirm" && (
        <CommonModal
          message={getWriteConfirmMessage(flow.book.title)}
          onClose={closeFlow}
          actions={[
            { label: MODAL_ANSWER.no, onClick: closeFlow },
            {
              label: MODAL_ANSWER.yes,
              onClick: () => navigate(REPORT_PATH.write(flow.book.bookId)),
            },
          ]}
        />
      )}
    </div>
  );
}

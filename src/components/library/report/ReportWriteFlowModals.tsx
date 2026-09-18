import { useLocation, useNavigate } from "react-router-dom";

import CommonModal from "@/components/common/modal/CommonModal";
import UnlockedBookSheet from "@/components/library/report/UnlockedBookSheet";
import UnlockGuideModal from "@/components/library/unlock-quiz/UnlockGuideModal";
import {
  DRAFT_EXISTS_MESSAGE,
  getWriteConfirmMessage,
  LIBRARY_REPORT_TAB_STATE,
  MODAL_ANSWER,
} from "@/constants/library/report";

import type { ReportWriteFlow } from "@/hooks/library/report/useReportWriteFlow";

type ReportWriteFlowModalsProps = {
  writeFlow: ReportWriteFlow;
};

export default function ReportWriteFlowModals({ writeFlow }: ReportWriteFlowModalsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { flow, close, writeBook, openUnlockGuide, confirmWrite } = writeFlow;

  if (flow.step === "draftExists") {
    return <CommonModal message={DRAFT_EXISTS_MESSAGE} onClose={close} />;
  }

  if (flow.step === "selectBook") {
    return (
      <UnlockedBookSheet
        onSelectUnlocked={(book) => void writeBook({ bookId: book.bookId, title: book.title })}
        onSelectPending={(book) => openUnlockGuide({ bookId: book.bookId, title: book.title })}
        onClose={close}
      />
    );
  }

  if (flow.step === "confirm") {
    return (
      <CommonModal
        message={getWriteConfirmMessage(flow.book.title)}
        onClose={close}
        actions={[
          { label: MODAL_ANSWER.no, onClick: close },
          { label: MODAL_ANSWER.yes, onClick: confirmWrite },
        ]}
      />
    );
  }

  if (flow.step === "unlockGuide") {
    return (
      <UnlockGuideModal
        bookId={flow.book.bookId}
        bookTitle={flow.book.title}
        onClose={close}
        // 퀴즈에서 돌아오면 서재가 독후감 탭으로 열리도록 현재 기록에 탭 정보 저장
        onBeforeStart={() =>
          location.pathname === "/library" &&
          navigate("/library", { replace: true, state: LIBRARY_REPORT_TAB_STATE })
        }
      />
    );
  }

  return null;
}

import { useLocation, useNavigate } from "react-router-dom";

import UnlockedBookSheet from "@/components/library/report/UnlockedBookSheet";
import UnlockGuideModal from "@/components/library/unlock-quiz/UnlockGuideModal";
import { LIBRARY_REPORT_TAB_STATE } from "@/constants/library/report";

import type { ReportWriteFlow } from "@/hooks/library/report/useReportWriteFlow";

type ReportWriteFlowModalsProps = {
  writeFlow: ReportWriteFlow;
};

export default function ReportWriteFlowModals({ writeFlow }: ReportWriteFlowModalsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { isSheetOpen, guideBook, close, writeBook, openUnlockGuide } = writeFlow;

  if (isSheetOpen) {
    return (
      <UnlockedBookSheet
        onSelectUnlocked={(book) => writeBook({ bookId: book.bookId, title: book.title })}
        onSelectPending={(book) => openUnlockGuide({ bookId: book.bookId, title: book.title })}
        onClose={close}
      />
    );
  }

  if (guideBook) {
    return (
      <UnlockGuideModal
        bookId={guideBook.bookId}
        bookTitle={guideBook.title}
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

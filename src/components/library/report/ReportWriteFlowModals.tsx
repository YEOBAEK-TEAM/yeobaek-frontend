import CommonModal from "@/components/common/modal/CommonModal";
import UnlockedBookSheet from "@/components/library/report/UnlockedBookSheet";
import { getWriteConfirmMessage, MODAL_ANSWER } from "@/constants/library/report";

import type { ReportWriteFlow } from "@/hooks/library/report/useReportWriteFlow";

type ReportWriteFlowModalsProps = {
  writeFlow: ReportWriteFlow;
};

export default function ReportWriteFlowModals({ writeFlow }: ReportWriteFlowModalsProps) {
  const { flow, close, writeBook, confirmWrite } = writeFlow;

  if (flow.step === "selectBook") {
    return (
      <UnlockedBookSheet
        onSelect={(book) => writeBook({ bookId: book.bookId, title: book.title })}
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

  return null;
}

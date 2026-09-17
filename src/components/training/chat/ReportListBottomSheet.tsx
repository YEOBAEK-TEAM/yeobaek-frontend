import BottomSheet from "@/components/common/bottomSheet/BottomSheet";
import ReportSheetContent from "@/components/training/chat/ReportSheetContent";

import type { ReadingReport } from "@/types/training/readingReport";

type ReportListBottomSheetProps = {
  reports: ReadingReport[];
  onSelect: (report: ReadingReport) => void;
  onClose: () => void;
};

export default function ReportListBottomSheet({
  reports,
  onSelect,
  onClose,
}: ReportListBottomSheetProps) {
  return (
    <BottomSheet labelledBy="report-sheet-title" onClose={onClose}>
      <ReportSheetContent reports={reports} onSelect={onSelect} />
    </BottomSheet>
  );
}

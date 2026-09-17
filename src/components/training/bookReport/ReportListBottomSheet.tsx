import BottomSheet from "@/components/common/bottomSheet/BottomSheet";
import ReportSheetContent from "@/components/training/bookReport/ReportSheetContent";

import type { ReportSheetContentProps } from "@/components/training/bookReport/ReportSheetContent";

type ReportListBottomSheetProps = ReportSheetContentProps & {
  onClose: () => void;
};

export default function ReportListBottomSheet({ onClose, ...props }: ReportListBottomSheetProps) {
  return (
    <BottomSheet labelledBy="report-sheet-title" onClose={onClose}>
      <ReportSheetContent {...props} />
    </BottomSheet>
  );
}

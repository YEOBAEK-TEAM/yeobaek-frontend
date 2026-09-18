import { NotebookPen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import ReportWriteFlowModals from "@/components/library/report/ReportWriteFlowModals";
import UnlockGuideModal from "@/components/library/unlock-quiz/UnlockGuideModal";
import { REPORT_UNLOCK_BUTTON_LABEL } from "@/constants/library/unlockQuiz";
import { useUnlockedBooks } from "@/hooks/library/report/useReportQueries";
import { useReportWriteFlow } from "@/hooks/library/report/useReportWriteFlow";
import { useReadingCompletion } from "@/hooks/library/unlock-quiz/useUnlockQuizQueries";

type ReportUnlockButtonProps = {
  bookId: number;
  bookTitle: string;
};

const APPEAR_KEYFRAMES: Keyframe[] = [
  { opacity: 0, transform: "scale(0.5)" },
  { opacity: 1, transform: "scale(1.15)", offset: 0.7 },
  { opacity: 1, transform: "scale(1)" },
];

// 완독한 책에서만 보이는 뷰어 하단 바 독후감 아이콘
export default function ReportUnlockButton({ bookId, bookTitle }: ReportUnlockButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { isCompleted, isReady } = useReadingCompletion(bookId);

  // 해금됐지만 아직 쓰지 않은 책이면 퀴즈 없이 작성
  const unlockedQuery = useUnlockedBooks(isCompleted);
  const isUnlocked = unlockedQuery.data?.some((book) => book.bookId === bookId) ?? false;

  const writeFlow = useReportWriteFlow();

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [wasCompletedOnLoad, setWasCompletedOnLoad] = useState<boolean | null>(null);

  if (isReady && wasCompletedOnLoad === null) setWasCompletedOnLoad(isCompleted);

  // 읽는 도중 완독한 순간에만 등장 연출
  useEffect(() => {
    if (!isCompleted || wasCompletedOnLoad !== false) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    buttonRef.current?.animate(APPEAR_KEYFRAMES, { duration: 420, easing: "ease-out" });
  }, [isCompleted, wasCompletedOnLoad]);

  if (!isCompleted) return null;

  const handleClick = () => {
    if (unlockedQuery.isPending) return;

    if (isUnlocked) {
      void writeFlow.writeBook({ bookId, title: bookTitle });
      return;
    }

    setIsGuideOpen(true);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={REPORT_UNLOCK_BUTTON_LABEL}
        aria-haspopup="dialog"
        aria-busy={unlockedQuery.isPending}
        onClick={handleClick}
        // 하단 바 오른쪽 끝에 붙도록 아이콘 우측 정렬
        className="justify-end"
      >
        <NotebookPen aria-hidden="true" size={24} strokeWidth={1.5} />
      </button>

      {/* 뷰어 하단 바 글꼴·버튼 스타일이 모달에 번지지 않게 body에 렌더 */}
      {createPortal(
        <>
          {isGuideOpen && (
            <UnlockGuideModal
              bookId={bookId}
              bookTitle={bookTitle}
              onClose={() => setIsGuideOpen(false)}
            />
          )}
          <ReportWriteFlowModals writeFlow={writeFlow} />
        </>,
        document.body,
      )}
    </>
  );
}

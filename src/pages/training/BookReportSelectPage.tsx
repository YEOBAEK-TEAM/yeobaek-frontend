import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BookCover from "@/components/common/bookCover/BookCover";
import Header from "@/components/common/header/Header";
import SectionState from "@/components/common/section/SectionState";
import ConfirmModal from "@/components/common/confirmModal/ConfirmModal";
import AnalyzingOverlay from "@/components/training/bookReport/AnalyzingOverlay";
import {
  ONGOING_TRAINING_CONFIRM_TEXT,
  REPORT_SELECT_SECTION_TITLE,
  REPORT_SELECT_SUBMIT_LABEL,
  REPORT_SELECT_TITLE,
  REPORT_SHEET_EMPTY_TEXT,
  START_ERROR_TEXT,
} from "@/constants/training/bookReportChat";
import { TRAINING_PATH } from "@/constants/training/trainingPrograms";
import { useInfiniteSentinel } from "@/hooks/training/discussion/useInfiniteSentinel";
import { useOngoingTraining } from "@/hooks/training/useOngoingTraining";
import {
  useStartTraining,
  useTrainingReviews,
} from "@/hooks/training/useBookReportTrainingQueries";
import { myProfile } from "@/mocks/my";
import { useAuthStore } from "@/stores/auth";

export default function BookReportSelectPage() {
  const navigate = useNavigate();

  const nickname = useAuthStore((state) => state.nickname) ?? myProfile.nickname;

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const {
    data: reports = [],
    isPending,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useTrainingReviews(true);

  const startTraining = useStartTraining();

  // 훈련은 한 번에 하나만 진행, 이미 있으면 그 방으로 안내
  const { data: ongoing } = useOngoingTraining();

  const ongoingRoomId =
    ongoing?.status === "in-progress" && ongoing.programId === "book-report"
      ? ongoing.roomId
      : null;

  const [isOngoingConfirmOpen, setIsOngoingConfirmOpen] = useState(false);

  const goOngoingRoom = () =>
    navigate(`${TRAINING_PATH.bookReportChat}?trainingRoomId=${ongoingRoomId}`, { replace: true });

  const sentinelRef = useInfiniteSentinel({
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
  });

  // 훈련방을 만든 뒤 첫 질문과 함께 채팅으로 이동
  const start = () => {
    if (selectedId === null || startTraining.isPending) return;

    if (ongoingRoomId !== null) {
      setIsOngoingConfirmOpen(true);
      return;
    }

    startTraining.mutate(selectedId, {
      onSuccess: ({ trainingRoomId }) =>
        navigate(`${TRAINING_PATH.bookReportChat}?trainingRoomId=${trainingRoomId}`, {
          replace: true,
        }),
    });
  };

  const renderReports = () => {
    if (isPending) {
      return [0, 1, 2].map((item) => (
        <li key={item} className="h-21 animate-pulse rounded-xl bg-[#EFEDE7]" />
      ));
    }

    if (isError && reports.length === 0) {
      return <SectionState isError onRetry={() => void refetch()} className="h-40" />;
    }

    if (reports.length === 0) {
      return (
        <p className="py-16 text-center text-[15px] text-[#8F8B85]">{REPORT_SHEET_EMPTY_TEXT}</p>
      );
    }

    return (
      <>
        {reports.map((report) => (
          <li key={report.reportId}>
            <button
              type="button"
              aria-pressed={selectedId === report.reportId}
              onClick={() => setSelectedId(report.reportId)}
              className={`flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left ${
                selectedId === report.reportId
                  ? "bg-[#FBFAF6] outline-2 outline-[#C9C5BC]"
                  : "border-b border-[#EFEDE7]"
              }`}
            >
              <BookCover src={report.coverUrl} className="h-[72px] w-13 shrink-0 rounded-sm" />

              <span className="min-w-0 flex-1">
                <span className="block truncate text-[18px] font-bold text-[#2C2A2B]">
                  {report.bookTitle}
                </span>
                <span className="mt-0.5 block truncate text-[15px] text-[#8F8B85]">
                  {report.reportTitle}
                </span>
              </span>
            </button>
          </li>
        ))}

        {hasNextPage && (
          <li>
            <div ref={sentinelRef} className="h-21 animate-pulse rounded-xl bg-[#EFEDE7]" />
          </li>
        )}
      </>
    );
  };

  return (
    <main className="flex min-h-dvh flex-col">
      <Header title={REPORT_SELECT_TITLE} onBack={() => navigate(-1)} className="px-5 pt-8 pb-5" />

      <section className="flex-1 px-5 pt-6">
        <h2 className="text-[20px] font-bold text-[#2C2A2B]">{REPORT_SELECT_SECTION_TITLE}</h2>

        <ul className="mt-4 flex flex-col gap-1 pb-6">{renderReports()}</ul>
      </section>

      <div className="sticky bottom-0 bg-white px-5 pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        {startTraining.isError && (
          <p className="pb-2 text-center text-[13px] text-[#D9534F]">{START_ERROR_TEXT}</p>
        )}

        <button
          type="button"
          onClick={start}
          disabled={selectedId === null || startTraining.isPending}
          className="h-13.5 w-full rounded-xl bg-[#B7C3A3] text-[18px] font-bold text-white disabled:bg-[#DCDDD5]"
        >
          {REPORT_SELECT_SUBMIT_LABEL}
        </button>
      </div>

      {startTraining.isPending && <AnalyzingOverlay nickname={nickname} />}

      {isOngoingConfirmOpen && (
        <ConfirmModal onConfirm={goOngoingRoom} onClose={() => setIsOngoingConfirmOpen(false)}>
          {ONGOING_TRAINING_CONFIRM_TEXT}
        </ConfirmModal>
      )}
    </main>
  );
}

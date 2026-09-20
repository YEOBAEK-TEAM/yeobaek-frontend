import { useId } from "react";

import BottomSheet from "@/components/common/bottomSheet/BottomSheet";
import SectionState from "@/components/common/section/SectionState";
import EmptyMessage from "@/components/training/discussion/EmptyMessage";
import ProfileAvatar from "@/components/training/discussion/shared/ProfileAvatar";
import { APPLICANT_SHEET } from "@/constants/training/discussion/roomChat";
import {
  useApproveApplicant,
  useRejectApplicant,
} from "@/hooks/training/discussion/useRoomMutations";
import { useInfiniteSentinel } from "@/hooks/training/discussion/useInfiniteSentinel";
import { useRoomApplicants } from "@/hooks/training/discussion/useRoomQueries";

type ApplicantSheetProps = {
  roomId: number;
  onClose: () => void;
};

export default function ApplicantSheet({ roomId, onClose }: ApplicantSheetProps) {
  const titleId = useId();

  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useRoomApplicants(roomId, true);

  const applicants = data?.applicants ?? [];

  const sentinelRef = useInfiniteSentinel({
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
  });

  const approve = useApproveApplicant();
  const reject = useRejectApplicant();

  const isMutating = approve.isPending || reject.isPending;

  return (
    <BottomSheet labelledBy={titleId} onClose={onClose}>
      <div className="px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        <h2 id={titleId} className="px-2 text-[18px] font-bold text-[#4F4D4E]">
          {APPLICANT_SHEET.title}
        </h2>

        {isPending || isError ? (
          <div className="mt-3">
            <SectionState isError={isError} onRetry={() => void refetch()} className="h-32" />
          </div>
        ) : applicants.length === 0 ? (
          <EmptyMessage text={APPLICANT_SHEET.emptyText} className="py-14" />
        ) : (
          <ul className="mt-2 max-h-80 overflow-y-auto">
            {applicants.map((applicant) => (
              <li key={applicant.memberId} className="flex items-center gap-3 px-2 py-2.5">
                <ProfileAvatar src={applicant.imageUrl} className="h-10 w-10" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold text-[#4F4D4E]">
                    {applicant.nickname}
                  </p>
                  <p className="text-[12px] text-[#8F8B85]">{applicant.appliedLabel}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    disabled={isMutating}
                    onClick={() => reject.mutate({ roomId, memberId: applicant.memberId })}
                    className="h-8 rounded-lg border border-[#DCD8D1] px-3 text-[13px] font-medium text-[#8F8B85] disabled:opacity-50"
                  >
                    {APPLICANT_SHEET.rejectLabel}
                  </button>

                  <button
                    type="button"
                    disabled={isMutating}
                    onClick={() => approve.mutate({ roomId, memberId: applicant.memberId })}
                    className="h-8 rounded-lg bg-[#4F4D4E] px-3 text-[13px] font-medium text-white disabled:opacity-50"
                  >
                    {APPLICANT_SHEET.approveLabel}
                  </button>
                </div>
              </li>
            ))}

            {hasNextPage && (
              <li>
                <div ref={sentinelRef} className="h-14 animate-pulse rounded-xl bg-[#F2F0EA]" />
              </li>
            )}
          </ul>
        )}
      </div>
    </BottomSheet>
  );
}

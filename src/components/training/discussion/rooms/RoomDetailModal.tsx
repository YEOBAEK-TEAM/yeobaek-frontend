import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";

import BookCover from "@/components/common/bookCover/BookCover";
import SectionState from "@/components/common/section/SectionState";
import HostProfile from "@/components/training/discussion/rooms/HostProfile";
import JoinRequestButton from "@/components/training/discussion/rooms/JoinRequestButton";
import DiscussionModal from "@/components/training/discussion/shared/DiscussionModal";
import ModalCloseButton from "@/components/training/discussion/shared/ModalCloseButton";
import TagList from "@/components/training/discussion/shared/TagList";
import { DISCUSSION_PATH } from "@/constants/training/discussion/discussion";
import { ROOM_DETAIL_FALLBACK_TITLE } from "@/constants/training/discussion/room";
import { useJoinRequest } from "@/hooks/training/discussion/useRoomMutations";
import { useRoomDetail } from "@/hooks/training/discussion/useRoomQueries";
import { getRoomErrorMessage } from "@/utils/training/discussion/getRoomErrorMessage";

import type { RoomSummaryView } from "@/types/training/discussion/room";

type RoomDetailModalProps = {
  roomId: number;
  initialRoom?: RoomSummaryView;
  onClose: () => void;
  onRequested: () => void;
};

export default function RoomDetailModal({
  roomId,
  initialRoom,
  onClose,
  onRequested,
}: RoomDetailModalProps) {
  const titleId = useId();
  const navigate = useNavigate();

  const detailQuery = useRoomDetail(roomId);
  const joinRequest = useJoinRequest();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 상세 응답 전까지 목록 데이터로 먼저 표시
  const room = detailQuery.data ?? initialRoom;
  const detail = detailQuery.data;

  const enterRoom = () => {
    onClose();
    navigate(DISCUSSION_PATH.room(roomId));
  };

  const requestJoin = () => {
    setErrorMessage(null);

    joinRequest.mutate(roomId, {
      onSuccess: ({ status }) => (status === "joined" ? enterRoom() : onRequested()),
      onError: (error) => setErrorMessage(getRoomErrorMessage(error)),
    });
  };

  return (
    <DiscussionModal
      labelledBy={titleId}
      onClose={onClose}
      className="max-w-81 rounded-2xl bg-white"
    >
      <div className="relative px-4 pt-8 pb-4">
        <ModalCloseButton onClick={onClose} />

        {!room ? (
          <>
            <h2 id={titleId} className="sr-only">
              {ROOM_DETAIL_FALLBACK_TITLE}
            </h2>

            {detailQuery.isError ? (
              <SectionState
                isError
                onRetry={() => void detailQuery.refetch()}
                className="mt-6 h-60"
              />
            ) : (
              <div className="mt-6 h-80 animate-pulse rounded-xl bg-[#EFEDE7]" />
            )}
          </>
        ) : (
          <>
            <div className="flex gap-3.5 pr-6">
              <BookCover src={room.coverUrl} className="h-33.5 w-23 shrink-0 rounded-sm" />

              <div className="min-w-0 flex-1 pt-2">
                <h2
                  id={titleId}
                  className="line-clamp-2 text-[17px] leading-6 font-medium text-[#2C2A2B]"
                >
                  {room.title}
                </h2>
                <p className="truncate text-[16px] leading-6 text-[#2C2A2B]">{room.author}</p>

                <p className="mt-5 flex gap-5 text-[16px] font-semibold text-[#2C2A2B]">
                  <span>{room.participantText}</span>
                  <span>{room.visibilityLabel}</span>
                </p>

                <TagList tags={room.tags} className="mt-2" />
              </div>
            </div>

            <div className="px-2">
              {detail ? (
                <>
                  <p className="mt-7 text-[14px] leading-5 break-keep whitespace-pre-line text-[#2C2A2B]">
                    {detail.description}
                  </p>

                  <div className="mt-6">
                    <HostProfile nickname={detail.host.nickname} imageUrl={detail.host.imageUrl} />
                  </div>

                  <p className="text-right text-[16px] font-semibold text-[#4F4D4E] tabular-nums">
                    {detail.openedLabel}
                  </p>
                </>
              ) : (
                <div aria-hidden="true" className="mt-7 flex flex-col gap-2">
                  <span className="h-4 w-11/12 animate-pulse rounded bg-[#EFEDE7]" />
                  <span className="h-4 w-3/4 animate-pulse rounded bg-[#EFEDE7]" />
                  <span className="mt-6 h-14 w-40 animate-pulse rounded bg-[#EFEDE7]" />
                </div>
              )}
            </div>

            {errorMessage && (
              <p role="alert" className="mt-3 text-center text-[13px] text-[#D91414]">
                {errorMessage}
              </p>
            )}

            <div className="mt-3">
              <JoinRequestButton
                status={room.joinStatus}
                visibility={room.visibility}
                isPending={joinRequest.isPending}
                onRequest={requestJoin}
                onEnter={enterRoom}
              />
            </div>
          </>
        )}
      </div>
    </DiscussionModal>
  );
}

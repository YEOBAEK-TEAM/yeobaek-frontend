import { useState } from "react";

import RoomDetailModal from "@/components/training/discussion/rooms/RoomDetailModal";
import NoticeModal from "@/components/training/discussion/shared/NoticeModal";
import { JOIN_REQUESTED_MESSAGE } from "@/constants/training/discussion/room";

import type { RoomSummaryView } from "@/types/training/discussion/room";

type RoomJoinFlowProps = {
  roomId: number;
  initialRoom?: RoomSummaryView;
  onClose: () => void;
};

// 상세 모달에서 신청 성공 시 안내 모달로 교체
export default function RoomJoinFlow({ roomId, initialRoom, onClose }: RoomJoinFlowProps) {
  const [isRequested, setIsRequested] = useState(false);

  if (isRequested) return <NoticeModal message={JOIN_REQUESTED_MESSAGE} onClose={onClose} />;

  return (
    <RoomDetailModal
      roomId={roomId}
      initialRoom={initialRoom}
      onClose={onClose}
      onRequested={() => setIsRequested(true)}
    />
  );
}

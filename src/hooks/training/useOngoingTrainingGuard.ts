import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import { getApiErrorStatus } from "@/utils/common/getApiErrorMessage";

import type { UseQueryResult } from "@tanstack/react-query";
import type { OngoingTraining } from "@/types/training/ongoingTraining";

// 채팅 경로의 쿼리 이름이자 409 응답이 돌려주는 방 번호 필드
type RoomIdKey = "trainingRoomId" | "understandRoomId";

type OngoingTrainingGuardOptions = {
  roomQuery: UseQueryResult<OngoingTraining | null>;
  chatPath: string;
  roomIdKey: RoomIdKey;
};

// 서버가 중복 생성을 막으면서 알려주는 기존 방 번호
const readConflictRoomId = (error: unknown, roomIdKey: RoomIdKey) => {
  if (!isAxiosError(error)) return null;

  const body = error.response?.data as
    | (Partial<Record<RoomIdKey, number>> & { data?: Partial<Record<RoomIdKey, number>> })
    | undefined;

  return body?.data?.[roomIdKey] ?? body?.[roomIdKey] ?? null;
};

// 같은 종류의 훈련은 하나만, 같은 내용이면 기존 방으로 보내고 다른 내용이면 막음
export const useOngoingTrainingGuard = ({
  roomQuery,
  chatPath,
  roomIdKey,
}: OngoingTrainingGuardOptions) => {
  const navigate = useNavigate();

  const [action, setAction] = useState<"continue" | "blocked" | null>(null);
  const [conflictRoomId, setConflictRoomId] = useState<number | null>(null);

  const ongoingRoom = roomQuery.data?.status === "in-progress" ? roomQuery.data : null;

  const openConflictRoom = () =>
    navigate(`${chatPath}?${roomIdKey}=${conflictRoomId}`, { replace: true });

  const closeAction = () => setAction(null);

  const showConflict = (room: OngoingTraining, targetKey: string) => {
    setConflictRoomId(room.roomId);
    setAction(room.targetKey === targetKey ? "continue" : "blocked");
  };

  // 화면에 들고 있는 목록만으로 먼저 판단
  const blockBeforeStart = (targetKey: string) => {
    if (!ongoingRoom) return false;

    showConflict(ongoingRoom, targetKey);
    return true;
  };

  // 목록을 읽은 뒤 방이 생겼을 수 있어 서버가 막으면 다시 확인
  const resolveConflict = async (error: unknown, targetKey: string) => {
    if (getApiErrorStatus(error) !== 409) return false;

    const { data: latest } = await roomQuery.refetch();
    const room = latest?.status === "in-progress" ? latest : null;

    if (room) {
      showConflict(room, targetKey);
      return true;
    }

    // 목록에서 못 찾으면 응답이 알려준 방으로 안내
    const roomId = readConflictRoomId(error, roomIdKey);
    if (roomId === null) return false;

    setConflictRoomId(roomId);
    setAction("continue");
    return true;
  };

  return { ongoingRoom, action, closeAction, blockBeforeStart, resolveConflict, openConflictRoom };
};

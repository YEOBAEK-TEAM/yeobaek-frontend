import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createRoom, joinRoomByCode, requestJoinRoom } from "@/api/training/discussion/room";
import { discussionKeys } from "@/hooks/training/discussion/useDiscussionQueries";
import { roomKeys } from "@/hooks/training/discussion/useRoomQueries";

import type { QueryKey } from "@tanstack/react-query";

// 변경 성공 후 다시 불러올 토론 쿼리 목록
const ALL_GROUP_LISTS = [...discussionKeys.all, "groups"];

const INVALIDATE_TARGETS = {
  create: [discussionKeys.active(), ALL_GROUP_LISTS, roomKeys.all],
  joinRequest: [ALL_GROUP_LISTS, roomKeys.all],
  joinByCode: [discussionKeys.active(), ALL_GROUP_LISTS, roomKeys.all],
} satisfies Record<string, QueryKey[]>;

const useInvalidate = () => {
  const queryClient = useQueryClient();

  return (queryKeys: QueryKey[]) =>
    queryKeys.forEach((queryKey) => void queryClient.invalidateQueries({ queryKey }));
};

export const useCreateRoom = () => {
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: createRoom,
    onSuccess: () => invalidate(INVALIDATE_TARGETS.create),
  });
};

export const useJoinRequest = () => {
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: requestJoinRoom,
    onSettled: () => invalidate(INVALIDATE_TARGETS.joinRequest),
  });
};

export const useJoinByCode = () => {
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: joinRoomByCode,
    onSuccess: () => invalidate(INVALIDATE_TARGETS.joinByCode),
  });
};

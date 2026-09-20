import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  approveApplicant,
  createRoom,
  deleteRoom,
  joinRoomByCode,
  kickRoomMember,
  leaveRoom,
  rejectApplicant,
  requestJoinRoom,
} from "@/api/training/discussion/room";
import { discussionKeys } from "@/hooks/training/discussion/useDiscussionQueries";
import { roomKeys } from "@/hooks/training/discussion/useRoomQueries";

import type { QueryKey } from "@tanstack/react-query";

// 변경 성공 후 다시 불러올 토론 쿼리 목록
const ALL_GROUP_LISTS = [...discussionKeys.all, "groups"];

const INVALIDATE_TARGETS = {
  create: [ALL_GROUP_LISTS, roomKeys.all],
  joinRequest: [ALL_GROUP_LISTS, roomKeys.all],
  joinByCode: [ALL_GROUP_LISTS, roomKeys.all],
  membership: [ALL_GROUP_LISTS, roomKeys.all],
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
    retry: 0,
    onSuccess: () => invalidate(INVALIDATE_TARGETS.create),
  });
};

export const useJoinRequest = () => {
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: requestJoinRoom,
    retry: 0,
    onSettled: () => invalidate(INVALIDATE_TARGETS.joinRequest),
  });
};

export const useJoinByCode = () => {
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: joinRoomByCode,
    retry: 0,
    onSuccess: () => invalidate(INVALIDATE_TARGETS.joinByCode),
  });
};

// 승인·거절 후 신청자 목록과 참여 인원을 함께 갱신
const useApplicantMutation = (
  mutationFn: (variables: { roomId: number; memberId: number }) => Promise<void>,
) => {
  const invalidate = useInvalidate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    retry: 0,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: roomKeys.applicants(variables.roomId) });
      invalidate(INVALIDATE_TARGETS.membership);
    },
  });
};

export const useApproveApplicant = () => useApplicantMutation(approveApplicant);

export const useRejectApplicant = () => useApplicantMutation(rejectApplicant);

export const useKickMember = () => useApplicantMutation(kickRoomMember);

export const useLeaveRoom = () => {
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: leaveRoom,
    retry: 0,
    onSuccess: () => invalidate(INVALIDATE_TARGETS.membership),
  });
};

export const useDeleteRoom = () => {
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: deleteRoom,
    retry: 0,
    onSuccess: () => invalidate(INVALIDATE_TARGETS.membership),
  });
};

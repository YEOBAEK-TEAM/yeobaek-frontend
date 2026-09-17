import {
  getCreatedRooms,
  getRememberedMembership,
  getRememberedRoomIds,
  getRememberedVisits,
} from "@/api/training/discussion/mockDiscussionMemory";
import {
  mockActiveDiscussions,
  mockHotGroups,
  mockMyGroups,
  mockNewGroups,
  mockPendingGroups,
  mockSearchableGroups,
} from "@/mocks/training/discussion/discussion";
import { mockRooms } from "@/mocks/training/discussion/room";

import type {
  ActiveDiscussionResponse,
  DiscussionGroupResponse,
  GroupMembership,
} from "@/types/training/discussion/discussion";

// 신청·승인 결과를 반영한 참가 상태
const withMembership = (group: DiscussionGroupResponse): DiscussionGroupResponse => ({
  ...group,
  membership: getRememberedMembership(group.roomId) ?? group.membership,
});

// 토론방 리스트에서 신청한 방도 그룹 카드로 보여주기 위한 변환
const findGroupByRoomId = (roomId: number): DiscussionGroupResponse | null => {
  const group = [
    ...getCreatedRooms().map((entry) => entry.group),
    ...mockSearchableGroups,
    ...mockMyGroups,
    ...mockPendingGroups,
  ].find((item) => item.roomId === roomId);
  if (group) return group;

  const room = mockRooms.find((item) => item.roomId === roomId);
  if (!room) return null;

  return {
    roomId: room.roomId,
    groupId: room.roomId,
    bookTitle: room.bookTitle,
    author: room.author,
    coverUrl: room.coverUrl,
    hostNickname: room.hostNickname,
    hostProfileImageUrl: room.hostProfileImageUrl,
    participantCount: room.participantCount,
    membership: "none",
    isHost: false,
    createdAt: room.createdAt,
  };
};

// 기본 목록과 신청·승인으로 옮겨온 방을 합쳐 상태별로 추림
const collectByMembership = (
  base: DiscussionGroupResponse[],
  membership: Exclude<GroupMembership, "none">,
) => {
  const baseRoomIds = new Set(base.map((group) => group.roomId));

  const moved = getRememberedRoomIds()
    .filter((roomId) => !baseRoomIds.has(roomId))
    .map(findGroupByRoomId)
    .filter((group): group is DiscussionGroupResponse => group !== null);

  return [...base, ...moved].map(withMembership).filter((group) => group.membership === membership);
};

// 참여 중인 토론방 조회
export const getActiveDiscussions = async (): Promise<ActiveDiscussionResponse[]> => {
  const visits = new Map(getRememberedVisits());

  const base = mockActiveDiscussions
    .filter((room) => getRememberedMembership(room.roomId) !== "none")
    .map((room) => ({ ...room, lastVisitedAt: visits.get(room.roomId) ?? room.lastVisitedAt }));

  const visited = [...visits]
    .filter(([roomId]) => !base.some((room) => room.roomId === roomId))
    .map(([roomId, lastVisitedAt]) => {
      const group = findGroupByRoomId(roomId);
      return group ? { ...group, lastVisitedAt } : null;
    })
    .filter((room): room is DiscussionGroupResponse & { lastVisitedAt: string } => room !== null);

  const discussions = [...base, ...visited];

  // 참여·생성한 방이 하나도 없던 상태에서 만든 방은 최근 토론으로 노출
  if (discussions.length > 0) return discussions;

  return getCreatedRooms().map(({ group }) => ({ ...group, lastVisitedAt: group.createdAt }));
};

// HOT 10 그룹 조회
export const getHotGroups = async (): Promise<DiscussionGroupResponse[]> => {
  return mockHotGroups.map(withMembership);
};

// 오늘 생성된 그룹 조회
export const getNewGroups = async (): Promise<DiscussionGroupResponse[]> => {
  return mockNewGroups.map(withMembership);
};

// 내 그룹 조회
export const getMyGroups = async (): Promise<DiscussionGroupResponse[]> => {
  const createdGroups = getCreatedRooms().map((entry) => entry.group);
  const createdRoomIds = new Set(createdGroups.map((group) => group.roomId));

  return [
    ...createdGroups,
    ...collectByMembership(mockMyGroups, "joined").filter(
      (group) => !createdRoomIds.has(group.roomId),
    ),
  ];
};

// 가입 신청한 그룹 조회
export const getPendingGroups = async (): Promise<DiscussionGroupResponse[]> => {
  return collectByMembership(mockPendingGroups, "pending");
};

// 책 제목, 저자, 방장 이름 기준 그룹 검색
export const searchGroups = async (keyword: string): Promise<DiscussionGroupResponse[]> => {
  const normalized = keyword.toLowerCase();

  return mockSearchableGroups
    .filter((group) =>
      [group.bookTitle, group.author, group.hostNickname].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    )
    .map(withMembership);
};

import type {
  DiscussionGroupResponse,
  GroupMembership,
} from "@/types/training/discussion/discussion";

// 참가 신청 후 방장 승인까지 걸리는 시간 가정
const MOCK_APPROVAL_DELAY_MS = 10_000;

type MembershipEntry = {
  membership: GroupMembership;
  approvedAt: number | null;
};

type CreatedRoomEntry = {
  group: DiscussionGroupResponse;
  roomTitle: string;
  inviteCode: string | null;
};

// 목 API끼리 참가·생성·방문 기록을 공유하는 메모리, 서버 연동 시 제거
const memberships = new Map<number, MembershipEntry>();
const createdRooms = new Map<number, CreatedRoomEntry>();
const visits = new Map<number, string>();

export const rememberPending = (roomId: number) =>
  memberships.set(roomId, {
    membership: "pending",
    approvedAt: Date.now() + MOCK_APPROVAL_DELAY_MS,
  });

export const rememberJoined = (roomId: number) =>
  memberships.set(roomId, { membership: "joined", approvedAt: null });

export const rememberLeft = (roomId: number) => {
  memberships.set(roomId, { membership: "none", approvedAt: null });
  createdRooms.delete(roomId);
  visits.delete(roomId);
};

export const getRememberedMembership = (roomId: number): GroupMembership | null => {
  const entry = memberships.get(roomId);
  if (!entry) return null;

  if (entry.approvedAt !== null && Date.now() >= entry.approvedAt) return "joined";

  return entry.membership;
};

export const getRememberedRoomIds = () => [...memberships.keys()];

export const rememberCreatedRoom = (entry: CreatedRoomEntry) =>
  createdRooms.set(entry.group.roomId, entry);

export const getCreatedRoom = (roomId: number) => createdRooms.get(roomId) ?? null;

export const getCreatedRooms = () => [...createdRooms.values()];

export const rememberVisit = (roomId: number) => visits.set(roomId, new Date().toISOString());

export const getRememberedVisits = () => [...visits.entries()];

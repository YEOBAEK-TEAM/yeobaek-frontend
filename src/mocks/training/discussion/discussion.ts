import { books } from "@/mocks/books";

import type {
  ActiveDiscussionResponse,
  DiscussionBaseResponse,
  DiscussionGroupResponse,
  GroupMembership,
} from "@/types/training/discussion/discussion";

const findBook = (title: string) => books.find((book) => book.title === title);

// 오늘 기준 시각 생성
const dateAt = (hours: number, minutes: number, dayOffset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hours, minutes, 0, 0);

  return date.toISOString();
};

const toBase = (
  roomId: number,
  bookTitle: string,
  hostNickname: string,
  hostProfileImageUrl: string | null,
  participantCount: number,
): DiscussionBaseResponse => {
  const book = findBook(bookTitle);

  return {
    roomId,
    bookTitle,
    author: book?.author ?? "",
    coverUrl: book?.coverUrl ?? "",
    hostNickname,
    hostProfileImageUrl,
    participantCount,
  };
};

const toGroup = (
  base: DiscussionBaseResponse,
  membership: GroupMembership,
  createdAt: string,
): DiscussionGroupResponse => ({
  ...base,
  groupId: base.roomId,
  membership,
  isHost: false,
  createdAt,
});

const shellRoom = toBase(101, "양면의 조개껍데기", "오지우", "https://i.pravatar.cc/80?img=47", 26);
const lightSpeedRoom = toBase(102, "우리가 빛의 속도로 갈 수 없다면", "한도윤", null, 14);
const lightnessRoom = toBase(
  103,
  "참을 수 없는 존재의 가벼움",
  "김승민",
  "https://i.pravatar.cc/80?img=32",
  3,
);
const contradictionRoom = toBase(104, "모순", "이서아", "https://i.pravatar.cc/80?img=12", 9);
const orbitRoom = toBase(105, "궤도", "박하람", null, 5);
const aquariumRoom = toBase(106, "수족관", "최윤슬", "https://i.pravatar.cc/80?img=5", 2);

// 상태별 확인용 목데이터
export const mockActiveDiscussionStates = {
  single: [{ ...shellRoom, lastVisitedAt: dateAt(23, 55) }],
  multiple: [
    { ...lightSpeedRoom, lastVisitedAt: dateAt(21, 10, -1) },
    { ...shellRoom, lastVisitedAt: dateAt(23, 55) },
  ],
  none: [],
} satisfies Record<string, ActiveDiscussionResponse[]>;

export const mockHotGroupStates = {
  filled: [
    toGroup(shellRoom, "joined", dateAt(9, 0, -3)),
    toGroup(lightSpeedRoom, "none", dateAt(10, 30, -2)),
    toGroup(contradictionRoom, "none", dateAt(14, 0, -5)),
  ],
  none: [],
} satisfies Record<string, DiscussionGroupResponse[]>;

export const mockNewGroupStates = {
  filled: [
    toGroup(lightnessRoom, "pending", dateAt(8, 20)),
    toGroup(orbitRoom, "none", dateAt(11, 45)),
    toGroup(aquariumRoom, "none", dateAt(13, 5)),
  ],
  none: [],
} satisfies Record<string, DiscussionGroupResponse[]>;

export const mockMyGroupStates = {
  filled: [toGroup(shellRoom, "joined", dateAt(9, 0, -3))],
  none: [],
} satisfies Record<string, DiscussionGroupResponse[]>;

export const mockPendingGroupStates = {
  waiting: [toGroup(lightnessRoom, "pending", dateAt(8, 20))],
  none: [],
} satisfies Record<string, DiscussionGroupResponse[]>;

// 목록을 바꾸면 각 상태를 바로 확인 가능
export const mockActiveDiscussions: ActiveDiscussionResponse[] = mockActiveDiscussionStates.single;

export const mockHotGroups: DiscussionGroupResponse[] = mockHotGroupStates.filled;

export const mockNewGroups: DiscussionGroupResponse[] = mockNewGroupStates.filled;

export const mockMyGroups: DiscussionGroupResponse[] = mockMyGroupStates.filled;

export const mockPendingGroups: DiscussionGroupResponse[] = mockPendingGroupStates.waiting;

export const mockSearchableGroups: DiscussionGroupResponse[] = [
  ...mockHotGroupStates.filled,
  ...mockNewGroupStates.filled,
];

import type { MyJoinStatus } from "@/types/training/discussion/room";

export type DiscussionSubTab = "recommend" | "joined" | "pending";

export type DiscussionGroupListId = "hot" | "new" | "joined" | "pending";

export type GroupMembership = "none" | "joined" | "pending";

// 메인 섹션 구분, HOT·NEW는 참여·신청·방장인 방을 서버가 제외
export type MainSectionType = "HOT" | "NEW" | "MY" | "APPLY";

export type DiscussionRoomMainResponse = {
  roomId: number;
  title: string;
  bookId: number;
  bookTitle: string;
  bookAuthor: string | null;
  bookCoverImageUrl: string | null;
  hostNickname: string;
  hostProfileImageUrl: string | null;
  // 방장 포함 승인된 멤버 수
  memberCount: number;
  myStatus: MyJoinStatus;
  // type=MY일 때만 값이 있음
  lastVisitedAt: string | null;
};

export type HostParticipantsView = {
  hostLabel: string;
  imageUrl: string | null;
  participantText: string;
};

type DiscussionBookView = {
  roomId: number;
  title: string;
  author: string;
  coverUrl: string;
  host: HostParticipantsView;
};

export type ActiveDiscussionView = DiscussionBookView & {
  // 서버에 마지막 방문 시각이 없어 값이 없으면 시계를 숨김
  lastVisitedAt: string | null;
  lastVisitedLabel: string;
};

export type GroupCardVariant = "recommend" | "joined" | "pending";

export type DiscussionGroupView = DiscussionBookView & {
  groupId: number;
  variant: GroupCardVariant;
};

export type GroupListLayout = "carousel" | "stack";

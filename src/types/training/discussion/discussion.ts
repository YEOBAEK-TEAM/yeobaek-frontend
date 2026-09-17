export type DiscussionSubTab = "recommend" | "joined" | "pending";

export type DiscussionGroupListId = "hot" | "new" | "joined" | "pending";

export type GroupMembership = "none" | "joined" | "pending";

export type DiscussionBaseResponse = {
  roomId: number;
  bookTitle: string;
  author: string;
  coverUrl: string;
  hostNickname: string;
  hostProfileImageUrl: string | null;
  // 방장 포함 전체 참여 인원
  participantCount: number;
};

export type ActiveDiscussionResponse = DiscussionBaseResponse & {
  // 마지막으로 토론방에서 나온 시각
  lastVisitedAt: string;
};

export type DiscussionGroupResponse = DiscussionBaseResponse & {
  groupId: number;
  membership: GroupMembership;
  createdAt: string;
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
  lastVisitedAt: string;
  lastVisitedLabel: string;
};

export type GroupCardVariant = "recommend" | "joined" | "pending";

export type DiscussionGroupView = DiscussionBookView & {
  groupId: number;
  variant: GroupCardVariant;
};

export type GroupListLayout = "carousel" | "stack";

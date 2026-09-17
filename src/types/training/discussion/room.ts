export type TopicType = "book" | "report";

export type DiscussionTopicResponse =
  | { type: "book"; bookId: number; bookTitle: string; author: string; coverUrl: string }
  | {
      type: "report";
      reportId: number;
      bookId: number;
      bookTitle: string;
      reportTitle: string;
      coverUrl: string;
    };

// 책이면 저자, 독후감이면 독후감 제목을 보조 텍스트로 사용
export type DiscussionTopicView = {
  key: string;
  type: TopicType;
  bookId: number;
  reportId: number | null;
  title: string;
  subtitle: string;
  coverUrl: string;
};

export type RoomVisibility = "public" | "private";

export type RoomFilter = "all" | "hot" | "recent";

export type RoomJoinStatus = "none" | "pending" | "joined" | "full" | "closed";

export type RoomErrorCode =
  | "ALREADY_REQUESTED"
  | "ROOM_FULL"
  | "ROOM_CLOSED"
  | "ROOM_NOT_FOUND"
  | "NOT_MEMBER"
  | "INVALID_CODE"
  | "EXPIRED_CODE";

export type RoomSummaryResponse = {
  roomId: number;
  roomTitle: string;
  bookTitle: string;
  author: string;
  coverUrl: string;
  // 방장 포함 전체 참여 인원
  participantCount: number;
  tags: string[];
  visibility: RoomVisibility;
  joinStatus: RoomJoinStatus;
};

export type RoomDetailResponse = RoomSummaryResponse & {
  description: string;
  hostNickname: string;
  hostProfileImageUrl: string | null;
  createdAt: string;
};

export type RoomPageResponse = {
  rooms: RoomSummaryResponse[];
  page: number;
  hasNext: boolean;
};

export type RoomListParams = {
  filter: RoomFilter;
  keyword: string;
  page: number;
};

export type RoomSummaryView = {
  roomId: number;
  title: string;
  author: string;
  coverUrl: string;
  participantText: string;
  tags: string[];
  visibilityLabel: string;
  joinStatus: RoomJoinStatus;
};

export type RoomDetailView = RoomSummaryView & {
  description: string;
  host: { nickname: string; imageUrl: string | null };
  openedLabel: string;
};

export type CreateRoomRequest = {
  topicType: TopicType;
  bookId: number;
  reportId: number | null;
  title: string;
  tags: string[];
  description: string;
  visibility: RoomVisibility;
};

export type CreateRoomResponse = {
  roomId: number;
  // 비공개방만 발급
  inviteCode: string | null;
};

export type JoinRequestResponse = {
  status: "requested" | "joined";
};

export type JoinByCodeResponse = {
  result: "entered" | "requested" | "alreadyJoined";
  roomId: number;
};

export type RoomCreateForm = {
  topic: DiscussionTopicView | null;
  title: string;
  tags: string[];
  description: string;
  visibility: RoomVisibility;
};

export type CreatedRoom = {
  roomId: number;
  inviteCode: string | null;
  title: string;
  coverUrl: string;
};

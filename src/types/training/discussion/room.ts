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

// 목록 정렬 파라미터, 필터 칩과 1:1 대응
export type RoomSort = "ALL" | "HOT" | "RECENT";

export type RoomJoinStatus = "none" | "pending" | "joined";

// 서버 참가 상태, APPROVED면 채팅 입장 가능
export type MyJoinStatus = "NONE" | "PENDING" | "APPROVED";

export type RoomErrorCode =
  | "ALREADY_REQUESTED"
  | "ROOM_FULL"
  | "ROOM_CLOSED"
  | "ROOM_NOT_FOUND"
  | "NOT_MEMBER"
  | "INVALID_CODE"
  | "EXPIRED_CODE";

export type DiscussionRoomResponse = {
  roomId: number;
  title: string;
  bookId: number;
  bookTitle: string;
  bookAuthor: string | null;
  bookCoverImageUrl: string | null;
  tags: string[];
  description: string | null;
  hostNickname: string;
  hostProfileImageUrl: string | null;
  createdAt: string;
  // 방장 포함 승인된 멤버 수
  memberCount: number;
  myStatus: MyJoinStatus;
  isPrivate: boolean;
  isHost: boolean;
};

export type PageResponse<T> = {
  items: T[];
  page: number;
  hasNext: boolean;
  totalCount: number;
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
  visibility: RoomVisibility;
  visibilityLabel: string;
  joinStatus: RoomJoinStatus;
};

export type RoomDetailView = RoomSummaryView & {
  description: string;
  host: { nickname: string; imageUrl: string | null };
  openedLabel: string;
};

export type DiscussionRoomCreateRequest = {
  bookId: number;
  // 내가 읽지 않은 책이면 다른 사람의 공개 독후감으로 생성
  reviewId?: number;
  title: string;
  tags: string[];
  description: string;
  isPrivate: boolean;
};

export type DiscussionRoomCreateResponse = {
  room: DiscussionRoomResponse;
  bookTitle: string;
  inviteCode: string | null;
};

export type DiscussionRoomJoinResponse = {
  roomId: number;
  status: MyJoinStatus;
  appliedAt: string | null;
};

export type DiscussionRoomInviteCodeResponse = {
  roomId: number;
  inviteCode: string;
};

export type DiscussionRoomApplicantResponse = {
  memberId: number;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  appliedAt: string;
};

export type ApplicantPageResponse = PageResponse<DiscussionRoomApplicantResponse>;

export type ApplicantView = {
  memberId: number;
  nickname: string;
  imageUrl: string | null;
  appliedLabel: string;
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

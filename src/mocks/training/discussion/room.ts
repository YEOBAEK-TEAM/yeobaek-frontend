import { books } from "@/mocks/books";

import type {
  DiscussionTopicResponse,
  JoinByCodeResponse,
  RoomDetailResponse,
  RoomErrorCode,
  RoomJoinStatus,
  RoomVisibility,
} from "@/types/training/discussion/room";

const findBook = (title: string) => books.find((book) => book.title === title);

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return date.toISOString();
};

type RoomSeed = {
  roomId: number;
  bookTitle: string;
  roomTitle: string;
  tags: string[];
  participantCount: number;
  visibility: RoomVisibility;
  joinStatus: RoomJoinStatus;
  hostNickname: string;
  hostProfileImageUrl: string | null;
  description: string;
  openedDaysAgo: number;
};

const toRoom = (seed: RoomSeed): RoomDetailResponse => {
  const book = findBook(seed.bookTitle);

  return {
    roomId: seed.roomId,
    roomTitle: seed.roomTitle,
    bookTitle: seed.bookTitle,
    author: book?.author ?? "",
    coverUrl: book?.coverUrl ?? "",
    participantCount: seed.participantCount,
    tags: seed.tags,
    visibility: seed.visibility,
    joinStatus: seed.joinStatus,
    description: seed.description,
    hostNickname: seed.hostNickname,
    hostProfileImageUrl: seed.hostProfileImageUrl,
    createdAt: daysAgo(seed.openedDaysAgo),
  };
};

const ROOM_SEEDS: RoomSeed[] = [
  {
    roomId: 101,
    bookTitle: "양면의 조개껍데기",
    roomTitle: "조개껍데기 안쪽의 이야기",
    tags: ["SF", "감성적인", "천천히"],
    participantCount: 26,
    visibility: "public",
    joinStatus: "joined",
    hostNickname: "오지우",
    hostProfileImageUrl: "https://i.pravatar.cc/120?img=47",
    description: "양면의 조개껍데기를 읽고 인상 깊었던 장면을 나눠요.",
    openedDaysAgo: 3,
  },
  {
    roomId: 102,
    bookTitle: "우리가 빛의 속도로 갈 수 없다면",
    roomTitle: "우리가 빛의 속도로 고속도로",
    tags: ["친화적", "일상적인", "SF", "김초엽", "입문"],
    participantCount: 14,
    visibility: "public",
    joinStatus: "none",
    hostNickname: "한도윤",
    hostProfileImageUrl: null,
    description: "처음 SF를 읽어보는 분들도 편하게 들어오세요.",
    openedDaysAgo: 2,
  },
  {
    roomId: 103,
    bookTitle: "참을 수 없는 존재의 가벼움",
    roomTitle: "가벼움과 무거움 사이",
    tags: ["철학", "진지한"],
    participantCount: 3,
    visibility: "private",
    joinStatus: "pending",
    hostNickname: "김승민",
    hostProfileImageUrl: "https://i.pravatar.cc/120?img=32",
    description: "영원회귀와 선택에 대해 깊게 이야기해요.",
    openedDaysAgo: 0,
  },
  {
    roomId: 104,
    bookTitle: "모순",
    roomTitle: "모순 속 선택하지 않은 삶",
    tags: ["일상적인", "공감"],
    participantCount: 9,
    visibility: "public",
    joinStatus: "none",
    hostNickname: "이서아",
    hostProfileImageUrl: "https://i.pravatar.cc/120?img=12",
    description: "안진진의 선택에 공감했는지 이야기 나눠요.",
    openedDaysAgo: 5,
  },
  {
    roomId: 107,
    bookTitle: "투명한 나선",
    roomTitle: "투명한 나선 나선환",
    tags: ["친화적", "일상적인", "나루토"],
    participantCount: 12,
    visibility: "public",
    joinStatus: "none",
    hostNickname: "바계지루",
    hostProfileImageUrl: "https://i.pravatar.cc/120?img=5",
    description:
      "나선수리검 나루토를 체험하고 싶은\n사람들을 위한 편하고 자유롭게 이야기 하는\n방이에요",
    openedDaysAgo: 10,
  },
  {
    roomId: 108,
    bookTitle: "급류",
    roomTitle: "급류의 류라이에 대해서 토론해봐요!",
    tags: ["로맨스", "몰입"],
    participantCount: 30,
    visibility: "public",
    joinStatus: "full",
    hostNickname: "정하윤",
    hostProfileImageUrl: null,
    description: "도담과 해솔의 관계를 중심으로 이야기해요.",
    openedDaysAgo: 1,
  },
  {
    roomId: 109,
    bookTitle: "어린 왕자",
    roomTitle: "어른이 되어 다시 읽는 어린 왕자",
    tags: ["고전", "잔잔한", "추억"],
    participantCount: 7,
    visibility: "public",
    joinStatus: "closed",
    hostNickname: "윤서진",
    hostProfileImageUrl: "https://i.pravatar.cc/120?img=20",
    description: "어릴 때와 지금 달라진 감상을 나눠요.",
    openedDaysAgo: 20,
  },
  {
    roomId: 105,
    bookTitle: "궤도",
    roomTitle: "궤도를 도는 마음들",
    tags: ["감성적인", "우주"],
    participantCount: 5,
    visibility: "public",
    joinStatus: "none",
    hostNickname: "박하람",
    hostProfileImageUrl: null,
    description: "각자의 궤도를 도는 인물들에 대해 이야기해요.",
    openedDaysAgo: 4,
  },
  {
    roomId: 106,
    bookTitle: "수족관",
    roomTitle: "수족관 유리 너머의 시선",
    tags: ["잔잔한", "관계"],
    participantCount: 2,
    visibility: "private",
    joinStatus: "none",
    hostNickname: "최윤슬",
    hostProfileImageUrl: "https://i.pravatar.cc/120?img=5",
    description: "작은 모임으로 천천히 한 챕터씩 읽어요.",
    openedDaysAgo: 0,
  },
];

// 무한 스크롤 확인용으로 시드를 반복해 목록 확장
const buildRooms = (): RoomDetailResponse[] =>
  [0, 1, 2].flatMap((round) =>
    ROOM_SEEDS.map((seed) =>
      toRoom({
        ...seed,
        roomId: seed.roomId + round * 100,
        joinStatus: round === 0 ? seed.joinStatus : "none",
        participantCount: Math.max(seed.participantCount - round * 2, 2),
        openedDaysAgo: seed.openedDaysAgo + round * 7,
      }),
    ),
  );

const toBookTopic = (title: string, author: string): DiscussionTopicResponse => {
  const book = findBook(title);

  return {
    type: "book",
    bookId: book?.id ?? 0,
    bookTitle: title,
    author,
    coverUrl: book?.coverUrl ?? "",
  };
};

const toReportTopic = (
  reportId: number,
  title: string,
  reportTitle: string,
): DiscussionTopicResponse => {
  const book = findBook(title);

  return {
    type: "report",
    reportId,
    bookId: book?.id ?? 0,
    bookTitle: title,
    reportTitle,
    coverUrl: book?.coverUrl ?? "",
  };
};

// 상태별 확인용 목데이터
export const mockTopicStates = {
  filled: [
    toBookTopic("투명한 나선", "히가시노 게이고 · 김선영(옮긴이)"),
    toBookTopic("우리가 빛의 속도로 갈 수 없다면", "김초엽"),
    toReportTopic(11, "급류", "급류는 류라이 ㅇㅈㄹ"),
    toBookTopic("양면의 조개껍데기", "김초엽"),
    toReportTopic(12, "모순", "선택하지 않은 삶은 어디로 가는가"),
  ],
  none: [],
} satisfies Record<string, DiscussionTopicResponse[]>;

export const mockRoomStates = {
  filled: buildRooms(),
  none: [],
} satisfies Record<string, RoomDetailResponse[]>;

// 목록을 바꾸면 각 상태를 바로 확인 가능
export const mockTopics: DiscussionTopicResponse[] = mockTopicStates.filled;

export const mockRooms: RoomDetailResponse[] = mockRoomStates.filled;

// 모든 방의 참가 상태를 한 번에 바꿔 확인, null이면 방별 기본 상태
export const mockJoinStatusOverride: RoomJoinStatus | null = null;

// 참가 신청 실패 확인용, null이면 성공
export const mockJoinRequestError: RoomErrorCode | null = null;

// 코드별 입장 결과, 목록에 없는 코드는 잘못된 코드
export const mockJoinCodeResults: Record<string, JoinByCodeResponse | RoomErrorCode> = {
  ABC123: { result: "entered", roomId: 107 },
  PRIVATE1: { result: "entered", roomId: 103 },
  JOINED1: { result: "alreadyJoined", roomId: 101 },
  FULL123: "ROOM_FULL",
  EXPIRED1: "EXPIRED_CODE",
};

export const MOCK_CREATED_INVITE_CODE = "ABCDE12";

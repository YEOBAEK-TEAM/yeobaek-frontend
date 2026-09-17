import {
  getRememberedMembership,
  rememberCreatedRoom,
  rememberJoined,
  rememberPending,
} from "@/api/training/discussion/mockDiscussionMemory";
import {
  MOCK_CREATED_INVITE_CODE,
  mockJoinCodeResults,
  mockJoinRequestError,
  mockJoinStatusOverride,
  mockRooms,
  mockTopics,
} from "@/mocks/training/discussion/room";
import { books } from "@/mocks/books";
import { myProfile } from "@/mocks/my";

import type {
  CreateRoomRequest,
  CreateRoomResponse,
  DiscussionTopicResponse,
  JoinByCodeResponse,
  JoinRequestResponse,
  RoomDetailResponse,
  RoomErrorCode,
  RoomJoinStatus,
  RoomListParams,
  RoomPageResponse,
} from "@/types/training/discussion/room";

const PAGE_SIZE = 8;

const HOT_LIMIT = 10;

const MOCK_DELAY_MS = 500;

export class RoomApiError extends Error {
  code: RoomErrorCode;

  constructor(code: RoomErrorCode) {
    super(code);
    this.name = "RoomApiError";
    this.code = code;
  }
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

let createdRoomSequence = 900;

const toJoinStatus = (room: RoomDetailResponse): RoomJoinStatus => {
  const remembered = getRememberedMembership(room.roomId);

  return remembered && remembered !== "none" ? remembered : room.joinStatus;
};

const withJoinStatus = (room: RoomDetailResponse): RoomDetailResponse => ({
  ...room,
  joinStatus: mockJoinStatusOverride ?? toJoinStatus(room),
});

const includesKeyword = (values: string[], keyword: string) => {
  const normalized = keyword.toLowerCase();

  return values.some((value) => value.toLowerCase().includes(normalized));
};

// 주제 선택용 내 책·독후감 조회
export const getDiscussionTopics = async (keyword: string): Promise<DiscussionTopicResponse[]> => {
  if (!keyword) return mockTopics;

  return mockTopics.filter((topic) =>
    includesKeyword(
      [topic.bookTitle, topic.type === "book" ? topic.author : topic.reportTitle],
      keyword,
    ),
  );
};

// 토론방 목록 조회
export const getRooms = async ({
  filter,
  keyword,
  page,
}: RoomListParams): Promise<RoomPageResponse> => {
  await wait(300);

  const matched = keyword
    ? mockRooms.filter((room) =>
        includesKeyword([room.roomTitle, room.bookTitle, ...room.tags], keyword),
      )
    : mockRooms;

  const sorted =
    filter === "hot"
      ? [...matched].sort((a, b) => b.participantCount - a.participantCount).slice(0, HOT_LIMIT)
      : filter === "recent"
        ? [...matched].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        : matched;

  const start = page * PAGE_SIZE;

  return {
    rooms: sorted.slice(start, start + PAGE_SIZE).map(withJoinStatus),
    page,
    hasNext: start + PAGE_SIZE < sorted.length,
  };
};

// 토론방 상세 조회
export const getRoomDetail = async (roomId: number): Promise<RoomDetailResponse> => {
  await wait(300);

  const room = mockRooms.find((item) => item.roomId === roomId);
  if (!room) throw new RoomApiError("ROOM_NOT_FOUND");

  return withJoinStatus(room);
};

// 토론방 생성
export const createRoom = async (request: CreateRoomRequest): Promise<CreateRoomResponse> => {
  await wait(MOCK_DELAY_MS);

  createdRoomSequence += 1;

  const roomId = createdRoomSequence;
  const inviteCode = request.visibility === "private" ? MOCK_CREATED_INVITE_CODE : null;
  const book = books.find((item) => item.id === request.bookId);

  rememberCreatedRoom({
    roomTitle: request.title,
    inviteCode,
    group: {
      roomId,
      groupId: roomId,
      bookTitle: book?.title ?? "",
      author: book?.author ?? "",
      coverUrl: book?.coverUrl ?? "",
      hostNickname: myProfile.nickname,
      hostProfileImageUrl: null,
      participantCount: 1,
      membership: "joined",
      isHost: true,
      createdAt: new Date().toISOString(),
    },
  });

  return { roomId, inviteCode };
};

// 토론방 참가 신청
export const requestJoinRoom = async (roomId: number): Promise<JoinRequestResponse> => {
  await wait(MOCK_DELAY_MS);

  if (mockJoinRequestError) throw new RoomApiError(mockJoinRequestError);

  const room = await getRoomDetail(roomId);

  if (room.joinStatus === "joined") return { status: "joined" };
  if (room.joinStatus === "pending") throw new RoomApiError("ALREADY_REQUESTED");
  if (room.joinStatus === "full") throw new RoomApiError("ROOM_FULL");
  if (room.joinStatus === "closed") throw new RoomApiError("ROOM_CLOSED");

  rememberPending(roomId);

  return { status: "requested" };
};

// 초대코드 검증 후 입장 또는 참가 신청
export const joinRoomByCode = async (code: string): Promise<JoinByCodeResponse> => {
  await wait(MOCK_DELAY_MS);

  const result = mockJoinCodeResults[code];

  if (!result) throw new RoomApiError("INVALID_CODE");
  if (typeof result === "string") throw new RoomApiError(result);

  if (result.result === "requested") rememberPending(result.roomId);
  else rememberJoined(result.roomId);

  return result;
};

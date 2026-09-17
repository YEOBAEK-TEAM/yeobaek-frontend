import {
  getCreatedRoom,
  getRememberedMembership,
  rememberLeft,
} from "@/api/training/discussion/mockDiscussionMemory";
import { RoomApiError } from "@/api/training/discussion/room";
import { broadcastMockRoomEvent } from "@/api/training/discussion/socket/mockRoomSocketTransport";
import { ROOM_CHAT_PAGE_SIZE } from "@/constants/training/discussion/roomChat";
import { mockRooms } from "@/mocks/training/discussion/room";
import {
  buildCreatedRoomTimeline,
  buildMockRoomTimeline,
  getMockHostId,
  MOCK_MY_USER_ID,
  MOCK_ROOM_INVITE_CODE,
  mockRoomSessionError,
  mockViewAsHost,
} from "@/mocks/training/discussion/roomChat";

import type {
  RoomChatSessionResponse,
  RoomMemberTarget,
  RoomMessagePageResponse,
  RoomTimelineMessage,
} from "@/types/training/discussion/roomChat";

const MOCK_DELAY_MS = 300;

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const findRoom = (roomId: number) => mockRooms.find((room) => room.roomId === roomId);

const getTimeline = (roomId: number): RoomTimelineMessage[] => {
  if (getCreatedRoom(roomId)) return buildCreatedRoomTimeline(roomId);

  const room = findRoom(roomId);
  return room ? buildMockRoomTimeline(roomId, room.hostNickname, mockViewAsHost).messages : [];
};

// 토론방 입장 정보 조회, 멤버가 아니면 입장 불가
export const getRoomChatSession = async (roomId: number): Promise<RoomChatSessionResponse> => {
  await wait(MOCK_DELAY_MS);

  if (mockRoomSessionError) throw new RoomApiError(mockRoomSessionError);

  const created = getCreatedRoom(roomId);

  if (created) {
    return {
      roomId,
      roomTitle: created.roomTitle,
      hostId: MOCK_MY_USER_ID,
      myUserId: MOCK_MY_USER_ID,
      inviteCode: created.inviteCode,
      lastReadMessageId: null,
    };
  }

  const room = findRoom(roomId);
  if (!room) throw new RoomApiError("ROOM_CLOSED");

  const membership = getRememberedMembership(roomId) ?? room.joinStatus;
  if (membership !== "joined" && !mockViewAsHost) throw new RoomApiError("NOT_MEMBER");

  return {
    roomId,
    roomTitle: room.roomTitle,
    hostId: mockViewAsHost ? MOCK_MY_USER_ID : getMockHostId(roomId),
    myUserId: MOCK_MY_USER_ID,
    inviteCode: mockViewAsHost ? MOCK_ROOM_INVITE_CODE : null,
    lastReadMessageId: buildMockRoomTimeline(roomId, room.hostNickname, mockViewAsHost)
      .lastReadMessageId,
  };
};

// 최근 메시지부터 페이지 단위 조회, cursor 이전 메시지를 이어서 조회
export const getRoomMessages = async (
  roomId: number,
  cursor: string | null,
): Promise<RoomMessagePageResponse> => {
  await wait(MOCK_DELAY_MS);

  const messages = getTimeline(roomId);
  const cursorIndex = cursor ? messages.findIndex((message) => message.messageId === cursor) : -1;
  const end = cursorIndex >= 0 ? cursorIndex : messages.length;
  const start = Math.max(end - ROOM_CHAT_PAGE_SIZE, 0);

  return {
    messages: messages.slice(start, end),
    nextCursor: start > 0 ? messages[start].messageId : null,
  };
};

// 토론방 영구 나가기, 방장이면 방 삭제
export const leaveRoom = async (roomId: number): Promise<void> => {
  await wait(MOCK_DELAY_MS);

  rememberLeft(roomId);
};

// 방장 권한으로 참여자 퇴출
export const kickRoomMember = async ({
  roomId,
  member,
}: {
  roomId: number;
  member: RoomMemberTarget;
}): Promise<void> => {
  await wait(MOCK_DELAY_MS);

  broadcastMockRoomEvent(roomId, {
    type: "message:new",
    message: {
      type: "memberKicked",
      messageId: `m-${roomId}-kick-${Date.now()}`,
      sentAt: new Date().toISOString(),
      memberId: member.memberId,
      nickname: member.nickname,
    },
  });
};

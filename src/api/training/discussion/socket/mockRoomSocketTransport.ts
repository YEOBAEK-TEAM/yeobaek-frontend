import { rememberVisit } from "@/api/training/discussion/mockDiscussionMemory";
import { myProfile } from "@/mocks/my";
import { mockRooms } from "@/mocks/training/discussion/room";
import {
  getMockRoomMembers,
  MOCK_CHATTER_LINES,
  MOCK_MY_USER_ID,
  mockRoomEndScenario,
} from "@/mocks/training/discussion/roomChat";

import type { ChatConnectionStatus } from "@/types/training/chatSocket";
import type {
  RoomClientEvent,
  RoomServerEvent,
  RoomSocketListener,
  RoomSocketTransport,
} from "@/types/training/discussion/roomChat";

const CONNECT_DELAY_MS = 400;

const ACK_DELAY_MS = 250;

const CHATTER_INTERVAL_MS = 9_000;

const END_SCENARIO_DELAY_MS = 6_000;

// 방별로 열려 있는 목 연결, 서버 브로드캐스트 흉내용
const openRooms = new Map<number, Set<(event: RoomServerEvent) => void>>();

export const broadcastMockRoomEvent = (roomId: number, event: RoomServerEvent) =>
  openRooms.get(roomId)?.forEach((deliver) => deliver(event));

// 서버 없이 다른 참여자 대화와 전송 확인을 재현하는 목 구현체
export const createMockRoomSocketTransport = (): RoomSocketTransport => {
  const listeners = new Set<RoomSocketListener>();
  const timers = new Set<number>();

  let currentRoomId: number | null = null;

  const emit: RoomSocketListener = (signal) => listeners.forEach((listener) => listener(signal));

  const setStatus = (status: ChatConnectionStatus) => emit({ type: "status", status });

  const deliver = (event: RoomServerEvent) => emit({ type: "event", event });

  const later = (run: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      run();
    }, delay);

    timers.add(timer);
  };

  const startChatter = (roomId: number) => {
    // 방금 만든 방은 다른 참여자가 없어 대화 흉내 생략
    const room = mockRooms.find((item) => item.roomId === roomId);
    if (!room) return;

    const members = getMockRoomMembers(room.hostNickname);

    MOCK_CHATTER_LINES.forEach((text, index) => {
      const member = members[index % members.length];

      later(
        () =>
          deliver({
            type: "message:new",
            message: {
              type: "chat",
              messageId: `m-${roomId}-live-${Date.now()}`,
              sentAt: new Date().toISOString(),
              senderId: member.memberId,
              senderNickname: member.nickname,
              senderProfileImageUrl: null,
              text,
            },
          }),
        CHATTER_INTERVAL_MS * (index + 1),
      );
    });
  };

  const startEndScenario = () => {
    if (mockRoomEndScenario === "none") return;

    later(
      () => deliver({ type: mockRoomEndScenario === "kicked" ? "member:kickedMe" : "room:closed" }),
      END_SCENARIO_DELAY_MS,
    );
  };

  const leaveOpenRoom = () => {
    if (currentRoomId === null) return;
    openRooms.get(currentRoomId)?.delete(deliver);
  };

  return {
    connect(roomId) {
      currentRoomId = roomId;
      setStatus("connecting");

      later(() => {
        if (!openRooms.has(roomId)) openRooms.set(roomId, new Set());
        openRooms.get(roomId)?.add(deliver);

        setStatus("open");
        deliver({ type: "room:joined" });
        startChatter(roomId);
        startEndScenario();
      }, CONNECT_DELAY_MS);
    },

    disconnect() {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      leaveOpenRoom();
      setStatus("closed");
    },

    send(event: RoomClientEvent) {
      if (event.type === "room:leave") {
        if (currentRoomId !== null) rememberVisit(currentRoomId);
        return;
      }

      if (event.type !== "message:send" || currentRoomId === null) return;

      const roomId = currentRoomId;

      later(
        () =>
          deliver({
            type: "message:ack",
            clientMessageId: event.clientMessageId,
            message: {
              type: "chat",
              messageId: `m-${roomId}-mine-${Date.now()}`,
              sentAt: new Date().toISOString(),
              senderId: MOCK_MY_USER_ID,
              senderNickname: myProfile.nickname,
              senderProfileImageUrl: null,
              text: event.text,
            },
          }),
        ACK_DELAY_MS,
      );
    },

    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
};

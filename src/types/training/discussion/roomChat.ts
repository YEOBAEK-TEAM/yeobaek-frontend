import type { ChatMessageStatus } from "@/types/training/chat";
import type { ChatConnectionStatus } from "@/types/training/chatSocket";

export type RoomChatSessionResponse = {
  roomId: number;
  roomTitle: string;
  hostId: number;
  myUserId: number;
  inviteCode: string | null;
  // 이 메시지까지 읽음, 처음 입장이면 null
  lastReadMessageId: string | null;
};

type RoomMessageBase = {
  messageId: string;
  sentAt: string;
};

export type RoomMessageResponse = RoomMessageBase &
  (
    | {
        type: "chat";
        senderId: number;
        senderNickname: string;
        senderProfileImageUrl: string | null;
        text: string;
      }
    | { type: "roomCreated" }
    | { type: "memberJoined" | "memberLeft" | "memberKicked"; memberId: number; nickname: string }
  );

// 내가 보낸 메시지의 전송 상태를 함께 담는 캐시 메시지
export type RoomTimelineMessage = RoomMessageResponse & {
  clientMessageId?: string;
  status?: ChatMessageStatus;
};

export type RoomMessagePageResponse = {
  messages: RoomTimelineMessage[];
  nextCursor: string | null;
};

export type RoomServerEvent =
  | { type: "room:joined" }
  | { type: "message:new"; message: RoomMessageResponse }
  | { type: "message:ack"; clientMessageId: string; message: RoomMessageResponse }
  | { type: "member:kickedMe" }
  | { type: "room:closed" }
  | { type: "error"; message: string };

export type RoomClientEvent =
  | { type: "room:join"; roomId: number; afterMessageId: string | null }
  | { type: "message:send"; clientMessageId: string; text: string }
  | { type: "room:leave" };

export type RoomSocketSignal =
  { type: "status"; status: ChatConnectionStatus } | { type: "event"; event: RoomServerEvent };

export type RoomSocketListener = (signal: RoomSocketSignal) => void;

// 토론방 소켓 전송 계층 추상화
export interface RoomSocketTransport {
  connect(roomId: number, afterMessageId: string | null): void;
  disconnect(): void;
  send(event: RoomClientEvent): void;
  subscribe(listener: RoomSocketListener): () => void;
}

export type RoomEndReason = "kicked" | "closed";

export type RoomChatRow =
  | { kind: "notice"; id: string; text: string }
  | {
      kind: "mine";
      id: string;
      clientMessageId: string;
      text: string;
      status: ChatMessageStatus;
    }
  | {
      kind: "member";
      id: string;
      memberId: number;
      nickname: string;
      label: string;
      imageUrl: string | null;
      text: string;
      // 같은 사람이 연달아 보내면 첫 메시지에만 프로필 표시
      showProfile: boolean;
      canKick: boolean;
    }
  | { kind: "divider"; id: string };

export type RoomMemberTarget = {
  memberId: number;
  nickname: string;
};

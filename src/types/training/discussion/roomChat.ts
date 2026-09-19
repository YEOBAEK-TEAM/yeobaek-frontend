import type { ChatMessageStatus } from "@/types/training/chat";
import type { ChatConnectionStatus } from "@/types/training/chatSocket";

// KICKED는 userId가 강퇴된 사람, ROOM_DELETED는 방 삭제 안내
export type ChatMessageType = "TALK" | "ENTER" | "KICKED" | "ROOM_DELETED";

export type ChatMessageResponse = {
  messageId: number;
  roomId: number;
  roomTitle: string;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  content: string;
  messageType: ChatMessageType;
  createdAt: string;
  isHost: boolean;
};

export type ChatCursor = {
  createdAt: string;
  messageId: number;
};

export type ChatHistoryResponse = {
  items: ChatMessageResponse[];
  hasNext: boolean;
  nextCursor: ChatCursor | null;
  totalCount: number;
  // 이 시각 이후 메시지가 안읽음, 한 번도 읽지 않았으면 null
  lastReadAt: string | null;
};

// 방 상세와 로그인 정보로 조립한 채팅 화면 정보
export type RoomChatSession = {
  roomId: number;
  roomTitle: string;
  isHost: boolean;
  myUserId: number;
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
        senderIsHost: boolean;
        text: string;
      }
    | { type: "memberJoined" | "memberKicked"; memberId: number; nickname: string }
    | { type: "roomDeleted" }
  );

// 내가 보낸 메시지의 전송 상태를 함께 담는 캐시 메시지
export type RoomTimelineMessage = RoomMessageResponse & {
  clientMessageId?: string;
  status?: ChatMessageStatus;
};

export type RoomMessagePageResponse = {
  messages: RoomTimelineMessage[];
  nextCursor: ChatCursor | null;
  lastReadAt: string | null;
};

export type RoomServerEvent =
  // 개인 알림 큐 수신, 참여 상태가 바뀐 시점
  | { type: "room:joined" }
  | { type: "message:new"; message: RoomMessageResponse }
  | { type: "error"; message: string };

// 서버가 보낸 사람 정보를 붙여 돌려주므로 본문만 전송
export type RoomClientEvent = { type: "message:send"; clientMessageId: string; text: string };

export type RoomSocketSignal =
  { type: "status"; status: ChatConnectionStatus } | { type: "event"; event: RoomServerEvent };

export type RoomSocketListener = (signal: RoomSocketSignal) => void;

// 토론방 소켓 전송 계층 추상화
export interface RoomSocketTransport {
  connect(roomId: number): void;
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

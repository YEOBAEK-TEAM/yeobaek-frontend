import {
  getMemberJoinedNotice,
  getMemberKickedNotice,
  HOST_NAME_SUFFIX,
  ROOM_DELETED_NOTICE,
} from "@/constants/training/discussion/roomChat";

import type {
  RoomChatRow,
  RoomChatSession,
  RoomTimelineMessage,
} from "@/types/training/discussion/roomChat";

type RowContext = {
  session: RoomChatSession;
  dividerAfterId: string | null;
};

const toNoticeText = (
  message: Exclude<RoomTimelineMessage, { type: "chat" }>,
  { session }: RowContext,
) => {
  switch (message.type) {
    case "memberJoined":
      return getMemberJoinedNotice(
        message.nickname,
        message.memberId === session.myUserId && !session.isHost,
      );
    case "memberKicked":
      return getMemberKickedNotice(message.nickname);
    case "roomDeleted":
      return ROOM_DELETED_NOTICE;
  }
};

// 서버 메시지를 말풍선·안내·읽음 구분선 행으로 변환
export const toRoomChatRows = (messages: RoomTimelineMessage[], context: RowContext) => {
  const { session, dividerAfterId } = context;

  const rows: RoomChatRow[] = [];
  let previousSenderId: number | null = null;

  messages.forEach((message) => {
    if (message.type !== "chat") {
      rows.push({ kind: "notice", id: message.messageId, text: toNoticeText(message, context) });
      previousSenderId = null;
    } else if (message.senderId === session.myUserId) {
      rows.push({
        kind: "mine",
        id: message.messageId,
        clientMessageId: message.clientMessageId ?? message.messageId,
        text: message.text,
        status: message.status ?? "sent",
      });
      previousSenderId = message.senderId;
    } else {
      rows.push({
        kind: "member",
        id: message.messageId,
        memberId: message.senderId,
        nickname: message.senderNickname,
        label: `${message.senderNickname}${message.senderIsHost ? HOST_NAME_SUFFIX : ""}`,
        imageUrl: message.senderProfileImageUrl,
        text: message.text,
        showProfile: previousSenderId !== message.senderId,
        canKick: session.isHost && !message.senderIsHost,
      });
      previousSenderId = message.senderId;
    }

    if (message.messageId === dividerAfterId) {
      rows.push({ kind: "divider", id: `divider-${message.messageId}` });
      previousSenderId = null;
    }
  });

  return rows;
};

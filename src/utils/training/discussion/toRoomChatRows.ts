import {
  getMemberJoinedNotice,
  getMemberKickedNotice,
  getMemberLeftNotice,
  getRoomCreatedNotice,
  HOST_NAME_SUFFIX,
} from "@/constants/training/discussion/roomChat";

import type {
  RoomChatRow,
  RoomChatSessionResponse,
  RoomTimelineMessage,
} from "@/types/training/discussion/roomChat";

type RowContext = {
  session: RoomChatSessionResponse;
  dividerAfterId: string | null;
};

const toNoticeText = (
  message: Exclude<RoomTimelineMessage, { type: "chat" }>,
  { session }: RowContext,
) => {
  const isHost = session.myUserId === session.hostId;

  switch (message.type) {
    case "roomCreated":
      return getRoomCreatedNotice(session.roomTitle);
    case "memberJoined":
      return getMemberJoinedNotice(
        message.nickname,
        message.memberId === session.myUserId && !isHost,
      );
    case "memberLeft":
      return getMemberLeftNotice(message.nickname);
    case "memberKicked":
      return getMemberKickedNotice(message.nickname);
  }
};

// 서버 메시지를 말풍선·안내·읽음 구분선 행으로 변환
export const toRoomChatRows = (messages: RoomTimelineMessage[], context: RowContext) => {
  const { session, dividerAfterId } = context;
  const isHost = session.myUserId === session.hostId;

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
      const isSenderHost = message.senderId === session.hostId;

      rows.push({
        kind: "member",
        id: message.messageId,
        memberId: message.senderId,
        nickname: message.senderNickname,
        label: `${message.senderNickname}${isSenderHost ? HOST_NAME_SUFFIX : ""}`,
        imageUrl: message.senderProfileImageUrl,
        text: message.text,
        showProfile: previousSenderId !== message.senderId,
        canKick: isHost && !isSenderHost,
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

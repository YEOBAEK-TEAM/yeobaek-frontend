import type {
  ChatMessageResponse,
  RoomMessageResponse,
} from "@/types/training/discussion/roomChat";

// 히스토리 응답과 소켓 브로드캐스트가 같은 구조라 변환도 한 곳에서 처리
export const toRoomMessage = (item: ChatMessageResponse): RoomMessageResponse => {
  const base = { messageId: String(item.messageId), sentAt: item.createdAt };

  switch (item.messageType) {
    case "ENTER":
      return { ...base, type: "memberJoined", memberId: item.userId, nickname: item.nickname };

    // 강퇴 안내의 userId는 강퇴된 사람
    case "KICKED":
      return { ...base, type: "memberKicked", memberId: item.userId, nickname: item.nickname };

    case "ROOM_DELETED":
      return { ...base, type: "roomDeleted" };

    default:
      return {
        ...base,
        type: "chat",
        senderId: item.userId,
        senderNickname: item.nickname,
        senderProfileImageUrl: item.profileImageUrl,
        senderIsHost: item.isHost,
        text: item.content,
      };
  }
};

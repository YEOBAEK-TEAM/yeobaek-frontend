export type ChatMessageStatus = "sending" | "sent" | "failed";

export type ChatQuickReply = {
  id: string;
  label: string;
  // 화살표가 붙는 링크형 버튼 여부
  link?: boolean;
};

export type ChatTextMessage = {
  id: string;
  role: "riti" | "user";
  kind: "text";
  text: string;
  streaming?: boolean;
  status?: ChatMessageStatus;
  // 서버 타임스탬프, 정렬 기준
  sentAt?: string;
  // 아바타 숨김 여부
  hideAvatar?: boolean;
};

// 두 훈련 채팅이 공유하는 메시지 종류
export type ChatBaseMessage =
  | ChatTextMessage
  | { id: string; role: "riti"; kind: "loading" }
  | {
      id: string;
      role: "riti";
      kind: "quickReplies";
      replies: ChatQuickReply[];
      direction?: "row" | "column";
    }
  | { id: string; role: "system"; kind: "system"; text: string };

import { josa } from "@/utils/training/josa";

import type { RoomEndReason } from "@/types/training/discussion/roomChat";

export const ROOM_CHAT_PAGE_SIZE = 30;

export const UNREAD_DIVIDER_TEXT = "여기까지 읽으셨습니다";

export const HOST_NAME_SUFFIX = "(방장)";

export const ROOM_HEADER_LABEL = {
  inviteCode: "초대코드 보기",
  leave: "토론방 나가기",
  back: "뒤로가기",
};

export const MEMBER_MENU_LABEL = {
  open: (nickname: string) => `${nickname}님 관리 메뉴`,
  kick: "퇴출하기",
};

export const MESSAGE_FAILED_LABEL = "전송 실패, 다시 보내기";

export const INVITE_CODE_MODAL = {
  label: "초대코드",
  copyLabel: "초대코드 복사",
  copiedText: "초대코드를 복사했어요",
  copyFailedText: "복사하지 못했어요. 코드를 길게 눌러 복사해 주세요",
};

export const ROOM_END_MESSAGE: Record<RoomEndReason, string> = {
  kicked: "방장에 의해 퇴장되었어요",
  closed: "토론방이 종료되었어요",
};

export const ROOM_CHAT_LOAD_ERROR = "토론방을 불러오지 못했어요";

const withQuotes = (title: string) => `“${title}”`;

export const getRoomCreatedNotice = (title: string) =>
  `${withQuotes(title)}${josa(title, "이", "가")} 개설되었습니다. 사람들을 초대해서 자유로운 토론을 즐겨주세요`;

// 방장이 아닌 본인 입장에만 규칙 안내 추가
export const getMemberJoinedNotice = (nickname: string, withRule: boolean) =>
  `${nickname}님이 방에 입장하셨습니다. 자유롭게 토론을 나눠주세요${
    withRule ? ". 방 규칙을 지키지 않을 시 방장권한으로 강제퇴장이 가능합니다." : ""
  }`;

export const getMemberLeftNotice = (nickname: string) => `${nickname}님이 방을 나갔습니다`;

export const getMemberKickedNotice = (nickname: string) =>
  `${nickname}님이 방장에 의해 퇴장되었습니다`;

export const getLeaveConfirmMessage = (title: string, isHost: boolean) =>
  `${withQuotes(title)}${josa(title, "을", "를")} 영원히 나가시겠습니까?${
    isHost ? "\n방장이 나갈경우 이 방은 사라집니다" : ""
  }`;

export const getKickConfirmMessage = (nickname: string) => `${nickname}님을 퇴출하시겠습니까?`;

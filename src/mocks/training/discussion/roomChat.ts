import { myProfile } from "@/mocks/my";

import type { RoomErrorCode } from "@/types/training/discussion/room";
import type { RoomTimelineMessage } from "@/types/training/discussion/roomChat";

export const MOCK_MY_USER_ID = myProfile.userId;

export const MOCK_ROOM_INVITE_CODE = "1234";

// 방장 화면 확인용, true면 어떤 방이든 내가 방장
export const mockViewAsHost: boolean = false;

// 입장 불가 상태 확인용, null이면 정상 입장
export const mockRoomSessionError: RoomErrorCode | null = null;

// 입장 몇 초 뒤 퇴출·방 종료 상황 확인용
export const mockRoomEndScenario: "none" | "kicked" | "closed" = "none";

// 위로 스크롤 시 이전 메시지 불러오기 확인용 과거 대화 수
export const MOCK_OLDER_MESSAGE_COUNT = 36;

const OTHER_MEMBER_NAMES = ["김승민", "오지우", "예지", "한도윤"];

const OLDER_LINES = [
  "첫 장부터 분위기가 확 잡히더라고요",
  "저는 중반부 전개가 조금 느리게 느껴졌어요",
  "인물 관계를 정리하면서 읽으니 더 재밌어요",
  "마지막 문장이 계속 생각나요",
];

export const MOCK_CHATTER_LINES = [
  "저는 2장이 제일 인상 깊었어요",
  "결말 해석이 사람마다 다를 것 같아요",
  "주인공 선택에 공감하시나요?",
];

export type MockRoomMember = {
  memberId: number;
  nickname: string;
};

export const getMockHostId = (roomId: number) => 10_000 + roomId;

// 방장을 제외한 다른 참여자
export const getMockRoomMembers = (hostNickname: string): MockRoomMember[] =>
  OTHER_MEMBER_NAMES.filter((name) => name !== hostNickname)
    .slice(0, 2)
    .map((nickname, index) => ({ memberId: 20_000 + index, nickname }));

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

const chat = (
  messageId: string,
  senderId: number,
  senderNickname: string,
  text: string,
  minutes: number,
): RoomTimelineMessage => ({
  type: "chat",
  messageId,
  sentAt: minutesAgo(minutes),
  senderId,
  senderNickname,
  senderProfileImageUrl: null,
  text,
});

// 시안 흐름을 재현하는 방별 대화 기록
export const buildMockRoomTimeline = (roomId: number, hostNickname: string, isHost: boolean) => {
  const hostId = isHost ? MOCK_MY_USER_ID : getMockHostId(roomId);
  const hostName = isHost ? myProfile.nickname : hostNickname;
  const [firstMember, secondMember] = getMockRoomMembers(hostName);

  const speakers = [
    { id: hostId, name: hostName },
    { id: firstMember.memberId, name: firstMember.nickname },
  ];

  const older = Array.from({ length: MOCK_OLDER_MESSAGE_COUNT }, (_, index) => {
    const speaker = speakers[index % speakers.length];

    return chat(
      `m-${roomId}-old-${index}`,
      speaker.id,
      speaker.name,
      OLDER_LINES[index % OLDER_LINES.length],
      600 - index,
    );
  });

  const lastReadMessageId = `m-${roomId}-join-${secondMember.memberId}`;

  const messages: RoomTimelineMessage[] = [
    ...older,
    {
      type: "memberJoined",
      messageId: `m-${roomId}-join-me`,
      sentAt: minutesAgo(40),
      memberId: MOCK_MY_USER_ID,
      nickname: myProfile.nickname,
    },
    chat(`m-${roomId}-1`, MOCK_MY_USER_ID, myProfile.nickname, "안녕하세요", 38),
    chat(`m-${roomId}-2`, hostId, hostName, "안녕하세요", 37),
    chat(`m-${roomId}-3`, firstMember.memberId, firstMember.nickname, "멀바", 36),
    {
      type: "memberJoined",
      messageId: lastReadMessageId,
      sentAt: minutesAgo(30),
      memberId: secondMember.memberId,
      nickname: secondMember.nickname,
    },
    chat(`m-${roomId}-4`, firstMember.memberId, firstMember.nickname, "멀바", 5),
  ];

  return { messages, lastReadMessageId };
};

export const buildCreatedRoomTimeline = (roomId: number): RoomTimelineMessage[] => [
  { type: "roomCreated", messageId: `m-${roomId}-created`, sentAt: minutesAgo(1) },
];

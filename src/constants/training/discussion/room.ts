import { Hash, LayoutList, Plus } from "lucide-react";

import type {
  RoomErrorCode,
  RoomFilter,
  RoomJoinStatus,
  RoomVisibility,
} from "@/types/training/discussion/room";

export const ENTRY_SHEET_TITLE = "토론방";

export const ENTRY_ACTIONS = [
  {
    id: "create",
    label: "토론방 만들기",
    description: "읽은 책이나 독후감으로 새 방을 열어요",
    icon: Plus,
  },
  {
    id: "browse",
    label: "토론방 둘러보기",
    description: "열려 있는 토론방을 찾아 참가 신청해요",
    icon: LayoutList,
  },
  {
    id: "joinCode",
    label: "초대코드로 입장",
    description: "받은 초대코드로 바로 들어가요",
    icon: Hash,
  },
] as const;

export type EntryActionId = (typeof ENTRY_ACTIONS)[number]["id"];

export const ROOM_CREATE_TITLE = "토론 방 만들기";

export const ROOM_CREATE_TOTAL_STEPS = 3;

export const TOPIC_STEP = {
  title: "주제를 선택해 주세요",
  description: "내가 읽었던 책이나 작성한 독후감을 주제로 방을 만들 수 있어요",
  searchLabel: "주제 검색",
  searchPlaceholder: "제목을 검색해주세요",
  emptyText: "아직 읽은 책이나 독후감이 없어요",
};

export const getTopicSearchEmptyText = (keyword: string) => `'${keyword}'에 맞는 주제가 없어요`;

export const ROOM_INFO_STEP = {
  title: "방 정보를 설정해주세요",
  titleLabel: "방 제목",
  titlePlaceholder: "ex. 급류의 류라이에 대해서 토론해봐요!",
  tagLabel: "방 태그",
  tagPlaceholder: "ex. #일상적인",
  tagRequiredPlaceholder: "ex. #일상적인 (한개이상 등록해주세요)",
  tagFullPlaceholder: "태그는 최대 5개까지 추가할 수 있어요",
  tagHint: "스페이스나 엔터로 태그를 추가해요",
  descriptionLabel: "방 설명(선택)",
  descriptionPlaceholder: "함께 이야기하고 싶은 내용이나 방 규칙을\n적어보세요",
  visibilityLabel: "방 공개 범위",
};

export const ROOM_TITLE_MAX_LENGTH = 30;

export const ROOM_TAG_MAX_COUNT = 5;

export const ROOM_TAG_MAX_LENGTH = 10;

export const ROOM_DESCRIPTION_MAX_LENGTH = 200;

export const ROOM_VISIBILITY_OPTIONS: {
  id: RoomVisibility;
  title: string;
  description: string;
}[] = [
  { id: "public", title: "공개방", description: "누구나 함께 참여" },
  { id: "private", title: "비공개방", description: "초대 코드로만 참여" },
];

export const ROOM_VISIBILITY_LABEL: Record<RoomVisibility, string> = {
  public: "공개방",
  private: "비공개방",
};

// 방 만들기 입력창 공통 테두리 박스
export const ROOM_FIELD_CLASS =
  "w-full scroll-mb-28 rounded-xl border-[1.5px] border-[#5B5552] bg-[#F9FAFB] px-4 text-[16px] text-[#2C2A2B] outline-none placeholder:text-[#A89F94] focus-visible:border-[#2C2A2B]";

export const NEXT_STEP_LABEL = "다음으로";

export const CREATE_ROOM_LABEL = "방 만들기";

export const ROOM_CREATE_EXIT_MESSAGE = "작성 중인 내용이 사라져요.\n나가시겠어요?";

export const ROOM_CREATE_ERROR_MESSAGE = "방을 만들지 못했어요. 다시 시도해 주세요";

export const ROOM_CREATED = {
  title: "토론방이 만들어졌어요!",
  subtitle: "이제 친구들과 함께\n자유로운 토론을 즐겨보세요",
  inviteCodeLabel: "초대코드",
  copyLabel: "복사하기",
  copiedLabel: "복사됨",
  copyFailedText: "복사하지 못했어요. 코드를 길게 눌러 직접 복사해 주세요",
  enterLabel: "바로 입장하기",
  toastText: "토론방이 만들어졌어요",
  homeLabel: "홈으로 돌아가기",
};

export const ROOM_LIST = {
  title: "토론방 리스트",
  searchLabel: "토론방 검색",
  searchPlaceholder: "방 제목 또는 책 제목 또는 태그를 검색하세요",
  filterLabel: "토론방 정렬",
  emptyText: "아직 열린 토론방이 없어요",
  loadMoreErrorText: "더 불러오지 못했어요",
};

export const getRoomSearchEmptyText = (keyword: string) => `'${keyword}'에 맞는 토론방이 없어요`;

export const ROOM_FILTERS: { id: RoomFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "hot", label: "HOT" },
  { id: "recent", label: "최근 개설" },
];

export const ROOM_DETAIL_FALLBACK_TITLE = "토론방 정보";

export const HOST_LABEL = "방장";

export const OPENED_SUFFIX = "개설";

export const JOIN_BUTTON_LABEL = {
  request: "참가 신청하기",
  requesting: "신청하는 중...",
  enter: "입장하기",
};

export const JOIN_UNAVAILABLE_LABEL: Record<Extract<RoomJoinStatus, "full" | "closed">, string> = {
  full: "인원이 가득 찼어요",
  closed: "종료된 토론방이에요",
};

export const JOIN_REQUESTED_MESSAGE = "방장이 검토중입니다!";

export const JOIN_CODE = {
  label: "초대코드",
  placeholder: "ABC123",
  submitLabel: "초대코드로 입장",
};

export const INVITE_CODE_MAX_LENGTH = 8;

export const ROOM_ERROR_MESSAGE: Record<RoomErrorCode, string> = {
  ALREADY_REQUESTED: "이미 참가 신청한 토론방이에요",
  ROOM_FULL: "인원이 가득 찼어요",
  ROOM_CLOSED: "종료된 토론방이에요",
  ROOM_NOT_FOUND: "토론방을 찾을 수 없어요",
  NOT_MEMBER: "참여 중인 토론방이 아니에요",
  INVALID_CODE: "초대코드를 다시 확인해 주세요",
  EXPIRED_CODE: "만료된 초대코드예요",
};

export const ROOM_ERROR_FALLBACK = "잠시 후 다시 시도해 주세요";

export const CLOSE_LABEL = "닫기";

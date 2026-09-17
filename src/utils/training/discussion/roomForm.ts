import { INVITE_CODE_MAX_LENGTH, ROOM_TAG_MAX_LENGTH } from "@/constants/training/discussion/room";

import type { RoomCreateForm } from "@/types/training/discussion/room";

// 앞쪽 # 제거, 공백 없이 최대 길이까지
export const normalizeTag = (raw: string) =>
  raw.replace(/^#+/, "").replace(/\s+/g, "").slice(0, ROOM_TAG_MAX_LENGTH);

// 초대코드 입력값 대문자 정규화, 영문·숫자 외 문자 제거
export const normalizeInviteCode = (raw: string) =>
  raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, INVITE_CODE_MAX_LENGTH);

export const hasRoomCreateInput = (form: RoomCreateForm) =>
  form.topic !== null ||
  form.title.trim().length > 0 ||
  form.tags.length > 0 ||
  form.description.trim().length > 0;

export const canSubmitRoomInfo = (form: RoomCreateForm) =>
  form.topic !== null && form.title.trim().length > 0 && form.tags.length > 0;

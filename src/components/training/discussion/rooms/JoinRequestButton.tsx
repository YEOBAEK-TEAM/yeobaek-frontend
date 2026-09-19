import { LoaderCircle } from "lucide-react";

import { PENDING_STATUS_LABEL } from "@/constants/training/discussion/discussion";
import { JOIN_BUTTON_LABEL } from "@/constants/training/discussion/room";

import type { RoomJoinStatus, RoomVisibility } from "@/types/training/discussion/room";

type JoinRequestButtonProps = {
  status: RoomJoinStatus;
  visibility: RoomVisibility;
  isPending: boolean;
  onRequest: () => void;
  onEnter: () => void;
};

const BASE_CLASS =
  "flex h-13.5 w-full items-center justify-center gap-2 rounded-2xl text-[18px] font-bold";

// 서버 참가 상태별 버튼·상태 표시 분기
export default function JoinRequestButton({
  status,
  visibility,
  isPending,
  onRequest,
  onEnter,
}: JoinRequestButtonProps) {
  if (status === "pending") {
    return (
      <p aria-disabled="true" className={`${BASE_CLASS} bg-[#A59E93] text-white`}>
        {PENDING_STATUS_LABEL}
      </p>
    );
  }

  if (status === "joined") {
    return (
      <button type="button" onClick={onEnter} className={`${BASE_CLASS} bg-[#4F4D4E] text-white`}>
        {JOIN_BUTTON_LABEL.enter}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onRequest}
      disabled={isPending}
      aria-busy={isPending}
      className={`${BASE_CLASS} bg-[#4F4D4E] text-white disabled:bg-[#7A7879]`}
    >
      {isPending && (
        <LoaderCircle
          aria-hidden="true"
          className="h-5 w-5 animate-spin motion-reduce:animate-none"
        />
      )}
      {visibility === "public"
        ? isPending
          ? JOIN_BUTTON_LABEL.joining
          : JOIN_BUTTON_LABEL.join
        : isPending
          ? JOIN_BUTTON_LABEL.requesting
          : JOIN_BUTTON_LABEL.request}
    </button>
  );
}

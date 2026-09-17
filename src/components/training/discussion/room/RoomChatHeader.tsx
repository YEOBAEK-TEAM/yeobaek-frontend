import { Hash, LogOut } from "lucide-react";

import { ROOM_HEADER_LABEL } from "@/constants/training/discussion/roomChat";

type RoomChatHeaderProps = {
  title: string;
  onBack: () => void;
  onLeave?: () => void;
  onShowInviteCode?: () => void;
};

export default function RoomChatHeader({
  title,
  onBack,
  onLeave,
  onShowInviteCode,
}: RoomChatHeaderProps) {
  return (
    <header className="relative flex h-[92px] shrink-0 items-center justify-center px-24 text-[#30201D]">
      <button
        type="button"
        onClick={onBack}
        aria-label={ROOM_HEADER_LABEL.back}
        className="absolute left-3 flex h-11 w-11 items-center justify-center"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-6 w-6"
        >
          <path d="m15 4-8 8 8 8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <h1 className="truncate text-xl font-bold">{title}</h1>

      <div className="absolute right-3 flex items-center">
        {onShowInviteCode && (
          <button
            type="button"
            onClick={onShowInviteCode}
            aria-label={ROOM_HEADER_LABEL.inviteCode}
            className="flex h-11 w-11 items-center justify-center"
          >
            <Hash aria-hidden="true" strokeWidth={3} className="h-6 w-6" />
          </button>
        )}

        {onLeave && (
          <button
            type="button"
            onClick={onLeave}
            aria-label={ROOM_HEADER_LABEL.leave}
            className="flex h-11 w-11 items-center justify-center"
          >
            <LogOut aria-hidden="true" strokeWidth={2.25} className="h-7 w-7" />
          </button>
        )}
      </div>
    </header>
  );
}

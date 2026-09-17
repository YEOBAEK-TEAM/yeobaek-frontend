import MemberActionMenu from "@/components/training/discussion/room/MemberActionMenu";
import ProfileAvatar from "@/components/training/discussion/shared/ProfileAvatar";
import { MEMBER_MENU_LABEL } from "@/constants/training/discussion/roomChat";
import { useLongPress } from "@/hooks/training/discussion/useLongPress";

import type { RoomChatRow } from "@/types/training/discussion/roomChat";

type MemberMessageProps = {
  row: Extract<RoomChatRow, { kind: "member" }>;
  isMenuOpen: boolean;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  onKick: () => void;
};

export default function MemberMessage({
  row,
  isMenuOpen,
  onOpenMenu,
  onCloseMenu,
  onKick,
}: MemberMessageProps) {
  // 방장만 말풍선을 길게 눌러 관리 메뉴 오픈
  const longPressHandlers = useLongPress(onOpenMenu, row.canKick);

  return (
    <div className="flex items-start">
      <div className="flex w-20 shrink-0 flex-col items-center">
        {row.showProfile &&
          (row.canKick ? (
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label={MEMBER_MENU_LABEL.open(row.nickname)}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              className="rounded-full"
            >
              <ProfileAvatar src={row.imageUrl} className="h-11 w-11" />
            </button>
          ) : (
            <ProfileAvatar src={row.imageUrl} className="h-11 w-11" />
          ))}

        {row.showProfile && (
          <p className="mt-1 w-full truncate text-center text-[14px] text-[#2C2A2B]">{row.label}</p>
        )}
      </div>

      <div className={`relative min-w-0 ${row.showProfile ? "mt-1.5" : ""}`}>
        <p
          {...longPressHandlers}
          className={`flex max-w-62 min-w-27 justify-center rounded-xl bg-[#D0DBE2] px-5 py-2 text-[16px] leading-5 break-words break-keep whitespace-pre-line text-[#2C2A2B] ${
            row.canKick ? "select-none [-webkit-touch-callout:none]" : ""
          }`}
        >
          <span>{row.text}</span>
        </p>

        {isMenuOpen && <MemberActionMenu onKick={onKick} onClose={onCloseMenu} />}
      </div>
    </div>
  );
}

import { Menu } from "lucide-react";
import { useState } from "react";

import RoomMenu from "@/components/training/discussion/room/RoomMenu";
import { ROOM_HEADER_LABEL, ROOM_MENU_LABEL } from "@/constants/training/discussion/roomChat";

import type { RoomMenuItem } from "@/components/training/discussion/room/RoomMenu";

type RoomChatHeaderProps = {
  title: string;
  applicantCount?: number;
  onBack: () => void;
  onLeave?: () => void;
  onShowApplicants?: () => void;
  onShowInviteCode?: () => void;
};

export default function RoomChatHeader({
  title,
  applicantCount = 0,
  onBack,
  onLeave,
  onShowApplicants,
  onShowInviteCode,
}: RoomChatHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 방장 여부에 따라 항목 수가 달라져 목록으로 구성
  const items: RoomMenuItem[] = [];

  if (onShowInviteCode) {
    items.push({ id: "inviteCode", label: ROOM_MENU_LABEL.inviteCode, onSelect: onShowInviteCode });
  }

  if (onShowApplicants) {
    items.push({
      id: "applicants",
      label: ROOM_MENU_LABEL.applicants,
      badge: applicantCount,
      onSelect: onShowApplicants,
    });
  }

  if (onLeave) {
    items.push({ id: "leave", label: ROOM_MENU_LABEL.leave, onSelect: onLeave });
  }

  const selectItem = (item: RoomMenuItem) => {
    setIsMenuOpen(false);
    item.onSelect();
  };

  return (
    <header className="relative flex h-[92px] shrink-0 items-center justify-center px-14 text-[#30201D]">
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

      {items.length > 0 && (
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={ROOM_HEADER_LABEL.menu}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          className="absolute right-3 flex h-11 w-11 items-center justify-center"
        >
          <Menu aria-hidden="true" strokeWidth={2.25} className="h-6 w-6" />

          {/* 메뉴를 닫아둔 상태에서도 대기 신청자를 알리는 점 */}
          {!isMenuOpen && applicantCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#D9534F]" />
          )}
        </button>
      )}

      {isMenuOpen && (
        <RoomMenu
          items={items.map((item) => ({ ...item, onSelect: () => selectItem(item) }))}
          onClose={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}

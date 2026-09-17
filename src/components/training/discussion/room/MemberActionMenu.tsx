import { useEffect, useRef } from "react";

import { MEMBER_MENU_LABEL } from "@/constants/training/discussion/roomChat";

type MemberActionMenuProps = {
  onKick: () => void;
  onClose: () => void;
};

export default function MemberActionMenu({ onKick, onClose }: MemberActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 밖을 누르거나 ESC로 닫기
  useEffect(() => {
    menuRef.current?.querySelector("button")?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      role="menu"
      className="absolute top-2.5 left-0 z-20 overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.14)]"
    >
      <button
        type="button"
        role="menuitem"
        onClick={onKick}
        className="flex h-14 w-25 items-center justify-center text-[17px] font-semibold text-[#2C2A2B] active:bg-[#F2F0EA]"
      >
        {MEMBER_MENU_LABEL.kick}
      </button>
    </div>
  );
}

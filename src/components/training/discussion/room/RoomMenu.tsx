import { useEffect, useRef } from "react";

import type { ReactNode } from "react";

export type RoomMenuItem = {
  id: string;
  label: string;
  badge?: number;
  onSelect: () => void;
};

type RoomMenuProps = {
  items: RoomMenuItem[];
  onClose: () => void;
};

const renderBadge = (badge: number | undefined): ReactNode =>
  badge && badge > 0 ? (
    <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D9534F] px-1.5 text-[11px] font-bold text-white tabular-nums">
      {badge}
    </span>
  ) : null;

export default function RoomMenu({ items, onClose }: RoomMenuProps) {
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
      className="absolute top-12 right-3 z-20 min-w-40 overflow-hidden rounded-2xl bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.14)]"
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          onClick={item.onSelect}
          className="flex h-12 w-full items-center px-4 text-[16px] font-semibold text-[#2C2A2B] active:bg-[#F2F0EA]"
        >
          {item.label}
          {renderBadge(item.badge)}
        </button>
      ))}
    </div>
  );
}

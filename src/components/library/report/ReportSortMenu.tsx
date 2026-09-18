import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { REPORT_SORT_MENU_LABEL, REPORT_SORT_OPTIONS } from "@/constants/library/report";

import type { ReportSortOrder } from "@/constants/library/report";

type ReportSortMenuProps = {
  order: ReportSortOrder;
  onChange: (order: ReportSortOrder) => void;
};

export default function ReportSortMenu({ order, onChange }: ReportSortMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // 메뉴 밖을 누르면 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const current = REPORT_SORT_OPTIONS.find((option) => option.id === order);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`${REPORT_SORT_MENU_LABEL}, 현재 ${current?.label}`}
        className="flex h-10 items-center gap-1 text-[15px] text-[#54555A]"
      >
        {current?.label}
        <ChevronDown aria-hidden="true" className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-full right-0 z-10 mt-1 w-28 overflow-hidden rounded-xl bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.14)]"
        >
          {REPORT_SORT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="menuitemradio"
              aria-checked={option.id === order}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className="flex h-11 w-full items-center px-4 text-[15px] text-[#2C2A2B] active:bg-[#F2F0EA]"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

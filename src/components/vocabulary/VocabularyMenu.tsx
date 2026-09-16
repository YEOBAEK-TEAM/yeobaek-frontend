import { useEffect, useId, useRef } from "react";

type Props = {
  label: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onDetail: () => void;
  onDelete: () => void;
};
export default function VocabularyMenu({
  label,
  open,
  onToggle,
  onClose,
  onDetail,
  onDelete,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) onClose();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open, onClose]);
  return (
    <div ref={root} className="absolute top-1 right-1">
      <button
        ref={trigger}
        type="button"
        aria-label={`${label} 메뉴`}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={onToggle}
        className="flex h-9 w-9 items-center justify-center gap-[3px] text-[#665752]"
      >
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="h-1 w-1 rounded-full bg-current" />
        ))}
      </button>
      {open && (
        <div
          id={id}
          className="absolute top-7 right-0 z-20 w-[91px] rounded-xl bg-white py-3 shadow-[0_5px_9px_#0004]"
        >
          <button
            type="button"
            onClick={onDetail}
            className="h-10 w-full text-base text-black hover:bg-[#F7F6F1]"
          >
            상세보기
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="h-10 w-full text-base text-black hover:bg-[#F7F6F1]"
          >
            삭제하기
          </button>
        </div>
      )}
    </div>
  );
}

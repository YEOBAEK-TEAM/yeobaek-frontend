import { useCallback, useEffect, useRef, useState } from "react";

import { BottomSheetCloseContext } from "@/components/common/bottomSheet/bottomSheetContext";

import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

type BottomSheetProps = {
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
};

const CLOSE_THRESHOLD_PX = 80;

const TRANSITION_MS = 280;

// 하단에서 올라오는 공용 바텀시트
export default function BottomSheet({ labelledBy, onClose, children }: BottomSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dragStartYRef = useRef<number | null>(null);
  const afterCloseRef = useRef<(() => void) | null>(null);

  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;

    dialog?.showModal();
    document.body.style.overflow = "hidden";

    // 시트 올라오는 트랜지션 시작
    const raf = requestAnimationFrame(() => setEntered(true));

    return () => {
      cancelAnimationFrame(raf);
      dialog?.close();
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);

  const requestClose = useCallback((afterClose?: () => void) => {
    afterCloseRef.current = afterClose ?? null;
    setLeaving(true);
  }, []);

  // 내려가는 트랜지션 후 닫기 실행
  useEffect(() => {
    if (!leaving) return;

    const timer = window.setTimeout(() => (afterCloseRef.current ?? onClose)(), TRANSITION_MS);

    return () => window.clearTimeout(timer);
  }, [leaving, onClose]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStartYRef.current = event.clientY;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartYRef.current === null) return;

    // 아래 방향 드래그 추적
    setDragOffset(Math.max(0, event.clientY - dragStartYRef.current));
  };

  const handlePointerUp = () => {
    const shouldClose = dragOffset > CLOSE_THRESHOLD_PX;

    dragStartYRef.current = null;
    setIsDragging(false);
    setDragOffset(0);

    if (shouldClose) requestClose();
  };

  const translateY = !entered || leaving ? "100%" : `${dragOffset}px`;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      style={{
        transform: `translateY(${translateY})`,
        transition: isDragging
          ? "none"
          : `transform ${TRANSITION_MS}ms cubic-bezier(0.32,0.72,0,1)`,
      }}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;

        // 딤 영역 클릭 판별
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientY < bounds.top ||
          event.clientX < bounds.left ||
          event.clientX > bounds.right
        ) {
          requestClose();
        }
      }}
      className={`fixed inset-x-0 top-auto bottom-0 mx-auto max-h-[75dvh] w-full max-w-97.5 overflow-y-auto rounded-t-3xl border-0 bg-[#FFFEFB] p-0 backdrop:transition-colors backdrop:duration-300 ${
        entered && !leaving ? "backdrop:bg-black/35" : "backdrop:bg-black/0"
      }`}
    >
      <div
        tabIndex={-1}
        autoFocus
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex cursor-grab touch-none justify-center py-4 outline-none active:cursor-grabbing"
      >
        <span aria-hidden="true" className="h-1.5 w-24 rounded-full bg-[#4F4D4E]" />
      </div>

      <BottomSheetCloseContext.Provider value={requestClose}>
        {children}
      </BottomSheetCloseContext.Provider>
    </dialog>
  );
}

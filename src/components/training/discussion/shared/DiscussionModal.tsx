import { useEffect, useRef } from "react";

import type { ReactNode } from "react";

type DiscussionModalProps = {
  labelledBy: string;
  onClose: () => void;
  // upper는 키보드가 올라와도 가리지 않도록 화면 위쪽 배치
  placement?: "center" | "upper";
  className?: string;
  children: ReactNode;
};

const PLACEMENT_CLASS = {
  center: "inset-0 m-auto",
  upper: "inset-x-0 top-[30dvh] mx-auto my-0",
};

// dialog 기반 중앙 모달, ESC·딤 클릭 닫기와 포커스 복귀
export default function DiscussionModal({
  labelledBy,
  onClose,
  placement = "center",
  className = "",
  children,
}: DiscussionModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;

    dialog?.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={`fixed h-fit max-h-[85dvh] w-[calc(100%-40px)] overflow-y-auto border-0 p-0 backdrop:bg-black/30 ${PLACEMENT_CLASS[placement]} ${className}`}
    >
      {children}
    </dialog>
  );
}

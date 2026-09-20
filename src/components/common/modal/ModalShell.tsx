import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import type { ReactNode } from "react";

type ModalShellProps = {
  labelledBy: string;
  onClose: () => void;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
};

// 딤 클릭·ESC·X 버튼 닫기와 포커스 복귀를 맡는 흰 배경 모달 틀
export default function ModalShell({
  labelledBy,
  onClose,
  className = "",
  bodyClassName = "",
  children,
}: ModalShellProps) {
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
      className={`fixed inset-0 m-auto h-fit w-[calc(100%-40px)] rounded-2xl border-0 bg-white p-0 backdrop:bg-black/30 ${className}`}
    >
      <div className={`relative ${bodyClassName}`}>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-2 right-3 flex h-10 w-10 items-center justify-center text-[#2C2A2B]"
        >
          <X aria-hidden="true" strokeWidth={2.25} className="h-6 w-6" />
        </button>

        {children}
      </div>
    </dialog>
  );
}

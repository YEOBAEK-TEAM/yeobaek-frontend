import { useEffect, useRef } from "react";

import type { ReactNode } from "react";

type ConfirmModalProps = {
  children: ReactNode;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({ children, onConfirm, onClose }: ConfirmModalProps) {
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

  // 확인 버튼 공통 스타일
  const buttonClassName =
    "h-7 min-w-10 rounded px-3 text-sm text-[#2C2A2B] hover:bg-[#D91414] hover:font-semibold hover:text-white active:bg-[#D91414] active:font-semibold active:text-white";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirm-modal-message"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-auto w-[calc(100%-44px)] max-w-75.5 rounded-xl border-0 bg-[#F7F6F1] px-7 pt-9 pb-2.5 shadow-[0_5px_10px_#0003] backdrop:bg-[#302a2440]"
    >
      {/* 안내 문구 */}
      <p
        id="confirm-modal-message"
        tabIndex={-1}
        autoFocus
        className="text-center text-[15px] leading-6 font-semibold whitespace-pre-line text-[#4F4D4E] outline-none"
      >
        {children}
      </p>

      <div className="mt-2.5 flex justify-end gap-2">
        <button type="button" onClick={onConfirm} className={buttonClassName}>
          예
        </button>

        <button type="button" onClick={onClose} className={buttonClassName}>
          아니오
        </button>
      </div>
    </dialog>
  );
}

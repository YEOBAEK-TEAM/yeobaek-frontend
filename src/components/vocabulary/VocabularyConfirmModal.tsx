import { useEffect, useRef, type ReactNode } from "react";

type Props = { children: ReactNode; onConfirm: () => void; onClose: () => void };

export default function VocabularyConfirmModal({ children, onConfirm, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      aria-labelledby="vocabulary-confirm-message"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-auto w-[calc(100%-44px)] max-w-[302px] rounded-xl border-0 bg-[#F7F6F1] px-7 pt-9 pb-2.5 text-black shadow-[0_5px_10px_#0003] backdrop:bg-[#302a2440]"
    >
      <p
        id="vocabulary-confirm-message"
        className="whitespace-pre-line text-center text-[15px] font-semibold leading-6"
      >
        {children}
      </p>
      <div className="mt-2.5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onConfirm}
          className="h-6 min-w-10 rounded bg-[#CE080D] px-3 text-sm text-white"
        >
          예
        </button>
        <button type="button" autoFocus onClick={onClose} className="h-6 min-w-10 text-sm">
          아니오
        </button>
      </div>
    </dialog>
  );
}

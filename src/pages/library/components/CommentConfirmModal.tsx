import { useEffect, useRef } from "react";

export default function CommentConfirmModal({
  message,
  destructive,
  onConfirm,
  onCancel,
}: {
  message: string;
  destructive: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={message}
      className="fixed inset-0 m-auto w-[300px] max-w-[calc(100%-40px)] rounded-xl border-0 bg-[#f7f6f1] p-0 text-[#141610] shadow-xl backdrop:bg-black/35"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) onCancel();
      }}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <div className="px-5 pt-7 pb-3 text-center [font-family:system-ui,sans-serif]">
        <p className="text-sm leading-6">{message}</p>
        <div className="mt-4 flex justify-end gap-2 text-xs">
          <button
            type="button"
            className={`min-h-8 min-w-12 rounded px-3 ${destructive ? "bg-[#c62222] text-white" : "bg-[#69734e] text-white"}`}
            onClick={onConfirm}
          >
            예
          </button>
          <button
            type="button"
            autoFocus
            className="min-h-8 min-w-12 rounded px-3"
            onClick={onCancel}
          >
            아니오
          </button>
        </div>
      </div>
    </dialog>
  );
}

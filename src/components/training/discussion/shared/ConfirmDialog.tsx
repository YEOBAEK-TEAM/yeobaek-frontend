import { LoaderCircle } from "lucide-react";
import { useId } from "react";

import DiscussionModal from "@/components/training/discussion/shared/DiscussionModal";
import ModalCloseButton from "@/components/training/discussion/shared/ModalCloseButton";

type ConfirmDialogProps = {
  message: string;
  isPending?: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onClose: () => void;
};

const ACTION_CLASS =
  "flex h-9 min-w-12 items-center justify-center px-2 text-[15px] text-[#2C2A2B]";

export default function ConfirmDialog({
  message,
  isPending = false,
  errorMessage,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const messageId = useId();

  return (
    <DiscussionModal
      labelledBy={messageId}
      onClose={onClose}
      className="max-w-78 rounded-2xl bg-white"
    >
      <div className="relative px-8 pt-11 pb-3">
        <ModalCloseButton onClick={onClose} />

        <p
          id={messageId}
          className="text-center text-[17px] leading-6 font-bold break-keep whitespace-pre-line text-[#2C2A2B]"
        >
          {message}
        </p>

        {errorMessage && (
          <p role="alert" className="mt-2 text-center text-[13px] text-[#D91414]">
            {errorMessage}
          </p>
        )}

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            aria-busy={isPending}
            className={ACTION_CLASS}
          >
            {isPending ? (
              <LoaderCircle
                aria-label="처리 중"
                className="h-4 w-4 animate-spin motion-reduce:animate-none"
              />
            ) : (
              "예"
            )}
          </button>

          <button type="button" onClick={onClose} className={ACTION_CLASS}>
            아니오
          </button>
        </div>
      </div>
    </DiscussionModal>
  );
}

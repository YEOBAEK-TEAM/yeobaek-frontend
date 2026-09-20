import { useId } from "react";

import DiscussionModal from "@/components/training/discussion/shared/DiscussionModal";
import ModalCloseButton from "@/components/training/discussion/shared/ModalCloseButton";

type NoticeModalProps = {
  message: string;
  onClose: () => void;
};

export default function NoticeModal({ message, onClose }: NoticeModalProps) {
  const messageId = useId();

  return (
    <DiscussionModal
      labelledBy={messageId}
      onClose={onClose}
      className="max-w-78 rounded-2xl bg-white"
    >
      <div className="relative flex h-28.5 items-center justify-center px-12">
        <p id={messageId} className="text-center text-[18px] font-semibold text-[#2C2A2B]">
          {message}
        </p>

        <ModalCloseButton onClick={onClose} />
      </div>
    </DiscussionModal>
  );
}

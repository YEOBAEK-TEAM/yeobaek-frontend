import { X } from "lucide-react";

import { CLOSE_LABEL } from "@/constants/training/discussion/room";

type ModalCloseButtonProps = {
  onClick: () => void;
};

export default function ModalCloseButton({ onClick }: ModalCloseButtonProps) {
  return (
    <button
      type="button"
      aria-label={CLOSE_LABEL}
      onClick={onClick}
      className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center text-[#2C2A2B]"
    >
      <X aria-hidden="true" strokeWidth={2.25} className="h-6 w-6" />
    </button>
  );
}

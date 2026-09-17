import { Plus } from "lucide-react";

import { CREATE_GROUP_LABEL } from "@/constants/training/discussion/discussion";

type CreateGroupButtonProps = {
  onClick: () => void;
};

export default function CreateGroupButton({ onClick }: CreateGroupButtonProps) {
  return (
    <button
      type="button"
      aria-label={CREATE_GROUP_LABEL}
      onClick={onClick}
      className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-lg bg-[#4F4D4E] text-white active:bg-[#3F3D3E]"
    >
      <Plus aria-hidden="true" strokeWidth={2.5} className="h-6 w-6" />
    </button>
  );
}

import { LoaderCircle } from "lucide-react";
import { useId } from "react";

import ModalShell from "@/components/common/modal/ModalShell";

type CommonModalAction = {
  label: string;
  onClick: () => void;
  isPending?: boolean;
};

type CommonModalProps = {
  message: string;
  actions?: CommonModalAction[];
  onClose: () => void;
};

const ACTION_GRID_CLASS = ["", "grid-cols-1", "grid-cols-2"];

// X 버튼·딤 클릭·ESC로 닫는 공용 안내·확인 모달
export default function CommonModal({ message, actions = [], onClose }: CommonModalProps) {
  const messageId = useId();

  return (
    <ModalShell
      labelledBy={messageId}
      onClose={onClose}
      className="max-w-78"
      bodyClassName={`px-7 pt-11 ${actions.length > 0 ? "pb-7" : "pb-9"}`}
    >
      <p
        id={messageId}
        className="text-center text-[16px] leading-6 font-semibold break-keep whitespace-pre-line text-[#2C2A2B]"
      >
        {message}
      </p>

      {actions.length > 0 && (
        <div
          className={`mx-2.5 mt-3.5 grid gap-1.5 ${ACTION_GRID_CLASS[actions.length] ?? "grid-cols-2"}`}
        >
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              disabled={action.isPending}
              aria-busy={action.isPending}
              className="flex h-8 items-center justify-center rounded-md bg-[#C1C1C1] text-[15px] text-[#1E1E1E] active:bg-[#B3B3B3] disabled:opacity-70"
            >
              {action.isPending ? (
                <LoaderCircle
                  aria-label="처리 중"
                  className="h-4 w-4 animate-spin motion-reduce:animate-none"
                />
              ) : (
                action.label
              )}
            </button>
          ))}
        </div>
      )}
    </ModalShell>
  );
}

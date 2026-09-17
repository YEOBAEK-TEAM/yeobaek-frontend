import { useId } from "react";
import { useNavigate } from "react-router-dom";

import BottomSheet from "@/components/common/bottomSheet/BottomSheet";
import { useBottomSheetClose } from "@/components/common/bottomSheet/bottomSheetContext";
import { DISCUSSION_PATH } from "@/constants/training/discussion/discussion";
import { ENTRY_ACTIONS, ENTRY_SHEET_TITLE } from "@/constants/training/discussion/room";
import { useRoomCreateStore } from "@/stores/training/discussion/roomCreate";

import type { EntryActionId } from "@/constants/training/discussion/room";

type EntryActionSheetProps = {
  onClose: () => void;
  onJoinCode: () => void;
};

type EntryActionListProps = EntryActionSheetProps & {
  titleId: string;
};

function EntryActionList({ titleId, onClose, onJoinCode }: EntryActionListProps) {
  const navigate = useNavigate();
  const requestClose = useBottomSheetClose();

  const runAction: Record<EntryActionId, () => void> = {
    create: () => {
      useRoomCreateStore.getState().reset();
      navigate(DISCUSSION_PATH.create);
    },
    browse: () => navigate(DISCUSSION_PATH.roomList),
    joinCode: onJoinCode,
  };

  // 시트가 내려간 뒤 선택 동작 실행
  const select = (id: EntryActionId) =>
    requestClose(() => {
      onClose();
      runAction[id]();
    });

  return (
    <div className="px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
      <h2 id={titleId} className="px-2 text-[18px] font-bold text-[#4F4D4E]">
        {ENTRY_SHEET_TITLE}
      </h2>

      <ul className="mt-2">
        {ENTRY_ACTIONS.map(({ id, label, description, icon: Icon }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => select(id)}
              className="flex w-full items-center gap-3.5 rounded-xl px-2 py-3 text-left active:bg-[#F2F0EA]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F2F0EA] text-[#4F4D4E]">
                <Icon aria-hidden="true" strokeWidth={2.25} className="h-5 w-5" />
              </span>

              <span className="min-w-0">
                <span className="block text-[16px] font-bold text-[#4F4D4E]">{label}</span>
                <span className="block text-[13px] text-[#8F8B85]">{description}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function EntryActionSheet({ onClose, onJoinCode }: EntryActionSheetProps) {
  const titleId = useId();

  return (
    <BottomSheet labelledBy={titleId} onClose={onClose}>
      <EntryActionList titleId={titleId} onClose={onClose} onJoinCode={onJoinCode} />
    </BottomSheet>
  );
}

import VocabularyConfirmModal from "./VocabularyConfirmModal";
import type { DeleteType } from "@/types/vocabulary";

type Props = { type: DeleteType; onConfirm: () => void; onClose: () => void };
export default function DeleteConfirmModal({ type, ...props }: Props) {
  return (
    <VocabularyConfirmModal {...props}>
      해당 {type === "word" ? "단어" : "문장"}를 정말 삭제하시겠습니까?
    </VocabularyConfirmModal>
  );
}

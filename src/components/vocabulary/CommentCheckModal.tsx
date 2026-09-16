import VocabularyConfirmModal from "./VocabularyConfirmModal";

type Props = { hasComment: boolean; onConfirm: () => void; onClose: () => void };
export default function CommentCheckModal({ hasComment, ...props }: Props) {
  return (
    <VocabularyConfirmModal {...props}>
      {hasComment
        ? "해당 문장에 남긴 댓글이 있습니다.\n불러오시겠습니까?"
        : "해당 문장에 남긴 댓글이 없습니다"}
    </VocabularyConfirmModal>
  );
}

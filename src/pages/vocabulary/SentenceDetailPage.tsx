import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "@/components/common/header/Header";
import CommentCheckModal from "@/components/vocabulary/CommentCheckModal";
import DeleteConfirmModal from "@/components/vocabulary/DeleteConfirmModal";
import MemoSection from "@/components/vocabulary/MemoSection";
import VocabularyToast from "@/components/vocabulary/VocabularyToast";
import { LinkIcon, TrashIcon } from "@/components/vocabulary/VocabularyIcons";

import { useVocabularyStore } from "@/stores/vocabulary";

export default function SentenceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { sentences, deleteItem, saveMemo, setTab } = useVocabularyStore();

  const sentence = sentences.find((item) => item.id === Number(id));

  const [modal, setModal] = useState<"delete" | "comment" | null>(null);
  const [toast, setToast] = useState(false);

  const goBack = () => {
    setTab("sentence");
    navigate("/vocabulary");
  };

  const handleDelete = () => {
    if (sentence) {
      deleteItem("sentence", sentence.id);
    }

    goBack();
  };

  const handleSave = (memo: string) => {
    if (sentence) {
      saveMemo(sentence.id, memo);
      setToast(true);
    }
  };

  const handleLoadComment = () => {
    // TODO: 댓글 API 연동 후
    // hasComment가 true인 문장의 댓글 상세 페이지로 이동 처리
    setModal(null);
  };

  return (
    <main className="flex h-dvh flex-col overflow-hidden">
      <Header title="문장 상세" onBack={goBack} />

      {!sentence ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="px-5 text-center text-[#887D77]">문장을 찾을 수 없습니다.</p>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          {/* 문장 정보 */}
          <section className="shrink-0 px-6 pt-2 pb-4">
            <blockquote className="mx-auto max-w-71 text-center font-serif text-[20px] leading-7 text-black">
              “ {sentence.content} ”
            </blockquote>

            <p className="mt-6 text-center text-xs font-semibold text-[#8A8A88]">
              {sentence.bookTitle} · p{sentence.page}
            </p>

            {/* 링크 / 삭제 */}
            <div className="flex justify-end gap-1 text-[#B2ABA6]">
              <button
                type="button"
                aria-label="문장 댓글 확인"
                onClick={() => setModal("comment")}
                className="flex h-10 w-9 items-center justify-center"
              >
                <LinkIcon />
              </button>

              <button
                type="button"
                aria-label="문장 삭제"
                onClick={() => setModal("delete")}
                className="flex h-10 w-9 items-center justify-center"
              >
                <TrashIcon />
              </button>
            </div>
          </section>

          {/* 메모 */}
          <div className="min-h-0 flex-1 overflow-hidden">
            <MemoSection key={sentence.id} initialMemo={sentence.memo} onSave={handleSave} />
          </div>

          {/* 삭제 모달 */}
          {modal === "delete" && (
            <DeleteConfirmModal
              type="sentence"
              onConfirm={handleDelete}
              onClose={() => setModal(null)}
            />
          )}

          {/* 댓글 확인 모달 */}
          {modal === "comment" && (
            <CommentCheckModal
              hasComment={sentence.hasComment}
              onConfirm={handleLoadComment}
              onClose={() => setModal(null)}
            />
          )}
        </div>
      )}

      {toast && <VocabularyToast onClose={() => setToast(false)} />}
    </main>
  );
}

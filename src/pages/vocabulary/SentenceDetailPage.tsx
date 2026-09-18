import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "@/components/common/header/Header";
import DeleteConfirmModal from "@/components/vocabulary/DeleteConfirmModal";
import MemoSection from "@/components/vocabulary/MemoSection";
import VocabularyToast from "@/components/vocabulary/VocabularyToast";
import { LinkIcon, TrashIcon } from "@/components/vocabulary/VocabularyIcons";

import { useVocabularyStore } from "@/stores/vocabulary";

import { useSentenceDetail } from "@/hooks/useSentenceDetail";
import { useDeleteSentence } from "@/hooks/useDeleteSentence";
import { useUpdateSentenceMemo } from "@/hooks/useUpdateSentenceMemo";

export default function SentenceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const setTab = useVocabularyStore((state) => state.setTab);

  const { data: sentence, isLoading, isError } = useSentenceDetail(Number(id));
  const remove = useDeleteSentence();
  const updateMemo = useUpdateSentenceMemo();
  const deleting = useRef(false);

  const [modal, setModal] = useState<"delete" | null>(null);
  const [toast, setToast] = useState(false);

  const goBack = () => {
    setTab("sentence");
    navigate("/vocabulary");
  };

  const handleDelete = () => {
    if (!sentence || deleting.current) return;
    deleting.current = true;
    remove.mutate(sentence.sentenceId, {
      onSuccess: goBack,
      onError: () => setModal(null),
      onSettled: () => {
        deleting.current = false;
      },
    });
  };

  const handleSave = async (memo: string): Promise<string | null> => {
    if (!sentence) return null;
    try {
      const saved = await updateMemo.mutateAsync({ sentenceId: sentence.sentenceId, memo });
      setToast(true);
      return saved.memo ?? "";
    } catch {
      return null;
    }
  };

  return (
    <main className="flex flex-1 flex-col">
      <Header title="문장 상세" onBack={goBack} />

      {!sentence ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="px-5 text-center text-[#887D77]">
            {isLoading
              ? "문장을 불러오는 중입니다."
              : isError
                ? "문장을 불러오지 못했습니다."
                : "문장을 찾을 수 없습니다."}
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col">
          {/* 문장 정보 */}
          <section className="shrink-0 px-6 pt-2 pb-4">
            <blockquote className="mx-auto max-w-71 text-center font-serif font-semibold text-[20px] leading-7 text-black">
              “ {sentence.content} ”
            </blockquote>

            <p className="mt-6 text-center text-[12px] font-semibold text-[#8A8A88]">
              {sentence.bookTitle} · p{sentence.pageNumber}
            </p>

            {/* 링크 / 삭제 */}
            <div className="flex justify-end gap-1 text-[#B2ABA6]">
              <button
                type="button"
                aria-label="책의 해당 페이지로 이동"
                onClick={() =>
                  navigate(
                    `/library/read?bookId=${sentence.bookId}&pageId=${sentence.pageId}&firstRead=false`,
                  )
                }
                className="flex h-10 w-9 items-center justify-center"
              >
                <LinkIcon />
              </button>

              <button
                type="button"
                aria-label="문장 삭제"
                disabled={remove.isPending}
                onClick={() => {
                  remove.reset();
                  setModal("delete");
                }}
                className="flex h-10 w-9 items-center justify-center"
              >
                <TrashIcon />
              </button>
            </div>
          </section>

          {/* 메모 */}
          <div className="flex-1">
            <MemoSection
              key={sentence.sentenceId}
              initialMemo={sentence.memo ?? ""}
              onSave={handleSave}
              isSaving={updateMemo.isPending}
            />
            {updateMemo.isError && (
              <p role="alert" className="px-6 py-3 text-sm text-red-700">
                메모를 저장하지 못했습니다. 다시 시도해 주세요.
              </p>
            )}
          </div>

          {/* 삭제 모달 */}
          {modal === "delete" && (
            <DeleteConfirmModal
              type="sentence"
              onConfirm={handleDelete}
              onClose={() => {
                if (!deleting.current) setModal(null);
              }}
            />
          )}

          {remove.isError && (
            <p role="alert" className="px-6 py-3 text-sm text-red-700">
              문장을 삭제하지 못했습니다. 다시 시도해 주세요.
            </p>
          )}
        </div>
      )}

      {toast && <VocabularyToast onClose={() => setToast(false)} />}
    </main>
  );
}

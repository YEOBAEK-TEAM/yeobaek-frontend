import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/common/header/Header";
import DeleteConfirmModal from "@/components/vocabulary/DeleteConfirmModal";
import VocabularyItem from "@/components/vocabulary/VocabularyItem";
import VocabularyToast from "@/components/vocabulary/VocabularyToast";

import { useDeleteVocabulary } from "@/hooks/useDeleteVocabulary";
import { useDeleteSentence } from "@/hooks/useDeleteSentence";
import { useSentenceList } from "@/hooks/useSentenceList";
import { useSavedVocabularyWords } from "@/hooks/useSavedVocabularyWords";

import { useAuthStore } from "@/stores/auth";
import { useVocabularyStore } from "@/stores/vocabulary";
import { CHOSEONG_LIST, getChoseong } from "@/utils/common/getChoseong";

import type { WordListItem } from "@/types/vocabulary";
import type { SentenceListItem } from "@/types/sentence";

export default function VocabularyPage() {
  const navigate = useNavigate();

  const nickname = useAuthStore((state) => state.nickname);

  const { activeTab, activeInitial, setTab, setInitial } = useVocabularyStore();

  const [menuId, setMenuId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState(false);

  // 단어 삭제 API
  const { mutateAsync: deleteVocabulary } = useDeleteVocabulary();
  const { mutateAsync: deleteSentence } = useDeleteSentence();

  const {
    data: sentenceData,
    isPending: isSentencePending,
    isError: isSentenceError,
  } = useSentenceList(activeTab === "sentence");

  const sentences: (SentenceListItem & { bookId: number; pageId: number })[] = (
    sentenceData ?? []
  ).map((item) => ({
    id: item.sentenceId,
    bookId: item.bookId,
    pageId: item.pageId,
    content: item.content,
    bookTitle: item.bookTitle,
    page: item.pageNumber,
    collectedAt: item.createdAt,
  }));

  // 초성 목록을 만들려면 전체가 있어야 해 단어도 모두 불러온 뒤 화면에서 거름
  const wordQuery = useSavedVocabularyWords(activeTab === "word");

  const isError = wordQuery.isError;
  const isPending = !wordQuery.ready && !wordQuery.isError;

  const vocabularyItems = wordQuery.items;

  // API 응답을 목록 UI용 데이터로 변환
  const words: WordListItem[] = vocabularyItems.map((item) => ({
    id: item.vocabularyId,
    word: item.word,
    meaning: item.meaning,
    bookTitle: item.bookTitle,
    page: item.pageNumber,
    collectedAt: item.createdAt,
  }));

  // 수집한 것들의 초성만 필터에 노출
  const collected = new Set(
    (activeTab === "word"
      ? words.map((word) => word.word)
      : sentences.map((item) => item.content)
    ).map(getChoseong),
  );

  const availableInitials = CHOSEONG_LIST.filter((initial) => collected.has(initial));

  // 고른 초성에 수집한 게 없으면 첫 초성을 보여줌
  const currentInitial = availableInitials.includes(activeInitial)
    ? activeInitial
    : (availableInitials[0] ?? activeInitial);

  // 단어 / 문장 API 데이터를 초성으로 걸러 표시
  const items =
    activeTab === "word"
      ? words.filter((word) => getChoseong(word.word) === currentInitial)
      : [...sentences]
          .filter((sentence) => getChoseong(sentence.content) === currentInitial)
          .sort((a, b) => Date.parse(b.collectedAt) - Date.parse(a.collectedAt));

  const totalCount = items.length;

  // 단어 / 문장 삭제
  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      if (activeTab === "word") {
        // 단어 삭제 API
        await deleteVocabulary(deleteId);
      } else {
        await deleteSentence(deleteId);
      }

      setDeleteId(null);
      setToast(true);
    } catch (error) {
      console.error("삭제 실패", error);
    }
  };

  return (
    <main className="flex-1">
      <Header title={nickname ? `${nickname}의 글귀수집` : "나의 글귀수집"} />

      <div className="mt-6.5 px-6">
        {/* 단어 / 문장 탭 */}
        <div className="flex items-end gap-2" role="tablist" aria-label="수집 종류">
          {(["word", "sentence"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => {
                setTab(tab);
                setMenuId(null);
              }}
              className={`h-8 w-13 text-sm font-bold ${
                activeTab === tab ? "bg-[#898F72] text-[#FFFEFB]" : "bg-[#DEDAD6] text-[#887D77]"
              }`}
            >
              {tab === "word" ? "단어" : "문장"}
            </button>
          ))}
        </div>

        {/* 단어 / 문장 목록 */}
        <section className="grid min-h-140 grid-cols-[minmax(0,1fr)_34px] border border-[#ECE9E3] bg-[#F7F6F1]">
          <div className="min-w-0">
            {/* 목록 상단 */}
            <div className="flex h-12 items-center justify-between border-b border-[#DDD7D1] px-5 text-sm font-semibold">
              <span className="text-[#9D938D]">
                {currentInitial} · {totalCount}개
              </span>

              <span className="text-[#727272]">최근순</span>
            </div>

            {/* 최초 로딩 */}
            {activeTab === "word" && isPending && (
              <p className="px-4 py-16 text-center text-sm text-[#9D938D]">
                단어장을 불러오는 중입니다.
              </p>
            )}

            {/* 에러 */}
            {activeTab === "word" && isError && (
              <p className="px-4 py-16 text-center text-sm text-[#9D938D]">
                단어장을 불러오지 못했습니다.
              </p>
            )}

            {/* 목록 */}
            {activeTab === "sentence" && (isSentencePending || isSentenceError) && (
              <p className="px-4 py-16 text-center text-sm text-[#9D938D]">
                {isSentenceError ? "문장을 불러오지 못했습니다." : "문장을 불러오는 중입니다."}
              </p>
            )}
            {!(activeTab === "word"
              ? isPending || isError
              : isSentencePending || isSentenceError) &&
              items.map((item) => (
                <VocabularyItem
                  key={item.id}
                  item={item}
                  menuOpen={menuId === item.id}
                  onToggleMenu={() => setMenuId(menuId === item.id ? null : item.id)}
                  onCloseMenu={() => setMenuId(null)}
                  onDetail={() => {
                    if (activeTab === "sentence") {
                      navigate(`/vocabulary/sentence/${item.id}`);
                    } else if (activeTab === "word") {
                      navigate(`/vocabulary/word/${item.id}`);
                    }
                  }}
                  onDelete={() => {
                    setMenuId(null);
                    setDeleteId(item.id);
                  }}
                />
              ))}

            {/* 단어 빈 목록 */}
            {activeTab === "word" && !isPending && !isError && items.length === 0 && (
              <p className="px-4 py-16 text-center text-sm text-[#9D938D]">
                해당 초성으로 수집한 단어가 없습니다.
              </p>
            )}

            {/* 문장 빈 목록 */}
            {activeTab === "sentence" &&
              !isSentencePending &&
              !isSentenceError &&
              items.length === 0 && (
                <p className="px-4 py-16 text-center text-sm text-[#9D938D]">
                  수집한 문장이 없습니다.
                </p>
              )}
          </div>

          {/* 초성 필터 */}
          <aside aria-label="초성 필터" className="border-l border-[#E4E0DB] py-2">
            {availableInitials.map((initial) => (
              <button
                type="button"
                key={initial}
                aria-pressed={currentInitial === initial}
                onClick={() => {
                  setInitial(initial);
                  setMenuId(null);
                }}
                className="flex h-7 w-full items-center justify-center"
              >
                <span
                  className={`flex h-6.5 w-5 items-center justify-center text-xs ${
                    currentInitial === initial ? "bg-[#B7BD9F]" : ""
                  }`}
                >
                  {initial}
                </span>
              </button>
            ))}
          </aside>
        </section>
      </div>

      {/* 삭제 확인 모달 */}
      {deleteId !== null && (
        <DeleteConfirmModal
          type={activeTab}
          onConfirm={() => void handleDelete()}
          onClose={() => setDeleteId(null)}
        />
      )}

      {/* 삭제 완료 토스트 */}
      {toast && <VocabularyToast onClose={() => setToast(false)} />}
    </main>
  );
}

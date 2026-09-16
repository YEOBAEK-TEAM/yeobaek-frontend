import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/common/header/Header";
import DeleteConfirmModal from "@/components/vocabulary/DeleteConfirmModal";
import VocabularyItem from "@/components/vocabulary/VocabularyItem";
import VocabularyToast from "@/components/vocabulary/VocabularyToast";

import { useVocabularyList } from "@/hooks/useVocabularyList";

import { useVocabularyStore } from "@/stores/vocabulary";

import type { WordListItem } from "@/types/vocabulary";

const initialList = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

export default function VocabularyPage() {
  const navigate = useNavigate();

  const { sentences, activeTab, activeInitial, setTab, setInitial, deleteItem } =
    useVocabularyStore();

  const [menuId, setMenuId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState(false);

  // 단어 탭일 때만 단어장 목록 API 호출
  const {
    data: vocabularyData,
    isPending,
    isError,
  } = useVocabularyList(activeInitial, activeTab === "word");

  // API 응답을 기존 VocabularyItem에서 사용할 수 있는 형태로 변환
  const words: WordListItem[] =
    vocabularyData?.items.map((item) => ({
      id: item.vocabularyId,
      word: item.word,
      meaning: item.meaning,
      bookTitle: item.bookTitle,
      page: item.pageNumber,
      collectedAt: item.createdAt,
    })) ?? [];

  // 단어는 API 데이터, 문장은 기존 Zustand 데이터 사용
  const items =
    activeTab === "word"
      ? words
      : [...sentences].sort((a, b) => Date.parse(b.collectedAt) - Date.parse(a.collectedAt));

  // 단어는 현재 페이지 items.length가 아니라
  // 서버에서 내려주는 전체 개수 totalCount 사용
  const totalCount = activeTab === "word" ? (vocabularyData?.totalCount ?? 0) : sentences.length;

  const handleDelete = () => {
    if (deleteId === null) return;

    // 문장 삭제는 기존 목데이터 로직 유지
    if (activeTab === "sentence") {
      deleteItem("sentence", deleteId);
      setToast(true);
    }

    // TODO: 단어 삭제 API 연동 후 처리
    setDeleteId(null);
  };

  return (
    <main className="flex-1">
      <Header title="서후의 글귀수집" />

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
                {activeInitial} · {totalCount}개
              </span>

              <span className="text-[#727272]">최근순</span>
            </div>

            {/* 단어 목록 로딩 */}
            {activeTab === "word" && isPending && (
              <p className="px-4 py-16 text-center text-sm text-[#9D938D]">
                단어장을 불러오는 중입니다.
              </p>
            )}

            {/* 단어 목록 에러 */}
            {activeTab === "word" && isError && (
              <p className="px-4 py-16 text-center text-sm text-[#9D938D]">
                단어장을 불러오지 못했습니다.
              </p>
            )}

            {/* 목록 */}
            {!(activeTab === "word" && (isPending || isError)) &&
              items.map((item) => (
                <VocabularyItem
                  key={item.id}
                  item={item}
                  menuOpen={menuId === item.id}
                  onToggleMenu={() => setMenuId(menuId === item.id ? null : item.id)}
                  onCloseMenu={() => setMenuId(null)}
                  onDetail={() => navigate(`/vocabulary/${activeTab}/${item.id}`)}
                  onDelete={() => {
                    setMenuId(null);
                    setDeleteId(item.id);
                  }}
                />
              ))}

            {/* 빈 목록 */}
            {activeTab === "word" && !isPending && !isError && items.length === 0 && (
              <p className="px-4 py-16 text-center text-sm text-[#9D938D]">
                해당 초성으로 수집한 단어가 없습니다.
              </p>
            )}

            {activeTab === "sentence" && items.length === 0 && (
              <p className="px-4 py-16 text-center text-sm text-[#9D938D]">
                수집한 문장이 없습니다.
              </p>
            )}
          </div>

          {/* 초성 필터 */}
          <aside aria-label="초성 필터" className="border-l border-[#E4E0DB] py-2">
            {initialList.map((initial) => (
              <button
                type="button"
                key={initial}
                aria-pressed={activeInitial === initial}
                onClick={() => {
                  setInitial(initial);
                  setMenuId(null);
                }}
                className="flex h-7 w-full items-center justify-center"
              >
                <span
                  className={`flex h-6.5 w-5 items-center justify-center text-xs ${
                    activeInitial === initial ? "bg-[#B7BD9F]" : ""
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
          onConfirm={handleDelete}
          onClose={() => setDeleteId(null)}
        />
      )}

      {/* 삭제 완료 토스트 */}
      {toast && <VocabularyToast onClose={() => setToast(false)} />}
    </main>
  );
}

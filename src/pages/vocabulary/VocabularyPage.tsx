import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/common/header/Header";
import DeleteConfirmModal from "@/components/vocabulary/DeleteConfirmModal";
import VocabularyItem from "@/components/vocabulary/VocabularyItem";
import VocabularyToast from "@/components/vocabulary/VocabularyToast";

import { useDeleteVocabulary } from "@/hooks/useDeleteVocabulary";
import { useDeleteSentence } from "@/hooks/useDeleteSentence";
import { useSentenceList } from "@/hooks/useSentenceList";
import { useVocabularyList } from "@/hooks/useVocabularyList";

import { useVocabularyStore } from "@/stores/vocabulary";

import type { WordListItem } from "@/types/vocabulary";
import type { SentenceListItem } from "@/types/sentence";

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

  const { activeTab, activeInitial, setTab, setInitial } = useVocabularyStore();

  const [menuId, setMenuId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState(false);

  // 무한 스크롤 감지 요소
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 단어 삭제 API
  const { mutateAsync: deleteVocabulary } = useDeleteVocabulary();
  const { mutateAsync: deleteSentence } = useDeleteSentence();

  const {
    data: sentenceData,
    isPending: isSentencePending,
    isError: isSentenceError,
  } = useSentenceList(activeTab === "sentence");

  const sentences: SentenceListItem[] = (sentenceData ?? []).map((item) => ({
    id: item.sentenceId,
    content: item.content,
    bookTitle: item.bookTitle,
    page: item.pageNumber,
    collectedAt: item.createdAt,
  }));

  // 단어 탭일 때만 단어장 목록 API 호출
  const {
    data: vocabularyData,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVocabularyList(activeInitial, activeTab === "word");

  // 여러 페이지의 단어 데이터를 하나의 배열로 합치기
  const vocabularyItems = vocabularyData?.pages.flatMap((page) => page.items) ?? [];

  // API 응답을 목록 UI용 데이터로 변환
  const words: WordListItem[] = vocabularyItems.map((item) => ({
    id: item.vocabularyId,
    word: item.word,
    meaning: item.meaning,
    bookTitle: item.bookTitle,
    page: item.pageNumber,
    collectedAt: item.createdAt,
  }));

  // 단어 / 문장 API 데이터를 목록에 표시
  const items =
    activeTab === "word"
      ? words
      : [...sentences].sort((a, b) => Date.parse(b.collectedAt) - Date.parse(a.collectedAt));

  // 전체 개수
  const totalCount =
    activeTab === "word" ? (vocabularyData?.pages[0]?.totalCount ?? 0) : sentences.length;

  // 목록 마지막이 화면에 들어오면 다음 페이지 요청
  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || activeTab !== "word" || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [activeTab, fetchNextPage, hasNextPage, isFetchingNextPage]);

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
                  onDetail={() => navigate(`/vocabulary/${activeTab}/${item.id}`)}
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

            {/* 무한 스크롤 감지 영역 */}
            {activeTab === "word" && <div ref={loadMoreRef} className="h-1" />}

            {/* 다음 페이지 로딩 */}
            {activeTab === "word" && isFetchingNextPage && (
              <p className="py-4 text-center text-xs text-[#9D938D]">더 불러오는 중입니다.</p>
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
          onConfirm={() => void handleDelete()}
          onClose={() => setDeleteId(null)}
        />
      )}

      {/* 삭제 완료 토스트 */}
      {toast && <VocabularyToast onClose={() => setToast(false)} />}
    </main>
  );
}

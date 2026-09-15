import { useState } from "react";

import Header from "@/components/common/header/Header";
import VocabularyItem from "@/components/vocabulary/VocabularyItem";

import { mockVocabulary } from "@/mocks/vocabulary";

type Tab = "word" | "sentence";

export default function VocabularyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("word");

  // 최근 수집한 단어가 위로 오도록 정렬
  const sortedVocabulary = [...mockVocabulary].sort(
    (a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime(),
  );

  return (
    <main className="min-h-screen">
      {/*API 연동 시 사용자 이름으로 변경 */}
      <Header title="서후의 글귀 수집" />

      <div className="px-5 pt-8">
        {/* 단어 / 문장 탭 */}
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab("word")}
            className={`px-5 py-3 text-base font-bold ${
              activeTab === "word" ? "bg-[#35231F] text-white" : "bg-[#DDD8D3] text-[#8B7E77]"
            }`}
          >
            단어
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sentence")}
            className={`px-5 py-3 text-base font-bold ${
              activeTab === "sentence" ? "bg-[#35231F] text-white" : "bg-[#DDD8D3] text-[#8B7E77]"
            }`}
          >
            문장
          </button>
        </div>

        {/* 단어 탭 */}
        {activeTab === "word" && (
          <section className="border border-[#E2DDD8]">
            {/* 목록 상단 */}
            <div className="flex items-center justify-between border-b border-[#E2DDD8] px-4 py-4">
              <span className="text-sm font-semibold text-[#A69D97]">
                ㅅ · {sortedVocabulary.length}개
              </span>

              <button type="button" className="text-sm text-[#A69D97]">
                최근순
              </button>
            </div>

            {/* 수집한 단어 목록 */}
            <div>
              {sortedVocabulary.map((vocabulary) => (
                <VocabularyItem key={vocabulary.id} vocabulary={vocabulary} />
              ))}
            </div>
          </section>
        )}

        {/* 문장 탭 */}
        {activeTab === "sentence" && (
          <section className="border border-[#E2DDD8] py-20 text-center text-sm text-[#A69D97]">
            수집한 문장이 없습니다.
          </section>
        )}
      </div>
    </main>
  );
}

import { useState } from "react";

import Header from "@/components/common/header/Header";
import VocabularyItem from "@/components/vocabulary/VocabularyItem";

import { mockVocabulary } from "@/mocks/vocabulary";

type Tab = "word" | "sentence";

const initialList = ["ㄱ", "ㄴ", "ㄷ", "ㅁ", "ㅅ", "ㅇ", "ㅈ", "ㅎ"];

export default function VocabularyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("word");
  const [activeInitial, setActiveInitial] = useState("ㅅ");

  const sortedVocabulary = [...mockVocabulary].sort(
    (a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime(),
  );

  return (
    <main className="min-h-screen pb-22">
      {/* API 연동 시 사용자 이름으로 변경 */}
      <Header title="서후의 글귀수집" />

      <div className="mt-5 px-5">
        {/* 단어 / 문장 탭 */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setActiveTab("word")}
            className={`h-10 px-4 text-[15px] font-bold ${
              activeTab === "word" ? "bg-[#30201D] text-white" : "bg-[#DEDAD6] text-[#887D77]"
            }`}
          >
            단어
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sentence")}
            className={`ml-2 h-10 px-4 text-[15px] font-bold ${
              activeTab === "sentence" ? "bg-[#30201D] text-white" : "bg-[#DEDAD6] text-[#887D77]"
            }`}
          >
            문장
          </button>
        </div>

        {/* 단어 */}
        {activeTab === "word" && (
          <section className="grid min-h-167 grid-cols-[minmax(0,1fr)_44px] border border-[#E4E0DB] bg-[#FBFAF7]">
            {/* 왼쪽 영역 */}
            <div className="min-w-0">
              {/* 개수 / 정렬 */}
              <div className="flex h-13 items-center justify-between border-b border-[#E4E0DB] px-4">
                <span className="text-[14px] font-['Pretendard'] font-semibold text-[#9D938D]">
                  {activeInitial} · {sortedVocabulary.length}개
                </span>

                <button type="button" className="font-sans text-[14px] text-[#A69D97]">
                  최근순
                </button>
              </div>

              {/* 단어 목록 */}
              <div>
                {sortedVocabulary.map((vocabulary) => (
                  <VocabularyItem key={vocabulary.id} vocabulary={vocabulary} />
                ))}
              </div>
            </div>

            {/* 가나다 인덱스 */}
            <aside className="border-l border-[#E4E0DB]">
              <div className="flex flex-col items-center pt-2">
                {initialList.map((initial) => (
                  <button
                    key={initial}
                    type="button"
                    onClick={() => setActiveInitial(initial)}
                    className="flex h-8 w-full items-center justify-center"
                  >
                    <span
                      className={`flex h-7 w-8 items-center justify-center text-[12px] font-['Pretendard'] font-semibold ${
                        activeInitial === initial ? "bg-[#B8BE98] text-[#302A24]" : "text-[#AFA8A3]"
                      }`}
                    >
                      {initial}
                    </span>
                  </button>
                ))}
              </div>
            </aside>
          </section>
        )}

        {/* 문장 */}
        {activeTab === "sentence" && (
          <section className="min-h-167 border border-[#E4E0DB] bg-[#FBFAF7]">
            <div className="flex min-h-167 items-center justify-center text-[14px] text-[#AAA19A]">
              수집한 문장이 없습니다.
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

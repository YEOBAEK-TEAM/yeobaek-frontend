import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/common/header/Header";
import DeleteConfirmModal from "@/components/vocabulary/DeleteConfirmModal";
import { TrashIcon } from "@/components/vocabulary/VocabularyIcons";
import { useVocabularyStore } from "@/stores/vocabulary";

export default function WordDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { words, deleteItem, setTab } = useVocabularyStore();
  const word = words.find((item) => item.id === Number(id));
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const goBack = () => {
    setTab("word");
    navigate("/vocabulary");
  };
  const handleDelete = () => {
    if (word) deleteItem("word", word.id);
    goBack();
  };
  return (
    <main className="min-h-screen pb-10">
      <Header title="단어 상세" onBack={goBack} />
      {!word ? (
        <p className="px-5 py-12 text-center text-[#887D77]">단어를 찾을 수 없습니다.</p>
      ) : (
        <div className="px-5">
          <div className="mb-[21px] flex min-h-[76px] items-center border-b-2 border-[#E4E0DB] px-2 pb-4">
            <h2 className="font-serif text-[36px] leading-none text-black">{word.word}</h2>
            <span className="ml-4 self-end pb-2 text-base font-semibold text-[#665752]">
              {word.partOfSpeech}
            </span>
            <button
              type="button"
              aria-label="단어 삭제"
              onClick={() => setDeleting(true)}
              className="ml-auto flex h-10 w-10 items-center justify-center text-[#B2ABA6]"
            >
              <TrashIcon />
            </button>
          </div>
          <section aria-label="사전 정보" className="bg-[#F7F6F1] px-[19px] py-[22px]">
            <div className="flex items-center gap-2">
              <span className="flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full bg-[#4F411D] text-sm text-white">
                1
              </span>
              <h3 className="font-serif text-[23px] leading-7">{word.word}</h3>
              <span className="ml-1 text-xs text-[#8B8D80]">{word.partOfSpeech}</span>
            </div>
            <p className="mt-2 ml-[30px] font-serif text-[14px] leading-5">{word.meaning}</p>
            {word.otherMeanings.length > 0 && (
              <div className="mt-[26px] border-t border-[#D2D2CE] pt-3">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls="other-meanings"
                  onClick={() => setExpanded(!expanded)}
                  className="flex w-full items-center justify-center gap-2 text-sm text-[#74766D]"
                >
                  다른 뜻 {word.otherMeanings.length}개 {expanded ? "접기" : "더 보기"}
                  <span aria-hidden="true">{expanded ? "⌃" : "⌄"}</span>
                </button>
                {expanded && (
                  <ol id="other-meanings" className="mt-6 space-y-1">
                    {word.otherMeanings.map((meaning, index) => (
                      <li
                        key={meaning.meaning}
                        className="flex items-start gap-2 text-sm leading-5 text-[#646060]"
                      >
                        <span className="flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full bg-[#A29F94] text-[#4F411D]">
                          {index + 2}
                        </span>
                        <span>
                          {meaning.meaning}{" "}
                          <span className="ml-1 text-xs">{meaning.partOfSpeech}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}
            <ul className="mt-7 space-y-2 border-t border-[#D2D2CE] pt-4 font-serif text-base">
              {word.dictionaryExamples.map((example) => (
                <li key={example} className="flex gap-2">
                  <span className="text-[#4F411D]">•</span>
                  {example}
                </li>
              ))}
            </ul>
          </section>
          <section className="mt-6 px-1">
            <h3 className="text-base font-bold text-[#4F411D]">관련 단어</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {word.relatedWords.map((related) => (
                <span
                  key={related}
                  className="flex min-h-[37px] min-w-[89px] items-center justify-center rounded bg-[#B4ADA9] px-2 text-base text-black"
                >
                  {related}
                </span>
              ))}
            </div>
          </section>
          <section className="mt-6 px-1">
            <h3 className="text-base font-bold text-[#4F411D]">책속 예문</h3>
            <blockquote className="mt-4 font-serif text-lg leading-7">
              “ {word.example} ”
            </blockquote>
            <p className="mt-2 text-xs font-semibold text-[#9D938D]">
              {word.bookTitle} · p{word.page}
            </p>
          </section>
        </div>
      )}
      {deleting && (
        <DeleteConfirmModal
          type="word"
          onConfirm={handleDelete}
          onClose={() => setDeleting(false)}
        />
      )}
    </main>
  );
}

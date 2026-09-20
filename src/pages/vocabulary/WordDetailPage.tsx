import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/common/header/Header";
import DeleteConfirmModal from "@/components/vocabulary/DeleteConfirmModal";
import { TrashIcon } from "@/components/vocabulary/VocabularyIcons";
import { useVocabularyDetail } from "@/hooks/useVocabularyDetail";
import { useDeleteVocabulary } from "@/hooks/useDeleteVocabulary";
import { useContentPage } from "@/hooks/useContentPage";

export default function WordDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vocabularyId = Number(id);
  const { data: word, isPending, isError } = useVocabularyDetail(vocabularyId);
  const page = useContentPage(word?.pageId ?? NaN);
  const sentence = page.data?.sentences.find(
    (sentence) => sentence.sentenceId === word?.sentenceId,
  );
  const [expanded, setExpanded] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleting = useRef(false);
  const remove = useDeleteVocabulary();
  const goBack = () => navigate("/vocabulary");

  if (isPending || isError || !word) {
    return (
      <main className="flex-1">
        <Header title="단어 상세" onBack={goBack} />
        <p className="px-5 py-12 text-center text-sm text-[#887D77]">
          {isPending ? "단어 정보를 불러오는 중입니다." : "단어 정보를 불러오지 못했습니다."}
        </p>
      </main>
    );
  }
  const primarySense = word.senses[0];
  const otherSenses = word.senses.slice(1);
  return (
    <main className="flex-1 bg-[#FFFEFB]">
      <Header title="단어 상세" onBack={goBack} />
      <div className="px-5 pt-5 pb-12 sm:px-6">
        <div className="flex items-center justify-between gap-4 border-b border-[#E5E1DD] pb-6">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2 className="font-serif text-4xl leading-tight font-bold break-words text-black">
              {word.word}
            </h2>
            <span className="text-base font-semibold text-[#6A5750]">{word.pos}</span>
          </div>
          <button
            type="button"
            aria-label="단어 삭제"
            disabled={remove.isPending}
            onClick={() => {
              remove.reset();
              setDeleteOpen(true);
            }}
            className="flex size-11 shrink-0 items-center justify-center text-[#B1AAA6] disabled:opacity-50"
          >
            <TrashIcon />
          </button>
        </div>
        {primarySense && (
          <section
            aria-label="단어 뜻과 예문"
            className="mt-5 rounded-sm bg-[#F7F6F1] px-4 py-6 sm:px-5"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#51431C] text-sm text-white">
                1
              </span>
              <h3 className="font-serif text-2xl leading-tight text-black">{word.word}</h3>
              <span className="text-xs text-[#8A8A80]">{word.pos}</span>
            </div>
            <p className="mt-3 pl-8.5 font-serif text-base leading-7 break-words text-black">
              {primarySense.definition}
            </p>
            {otherSenses.length > 0 && (
              <div className="mt-6 border-t border-[#D3D2CD] pt-3">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls="other-word-senses"
                  onClick={() => setExpanded(!expanded)}
                  className="flex min-h-11 w-full items-center justify-center gap-2 text-sm text-[#74746F]"
                >
                  {expanded ? "다른 뜻 접기" : `다른 뜻 ${otherSenses.length}개 더 보기`}
                  <span
                    aria-hidden="true"
                    className={`size-2.5 rotate-45 border-[#74746F] ${expanded ? "translate-y-1 border-t-2 border-l-2" : "-translate-y-0.5 border-r-2 border-b-2"}`}
                  />
                </button>
                <ol id="other-word-senses" hidden={!expanded} className="mt-4 space-y-3">
                  {otherSenses.map((sense, index) => (
                    <li
                      key={sense.order}
                      className="flex items-start gap-2 text-sm leading-6 text-[#625F5D]"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#A19D90] text-[#51431C]">
                        {index + 2}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p>
                          {sense.definition}
                          <span className="ml-2 whitespace-nowrap text-xs">{word.pos}</span>
                        </p>
                        {sense.examples.length > 0 && (
                          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-[#887D77]">
                            {sense.examples.map((example, i) => (
                              <li key={i}>{example}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {primarySense.examples.length > 0 && (
              <ul
                aria-label="예문"
                className="mt-6 list-disc space-y-2 border-t border-[#D3D2CD] pt-4 pr-1 pl-5 font-serif text-base leading-7 text-black marker:text-[#51431C]"
              >
                {primarySense.examples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            )}
          </section>
        )}
        {page.isLoading && (
          <p role="status" className="mt-7 text-sm text-[#9D938D]">
            책속 예문을 불러오는 중입니다.
          </p>
        )}
        {page.isSuccess && sentence?.content && (
          <section aria-labelledby="book-example-title" className="mt-7">
            <h2 id="book-example-title" className="text-base font-bold text-[#51431C]">
              책속 예문
            </h2>
            <blockquote className="mt-4 font-serif text-xl leading-8 break-words text-black">
              “{sentence.content}”
            </blockquote>
            <p className="mt-3 text-sm font-semibold text-[#9D938D]">
              {word.bookTitle} · p{word.pageNumber}
            </p>
          </section>
        )}
        {remove.isError && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            단어를 삭제하지 못했습니다. 다시 시도해 주세요.
          </p>
        )}
      </div>
      {deleteOpen && (
        <DeleteConfirmModal
          type="word"
          onClose={() => {
            if (!deleting.current) setDeleteOpen(false);
          }}
          onConfirm={() => {
            if (deleting.current) return;
            deleting.current = true;
            remove.mutate(vocabularyId, {
              onSuccess: goBack,
              onError: () => setDeleteOpen(false),
              onSettled: () => {
                deleting.current = false;
              },
            });
          }}
        />
      )}
    </main>
  );
}

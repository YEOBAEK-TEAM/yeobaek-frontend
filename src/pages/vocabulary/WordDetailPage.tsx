import { useNavigate, useParams } from "react-router-dom";

import Header from "@/components/common/header/Header";

import { useVocabularyDetail } from "@/hooks/useVocabularyDetail";

export default function WordDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const vocabularyId = Number(id);

  const { data: word, isPending, isError } = useVocabularyDetail(vocabularyId);

  const goBack = () => {
    navigate("/vocabulary");
  };

  if (isPending) {
    return (
      <main className="flex-1">
        <Header title="단어 상세" onBack={goBack} />

        <p className="px-5 py-12 text-center text-sm text-[#887D77]">
          단어 정보를 불러오는 중입니다.
        </p>
      </main>
    );
  }

  if (isError || !word) {
    return (
      <main className="flex-1">
        <Header title="단어 상세" onBack={goBack} />

        <p className="px-5 py-12 text-center text-sm text-[#887D77]">
          단어 정보를 불러오지 못했습니다.
        </p>
      </main>
    );
  }

  const primarySense = word.senses[0];
  const otherSenses = word.senses.slice(1);

  return (
    <main className="flex-1">
      <Header title="단어 상세" onBack={goBack} />

      <section className="px-6 py-6">
        {/* 단어 / 품사 */}
        <div className="flex items-end gap-2">
          <h1 className="font-serif text-2xl font-bold text-[#392620]">{word.word}</h1>

          <span className="text-sm text-[#887D77]">{word.pos}</span>
        </div>

        {/* 기본 뜻 */}
        {primarySense && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold text-[#887D77]">뜻</h2>

            <p className="mt-2 font-serif text-base leading-6 text-[#392620]">
              {primarySense.definition}
            </p>
          </section>
        )}

        {/* 사전 예문 */}
        {primarySense?.examples.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold text-[#887D77]">예문</h2>

            <div className="mt-2 space-y-2">
              {primarySense.examples.map((example) => (
                <p key={example} className="font-serif text-sm leading-6 text-[#6A5750]">
                  “{example}”
                </p>
              ))}
            </div>
          </section>
        )}

        {/* 다른 뜻 */}
        {otherSenses.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold text-[#887D77]">다른 뜻</h2>

            <div className="mt-3 space-y-3">
              {otherSenses.map((sense) => (
                <div key={sense.order}>
                  <p className="font-serif text-sm leading-6 text-[#392620]">
                    {sense.order}. {sense.definition}
                  </p>

                  {sense.examples.length > 0 && (
                    <div className="mt-1">
                      {sense.examples.map((example) => (
                        <p key={example} className="text-xs leading-5 text-[#8A8A88]">
                          “{example}”
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 저장 위치 */}
        <section className="mt-8 border-t border-[#DDD7D1] pt-4">
          <p className="text-xs text-[#9D938D]">
            {word.bookTitle} · p{word.pageNumber}
          </p>
        </section>
      </section>
    </main>
  );
}

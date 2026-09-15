import type { Vocabulary } from "@/types/vocabulary";

type VocabularyItemProps = {
  vocabulary: Vocabulary;
};

export default function VocabularyItem({ vocabulary }: VocabularyItemProps) {
  return (
    <div className="flex border-b border-dashed border-[#DDD7D1]">
      {/* 페이지 */}
      <div className="w-16 shrink-0 px-2 py-5 text-sm text-[#B6AFAA]">{vocabulary.page}p</div>

      {/* 단어 정보 */}
      <div className="flex-1 border-l border-[#CBB8AC] px-4 py-5">
        <div className="flex items-end gap-2">
          <h2 className="text-xl font-semibold text-[#35231F]">{vocabulary.word}</h2>

          <span className="text-sm text-[#AAA19A]">{vocabulary.partOfSpeech}</span>
        </div>

        <p className="mt-2 text-base text-[#65534D]">{vocabulary.meaning}</p>

        <p className="mt-2 text-sm text-[#B6AFAA]">{vocabulary.bookTitle}</p>
      </div>
    </div>
  );
}

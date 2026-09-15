import type { Vocabulary } from "@/types/vocabulary";

type VocabularyItemProps = {
  vocabulary: Vocabulary;
};

export default function VocabularyItem({ vocabulary }: VocabularyItemProps) {
  return (
    <div className="grid min-h-21 grid-cols-[44px_1fr] font-['Pretendard'] border-b border-dashed border-[#DDD7D1]">
      {/* 페이지 번호 */}
      <div className="border-r border-[#D2B4A3] px-1 pt-4 text-center text-[12px] text-[#B6ADA8]">
        {vocabulary.page}p
      </div>

      {/* 단어 정보 */}
      <div className="px-4 py-3">
        <div className="flex items-end gap-2">
          <h2 className="font-serif text-[21px] leading-none text-[#392620]">{vocabulary.word}</h2>

          <span className="text-[12px] text-[#AAA19A]">{vocabulary.partOfSpeech}</span>
        </div>

        <p className="mt-3 font-serif text-[14px] leading-none text-[#6A5750]">
          {vocabulary.meaning}
        </p>

        <p className="mt-3 text-[11px] text-[#B7AFAA]">{vocabulary.bookTitle}</p>
      </div>
    </div>
  );
}

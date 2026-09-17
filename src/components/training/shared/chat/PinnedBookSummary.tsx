type PinnedBookSummaryProps = {
  coverUrl: string;
  title: string;
  subtitle: string;
  pageRange?: string;
};

// 대화 상단 고정 책 배너
export default function PinnedBookSummary({
  coverUrl,
  title,
  subtitle,
  pageRange,
}: PinnedBookSummaryProps) {
  // 내용 길이와 무관하게 중앙 좌측에 고정
  return (
    <div className="mb-3 flex shrink-0 items-center gap-4 border-y border-[#C4BFB6] bg-white py-4 pr-5 pl-14">
      <img src={coverUrl} alt="" className="h-21 w-15 shrink-0 rounded-sm object-cover" />

      <div className="min-w-0">
        <p className="truncate text-[20px] font-bold text-[#2C2A2B]">{title}</p>

        <p className="mt-1.5 truncate text-[14px] text-[#4F4D4E]">{subtitle}</p>

        {pageRange && <p className="mt-1 text-[14px] text-[#ABA394]">{pageRange}</p>}
      </div>
    </div>
  );
}

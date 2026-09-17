import { formatPageRange } from "@/utils/training/formatPageRange";

export default function BookmarkRangeLabel({
  startPage,
  endPage,
}: {
  startPage: number;
  endPage: number;
}) {
  return <span className="text-[16px] text-[#4F4D4E]">{formatPageRange(startPage, endPage)}</span>;
}

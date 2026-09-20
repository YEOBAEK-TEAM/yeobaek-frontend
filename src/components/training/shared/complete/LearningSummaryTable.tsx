import { LEARNING_SUMMARY_TITLE } from "@/constants/training/bookReportChat";

export type LearningSummaryRow = {
  label: string;
  value: string;
};

export default function LearningSummaryTable({ rows }: { rows: LearningSummaryRow[] }) {
  return (
    <section className="px-9">
      <h2 className="text-[18px] font-bold text-[#4F4D4E]">{LEARNING_SUMMARY_TITLE}</h2>

      <dl className="mt-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex gap-4 border-b border-[#EAE7E1] py-5 last:border-b-0"
          >
            <dt className="w-21 shrink-0 text-[15px] font-bold text-[#4F4D4E]">{row.label}</dt>
            <dd className="flex-1 text-[15px] leading-[23px] text-[#54555A]">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

type ReportDateFieldProps = {
  id: string;
  label: string;
};

// 저장하는 날짜가 그대로 기록되어 표시만
export default function ReportDateField({ id, label }: ReportDateFieldProps) {
  return (
    <div
      id={id}
      className="flex h-16.5 items-center rounded-2xl border-2 border-[#D3D0C3] bg-[#F9FAFB] pr-5 pl-5"
    >
      <span className="text-[22px] text-[#4F4D4E] tabular-nums">{label}</span>
    </div>
  );
}

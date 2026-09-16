export default function CalendarLegend() {
  return (
    <ul
      aria-label="읽은 페이지 색상 범례"
      className="mt-6 flex flex-wrap justify-between gap-y-2 text-xs font-medium text-[#555]"
    >
      {[
        ["1~30p", "bg-[#DFE5C8]"],
        ["31~60p", "bg-[#BFC6A5]"],
        ["61~100p", "bg-[#9FA789]"],
        ["101p 이상", "bg-[#60664C]"],
      ].map(([label, color]) => (
        <li key={label} className="flex items-center gap-1">
          <span className={`size-6 rounded-full ${color}`} />
          {label}
        </li>
      ))}
    </ul>
  );
}

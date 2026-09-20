export function ArrowIcon({ back = false }: { back?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
    >
      <path
        d={back ? "m15 4-8 8 8 8" : "M5 12h14m-7-7 7 7-7 7"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6 shrink-0"
    >
      <path d="m9 4 8 8-8 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

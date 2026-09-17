import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
};

export default function FormField({ label, htmlFor, hint, children }: FormFieldProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between px-1">
        <label htmlFor={htmlFor} className="text-[16px] font-bold text-[#4F4D4E]">
          {label}
        </label>

        {hint && <span className="text-[13px] text-[#A8ABB2] tabular-nums">{hint}</span>}
      </div>

      <div className="mt-2.5">{children}</div>
    </div>
  );
}

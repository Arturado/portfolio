import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldBase =
  "w-full rounded-sm border border-ink/25 bg-paper px-3 py-2 font-sans text-body text-ink " +
  "placeholder:text-graphite/40 transition-colors motion-reduce:transition-none " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blueprint " +
  "focus:border-blueprint";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(fieldBase, className)} {...props} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(fieldBase, "resize-y", className)} {...props} />;
});

interface FieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="font-mono text-mono-xs uppercase tracking-wider text-graphite/70"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

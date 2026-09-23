import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "blueprint" | "signal";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const tones: Record<BadgeTone, string> = {
  blueprint: "border-blueprint/35 bg-blueprint/8 text-blueprint",
  signal: "border-signal/40 bg-signal/10 text-signal",
};

export function Badge({ children, tone = "blueprint", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-mono-xs uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

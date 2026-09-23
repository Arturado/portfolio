import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SectionWidth = "narrow" | "default" | "wide";

interface SectionProps {
  children: ReactNode;
  as?: ElementType;
  width?: SectionWidth;
  /** Kicker tipo anotacion tecnica (ej. "01 — PROYECTOS"), monospace. */
  label?: string;
  className?: string;
}

const widths: Record<SectionWidth, string> = {
  narrow: "max-w-2xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
};

export function Section({
  children,
  as: Tag = "section",
  width = "default",
  label,
  className,
}: SectionProps) {
  return (
    <Tag className={cn("w-full px-4 py-16 sm:px-6 lg:px-8", className)}>
      <div className={cn("mx-auto", widths[width])}>
        {label && (
          <p className="mb-4 flex items-center gap-2 font-mono text-mono-xs uppercase tracking-widest text-blueprint">
            <span aria-hidden className="h-px w-6 bg-blueprint/50" />
            {label}
          </p>
        )}
        {children}
      </div>
    </Tag>
  );
}

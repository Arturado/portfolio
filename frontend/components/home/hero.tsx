"use client";

import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { cn } from "@/lib/cn";
import { useOrchestratedEntry } from "@/lib/motion";

export function Hero() {
  const { getStepProps } = useOrchestratedEntry();

  const kicker = getStepProps(0);
  const title = getStepProps(1);
  const subtitle = getStepProps(2);
  const actions = getStepProps(3);

  return (
    <div className="border-b border-ink/15 bg-ink px-4 py-20 text-paper sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p
          className={cn(kicker.className, "font-mono text-mono-sm uppercase tracking-widest text-blueprint")}
          style={kicker.style}
        >
          Hanowar — dev full-stack
        </p>
        <h1
          className={cn(title.className, "mt-4 max-w-3xl font-display text-display text-paper")}
          style={title.style}
        >
          Construyo software con criterio.
        </h1>
        <p
          className={cn(subtitle.className, "mt-4 max-w-xl text-body-lg text-paper/75")}
          style={subtitle.style}
        >
          Backend, frontend y deploy propio — de punta a punta, sin atajos. Cada proyecto
          acá abajo está en producción o lo estuvo.
        </p>
        <div
          className={cn(actions.className, "mt-8 flex flex-wrap items-center gap-6")}
          style={actions.style}
        >
          <Link href="/proyectos" className={buttonClasses("primary")}>
            Ver proyectos
          </Link>
          <StatusIndicator className="text-paper/70" />
        </div>
      </div>
    </div>
  );
}

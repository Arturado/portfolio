"use client";

import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { cn } from "@/lib/cn";
import { useOrchestratedEntry } from "@/lib/motion";

/**
 * Demo de la secuencia de entrada orquestada del hero (utilidad de
 * lib/motion.ts). El hero real se construye en Fase 8; esto solo
 * verifica visualmente que el hook funciona y respeta reduced motion.
 */
export function HeroPreview() {
  const { getStepProps, replay, reducedMotion } = useOrchestratedEntry();

  const kicker = getStepProps(0);
  const title = getStepProps(1);
  const subtitle = getStepProps(2);
  const actions = getStepProps(3);

  return (
    <div className="border border-ink/15 bg-ink px-8 py-14 text-paper">
      <p
        className={cn(kicker.className, "font-mono text-mono-sm uppercase tracking-widest text-blueprint")}
        style={kicker.style}
      >
        Hanowar — dev full-stack
      </p>
      <h1
        className={cn(title.className, "mt-4 font-display text-display text-paper")}
        style={title.style}
      >
        Construyo software con criterio.
      </h1>
      <p
        className={cn(subtitle.className, "mt-4 max-w-xl text-body-lg text-paper/75")}
        style={subtitle.style}
      >
        Backend FastAPI, frontend Next.js, deploy propio. Sin humo, con status real.
      </p>
      <div
        className={cn(actions.className, "mt-8 flex flex-wrap items-center gap-4")}
        style={actions.style}
      >
        <Button variant="primary">Ver proyectos</Button>
        <StatusIndicator className="text-paper/70" />
      </div>

      <div className="mt-10 flex items-center gap-4 border-t border-paper/10 pt-4">
        <button
          type="button"
          onClick={replay}
          className="font-mono text-mono-xs uppercase tracking-wider text-blueprint underline decoration-blueprint/40 underline-offset-4 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blueprint"
        >
          Replay entrada
        </button>
        <span className="font-mono text-mono-xs text-paper/50">
          prefers-reduced-motion: {reducedMotion ? "reduce" : "no-preference"}
        </span>
      </div>
    </div>
  );
}

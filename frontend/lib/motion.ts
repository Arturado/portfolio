"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

interface StepProps {
  className: string;
  style?: CSSProperties;
}

const STEP_DELAY_MS = 110;

/**
 * Orquesta la entrada de una secuencia de elementos (ej. hero: kicker,
 * titulo, subtitulo, CTA) con un stagger progresivo. Se dispara una sola
 * vez al montar `key`. Si el usuario prefiere reduced motion, los
 * elementos aparecen directamente sin transicion.
 */
export function useOrchestratedEntry(key: unknown = "default") {
  const reducedMotion = usePrefersReducedMotion();
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    setStarted(false);
    const raf = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, run]);

  function getStepProps(step: number): StepProps {
    if (reducedMotion) {
      return { className: "opacity-100 translate-y-0" };
    }

    return {
      className: cnStep(started),
      style: { transitionDelay: `${step * STEP_DELAY_MS}ms` },
    };
  }

  return { reducedMotion, started, getStepProps, replay: () => setRun((r) => r + 1) };
}

function cnStep(started: boolean) {
  return [
    "transition-[opacity,transform] duration-700 ease-out",
    started ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
  ].join(" ");
}

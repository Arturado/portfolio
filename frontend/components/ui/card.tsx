import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("border border-ink/15 bg-paper p-6", className)}>{children}</div>
  );
}

export interface ProjectCardProps {
  title: string;
  description: string;
  stack: string[];
  repoUrl?: string | null;
  demoUrl?: string | null;
}

/**
 * Al hacer hover, el marcador junto al titulo "dispara" una linea que
 * conecta con el stack en monospace — una anotacion tecnica, no un
 * shadow-lift generico. La linea es un trazo fijo (no calculado por
 * coordenadas reales) para mantenerla robusta dentro de un grid.
 */
export function ProjectCard({ title, description, stack, repoUrl, demoUrl }: ProjectCardProps) {
  return (
    <article className="group relative overflow-hidden border border-ink/15 bg-paper p-6 transition-colors motion-reduce:transition-none hover:border-blueprint/50">
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blueprint transition-transform duration-300 motion-reduce:transition-none group-hover:scale-150"
        />
        <div>
          <h3 className="font-display text-h3 text-ink">{title}</h3>
          <p className="mt-2 text-body text-graphite/80">{description}</p>
        </div>
      </div>

      {/* Leader-line: vertical desde el marcador, luego horizontal hacia el stack */}
      <div aria-hidden className="pointer-events-none ml-[3px] h-4 w-px origin-top scale-y-0 bg-blueprint/40 transition-transform duration-300 motion-reduce:scale-y-100 motion-reduce:transition-none group-hover:scale-y-100" />
      <div aria-hidden className="pointer-events-none ml-[3px] h-px w-6 origin-left scale-x-0 bg-blueprint/40 transition-transform delay-150 duration-300 motion-reduce:scale-x-100 motion-reduce:transition-none group-hover:scale-x-100" />

      <div className="ml-[3px] flex translate-x-1 flex-wrap gap-1.5 opacity-0 transition-all delay-200 duration-300 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none group-hover:translate-x-0 group-hover:opacity-100">
        {stack.map((tech) => (
          <span
            key={tech}
            className="rounded-sm border border-blueprint/35 bg-blueprint/8 px-1.5 py-0.5 font-mono text-mono-xs uppercase tracking-wider text-blueprint"
          >
            {tech}
          </span>
        ))}
      </div>

      {(repoUrl || demoUrl) && (
        <div className="mt-4 flex gap-4 font-mono text-mono-sm text-graphite/70">
          {repoUrl && (
            <a
              href={repoUrl}
              className="underline decoration-blueprint/40 underline-offset-4 hover:text-blueprint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blueprint"
            >
              repo
            </a>
          )}
          {demoUrl && (
            <a
              href={demoUrl}
              className="underline decoration-blueprint/40 underline-offset-4 hover:text-blueprint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blueprint"
            >
              demo
            </a>
          )}
        </div>
      )}
    </article>
  );
}

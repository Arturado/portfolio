import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { HeroPreview } from "@/components/design-preview/hero-preview";

export const metadata: Metadata = {
  title: "Design preview",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "ink", hex: "#101825", className: "bg-ink" },
  { name: "paper", hex: "#ECEAE3", className: "border border-ink/15 bg-paper" },
  { name: "graphite", hex: "#1B2430", className: "bg-graphite" },
  { name: "blueprint", hex: "#4C86AD", className: "bg-blueprint" },
  { name: "signal", hex: "#E08A3C", className: "bg-signal" },
  { name: "status-online", hex: "#4C9A6A", className: "bg-status-online" },
  { name: "status-offline", hex: "#B5473A", className: "bg-status-offline" },
];

const sampleProjects = [
  {
    title: "arturodev.info",
    description: "Portfolio autoadministrable con panel admin custom y blog propio.",
    stack: ["FastAPI", "Next.js", "PostgreSQL", "Docker"],
    repoUrl: "#",
    demoUrl: "#",
  },
  {
    title: "Pipeline de ingesta",
    description: "Procesamiento de eventos en tiempo real con reintentos y dead-letter queue.",
    stack: ["Python", "Kafka", "Redis"],
    repoUrl: "#",
    demoUrl: null,
  },
];

export default function DesignPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Section width="wide" className="pb-0 pt-10">
        <h1 className="font-display text-h1 text-ink">Sistema de diseño</h1>
        <p className="mt-2 max-w-2xl text-body text-graphite/70">
          Ruta temporal de revisión visual (Fase 7) — no linkeada desde ningún lado público.
          No usar como contenido real.
        </p>
      </Section>

      <Section width="wide" label="00 — HERO / STATUS">
        <HeroPreview />
      </Section>

      <Section width="wide" label="01 — PALETA">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {swatches.map((s) => (
            <div key={s.name}>
              <div className={`h-16 ${s.className}`} />
              <p className="mt-2 font-mono text-mono-xs uppercase tracking-wider text-graphite/70">
                {s.name}
              </p>
              <p className="font-mono text-mono-xs text-graphite/45">{s.hex}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section width="wide" label="02 — TIPOGRAFÍA">
        <div className="space-y-6">
          <p className="font-display text-display text-ink">Display / Fraunces</p>
          <p className="font-display text-h1 text-ink">Heading 1 / Fraunces</p>
          <p className="font-display text-h2 text-ink">Heading 2 / Fraunces</p>
          <p className="font-display text-h3 text-ink">Heading 3 / Fraunces</p>
          <p className="max-w-xl text-body-lg text-graphite">
            Body large / IBM Plex Sans — para intros y descripciones destacadas.
          </p>
          <p className="max-w-xl text-body text-graphite">
            Body / IBM Plex Sans — texto de lectura estándar, con line-height generoso
            para mantener legibilidad en párrafos largos.
          </p>
          <p className="font-mono text-mono-sm uppercase tracking-wider text-blueprint">
            mono-sm / JetBrains Mono — datos reales (status, versión)
          </p>
          <p className="font-mono text-mono-xs uppercase tracking-wider text-blueprint">
            mono-xs / JetBrains Mono — stack tags
          </p>
        </div>
      </Section>

      <Section width="wide" label="03 — BOTONES">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" size="sm">
            Primary sm
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </Section>

      <Section width="wide" label="04 — BADGES">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>React</Badge>
          <Badge>FastAPI</Badge>
          <Badge tone="signal">v2.4.0</Badge>
        </div>
      </Section>

      <Section width="wide" label="05 — PROJECT CARD (hover para ver el stack)">
        <div className="grid gap-6 sm:grid-cols-2">
          {sampleProjects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </Section>

      <Section width="wide" label="06 — STATUS INDICATOR">
        <p className="mb-4 max-w-xl text-body text-graphite/70">
          Hace fetch real a <code className="font-mono text-mono-sm">GET /health</code>{" "}
          cada 15s. Apagar el backend para verificar que cambia a offline.
        </p>
        <StatusIndicator />
      </Section>
    </div>
  );
}

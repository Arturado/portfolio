import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/proyectos/projects-grid";
import { Section } from "@/components/ui/section";
import { apiFetch } from "@/lib/api";
import type { Project } from "@/lib/types";

// Se genera en cada request (no en build time): en el build de Docker el
// backend todavia no esta accesible en la red del compose.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Proyectos reales de desarrollo full-stack: backend, frontend y deploy.",
};

export default async function ProyectosPage() {
  const projects = await apiFetch<Project[]>("/projects");

  return (
    <Section width="wide" className="pt-14">
      <h1 className="font-display text-h1 text-ink">Proyectos</h1>
      <p className="mt-3 max-w-xl text-body text-graphite/70">
        Todo lo que construí, ordenado como quiero que se vea, no cronológicamente.
      </p>
      <div className="mt-10">
        <ProjectsGrid projects={projects} />
      </div>
    </Section>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/types";

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const stacks = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((project) => project.stack.forEach((tech) => set.add(tech)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const [filter, setFilter] = useState<string | null>(null);

  if (projects.length === 0) {
    return <p className="text-body text-graphite/60">Todavía no hay proyectos publicados.</p>;
  }

  const filtered = filter ? projects.filter((project) => project.stack.includes(filter)) : projects;

  return (
    <div>
      {stacks.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button type="button" onClick={() => setFilter(null)} className={chipClasses(filter === null)}>
            Todos
          </button>
          {stacks.map((stack) => (
            <button
              key={stack}
              type="button"
              onClick={() => setFilter(stack)}
              className={chipClasses(filter === stack)}
            >
              {stack}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-body text-graphite/60">No hay proyectos con esa tecnología.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.slug}
              title={project.title}
              description={project.description}
              stack={project.stack}
              repoUrl={project.repo_url}
              demoUrl={project.demo_url}
              imageUrl={project.image_urls[0] ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function chipClasses(active: boolean) {
  return cn(
    "rounded-sm border px-2.5 py-1 font-mono text-mono-xs uppercase tracking-wider transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blueprint",
    active
      ? "border-blueprint bg-blueprint text-paper"
      : "border-blueprint/35 bg-blueprint/8 text-blueprint hover:bg-blueprint/15",
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { buttonClasses } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { apiFetch } from "@/lib/api";
import type { Project, Service, Testimonial } from "@/lib/types";

// Se genera en cada request (no en build time): en el build de Docker el
// backend todavia no esta accesible en la red del compose.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description:
    "Portfolio de Hanowar — desarrollo full-stack con FastAPI, Next.js y deploy propio.",
};

const linkClasses =
  "font-mono text-mono-sm uppercase tracking-wider text-blueprint underline decoration-blueprint/40 underline-offset-4 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blueprint";

export default async function HomePage() {
  const [featuredProjects, testimonials, services] = await Promise.all([
    apiFetch<Project[]>("/projects?featured=true"),
    apiFetch<Testimonial[]>("/testimonials"),
    apiFetch<Service[]>("/services"),
  ]);

  return (
    <>
      <Hero />

      {featuredProjects.length > 0 && (
        <Section label="Proyectos destacados">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
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
          <Link href="/proyectos" className={`${linkClasses} mt-8 inline-block`}>
            Ver todos los proyectos →
          </Link>
        </Section>
      )}

      {testimonials.length > 0 && (
        <Section label="Testimonios" className="bg-ink/[0.03]">
          <div className="grid gap-6 sm:grid-cols-2">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.id} className="border border-ink/15 bg-paper p-6">
                <blockquote className="text-body-lg text-graphite">
                  “{testimonial.text}”
                </blockquote>
                <figcaption className="mt-4 font-mono text-mono-sm text-graphite/60">
                  — {testimonial.name}
                  {testimonial.company ? `, ${testimonial.company}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {services.length > 0 && (
        <Section label="Servicios">
          <div className="grid gap-8 sm:grid-cols-3">
            {services.map((service) => (
              <div key={service.id}>
                <h3 className="font-display text-h3 text-ink">{service.title}</h3>
                <p className="mt-2 line-clamp-2 text-body text-graphite/80">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          <Link href="/servicios" className={`${linkClasses} mt-8 inline-block`}>
            Ver todos los servicios →
          </Link>
        </Section>
      )}

      <Section width="narrow" className="text-center">
        <h2 className="font-display text-h2 text-ink">¿Tenés un proyecto en mente?</h2>
        <p className="mx-auto mt-3 max-w-md text-body text-graphite/70">
          Escribime y lo charlamos — sin vueltas.
        </p>
        <Link href="/contacto" className={`${buttonClasses("primary")} mt-6 inline-flex`}>
          Hablemos
        </Link>
      </Section>
    </>
  );
}

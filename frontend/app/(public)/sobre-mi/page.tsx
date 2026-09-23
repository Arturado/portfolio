import type { Metadata } from "next";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { apiFetch } from "@/lib/api";
import type { ExperienceEntry, Profile } from "@/lib/types";

// Se genera en cada request (no en build time): en el build de Docker el
// backend todavia no esta accesible en la red del compose.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: "Bio, experiencia y stack de Hanowar, desarrollador full-stack.",
};

export default async function SobreMiPage() {
  const profile = await apiFetch<Profile>("/profile");
  const experience = profile.experience ?? [];
  const skills = profile.skills ?? [];

  return (
    <>
      <Section width="narrow" className="pb-0 pt-14">
        <h1 className="font-display text-h1 text-ink">Sobre mí</h1>
        {profile.bio ? (
          <p className="mt-4 text-body-lg text-graphite">{profile.bio}</p>
        ) : (
          <p className="mt-4 text-body text-graphite/60">Bio en construcción.</p>
        )}

        {profile.cv_pdf_url && (
          <a
            href={profile.cv_pdf_url}
            className={`${buttonClasses("secondary")} mt-6 inline-flex`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Descargar CV
          </a>
        )}
      </Section>

      {experience.length > 0 && (
        <Section width="narrow" label="Experiencia">
          <ExperienceTimeline entries={experience} />
        </Section>
      )}

      {skills.length > 0 && (
        <Section width="narrow" label="Skills">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function ExperienceTimeline({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <ol className="ml-1.5 border-l border-blueprint/25">
      {entries.map((entry, index) => (
        <li key={`${entry.title}-${index}`} className="relative py-10 pl-8 last:pb-0">
          <span
            aria-hidden
            className="absolute -left-[5px] top-11 h-2.5 w-2.5 rounded-full border-2 border-paper bg-blueprint"
          />
          <p className="font-mono text-mono-sm uppercase tracking-wider text-blueprint">
            {entry.period}
          </p>
          <h3 className="mt-1 font-display text-h3 text-ink">{entry.title}</h3>
          <p className="text-body text-graphite/70">{entry.company}</p>
          <p className="mt-2 text-body text-graphite/80">{entry.description}</p>
        </li>
      ))}
    </ol>
  );
}

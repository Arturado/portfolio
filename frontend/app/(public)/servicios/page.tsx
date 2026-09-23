import type { Metadata } from "next";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/lib/types";

// Se genera en cada request (no en build time): en el build de Docker el
// backend todavia no esta accesible en la red del compose.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Qué puedo hacer por tu proyecto: desarrollo backend, frontend y deploy.",
};

export default async function ServiciosPage() {
  const services = await apiFetch<Service[]>("/services");

  return (
    <>
      <Section width="default" className="pb-0 pt-14">
        <h1 className="font-display text-h1 text-ink">Servicios</h1>
        <p className="mt-3 max-w-xl text-body text-graphite/70">
          Trabajo de punta a punta: del modelo de datos al deploy en producción.
        </p>
      </Section>

      <Section width="default">
        {services.length === 0 ? (
          <p className="text-body text-graphite/60">Servicios en construcción.</p>
        ) : (
          <div className="flex flex-col divide-y divide-ink/10 border-t border-ink/10">
            {services.map((service) => (
              <div key={service.id} className="py-10 first:pt-0">
                <h2 className="font-display text-h2 text-ink">{service.title}</h2>
                <p className="mt-3 max-w-2xl text-body-lg text-graphite/80">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section width="narrow" className="text-center">
        <h2 className="font-display text-h2 text-ink">¿Charlamos sobre tu proyecto?</h2>
        <Link href="/contacto" className={`${buttonClasses("primary")} mt-6 inline-flex`}>
          Hablemos
        </Link>
      </Section>
    </>
  );
}

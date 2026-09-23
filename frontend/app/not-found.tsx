import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="font-mono text-mono-sm uppercase tracking-widest text-blueprint">404</p>
      <h1 className="font-display text-h1 text-ink">Página no encontrada</h1>
      <p className="max-w-md text-body text-graphite/70">
        El contenido que buscás no existe o ya no está disponible.
      </p>
      <Link href="/" className={`${buttonClasses("secondary")} mt-4 inline-flex`}>
        Volver al inicio
      </Link>
    </div>
  );
}

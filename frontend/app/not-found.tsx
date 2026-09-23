import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
        404 — Pagina no encontrada
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        El contenido que buscas no existe o ya no esta disponible.
      </p>
      <Link href="/" className="mt-2 text-sm underline">
        Volver al inicio
      </Link>
    </div>
  );
}

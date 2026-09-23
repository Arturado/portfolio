"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import type { BlogPost, Page } from "@/lib/types";

const LIMIT = 20;

export default function BlogAdminPage() {
  const [data, setData] = useState<Page<BlogPost> | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  async function load(targetPage: number) {
    try {
      const result = await apiFetch<Page<BlogPost>>(
        `/admin/blog?page=${targetPage}&limit=${LIMIT}`
      );
      setData(result);
      setPage(targetPage);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al cargar los posts");
    }
  }

  useEffect(() => {
    load(1);
  }, []);

  async function handleDelete(post: BlogPost) {
    if (!confirm(`Borrar el post "${post.title}"?`)) return;
    await apiFetch(`/blog/${post.slug}`, { method: "DELETE" });
    await load(page);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Blog</h1>
        <Link
          href="/admin/blog/nuevo"
          className="rounded bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Nuevo post
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <table className="w-full max-w-4xl border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <th className="py-2">Titulo</th>
            <th className="py-2">Estado</th>
            <th className="py-2">Fecha</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data?.items.map((post) => (
            <tr key={post.slug} className="border-b border-zinc-100 dark:border-zinc-900">
              <td className="py-2">{post.title}</td>
              <td className="py-2">
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    post.published
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {post.published ? "Publicado" : "Borrador"}
                </span>
              </td>
              <td className="py-2 text-zinc-500">
                {new Date(post.published_at ?? post.created_at).toLocaleDateString()}
              </td>
              <td className="flex gap-2 py-2">
                <Link className="underline" href={`/admin/blog/${post.slug}/editar`}>
                  Editar
                </Link>
                <button className="text-red-600 underline" onClick={() => handleDelete(post)}>
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data?.items.length === 0 && (
        <p className="mt-4 text-sm text-zinc-500">No hay posts todavia.</p>
      )}

      {data && data.pages > 1 && (
        <div className="mt-6 flex items-center gap-3 text-sm">
          <button disabled={page <= 1} onClick={() => load(page - 1)}>
            Anterior
          </button>
          <span>
            Pagina {page} de {data.pages}
          </span>
          <button disabled={page >= data.pages} onClick={() => load(page + 1)}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

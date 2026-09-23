"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { ContactMessage, Page } from "@/lib/types";

const LIMIT = 20;

export default function ContactMessagesPage() {
  const [data, setData] = useState<Page<ContactMessage> | null>(null);
  const [page, setPage] = useState(1);

  async function load(targetPage: number) {
    const result = await apiFetch<Page<ContactMessage>>(
      `/admin/contact-messages?page=${targetPage}&limit=${LIMIT}`
    );
    setData(result);
    setPage(targetPage);
  }

  useEffect(() => {
    load(1);
  }, []);

  async function toggleRead(message: ContactMessage) {
    await apiFetch(`/admin/contact-messages/${message.id}`, { method: "PATCH" });
    await load(page);
  }

  async function handleDelete(message: ContactMessage) {
    if (!confirm(`Borrar el mensaje de "${message.name}"?`)) return;
    await apiFetch(`/admin/contact-messages/${message.id}`, { method: "DELETE" });
    await load(page);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">Mensajes</h1>

      <div className="flex max-w-3xl flex-col gap-3">
        {data?.items.map((message) => (
          <div
            key={message.id}
            className={`rounded-lg border p-4 ${
              message.read
                ? "border-zinc-200 dark:border-zinc-800"
                : "border-black bg-zinc-50 dark:border-white dark:bg-zinc-900"
            }`}
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="font-medium text-black dark:text-zinc-50">
                {message.name} {!message.read && <span className="ml-2 text-xs text-red-600">NUEVO</span>}
              </p>
              <span className="text-xs text-zinc-500">
                {new Date(message.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-zinc-500">{message.email}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm">{message.message}</p>
            <div className="mt-3 flex gap-3 text-sm">
              <button className="underline" onClick={() => toggleRead(message)}>
                Marcar {message.read ? "no leido" : "leido"}
              </button>
              <button className="text-red-600 underline" onClick={() => handleDelete(message)}>
                Borrar
              </button>
            </div>
          </div>
        ))}

        {data?.items.length === 0 && (
          <p className="text-sm text-zinc-500">No hay mensajes.</p>
        )}
      </div>

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

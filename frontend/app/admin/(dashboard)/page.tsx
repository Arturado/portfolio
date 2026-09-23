"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Page, Project } from "@/lib/types";

interface Summary {
  projects: number;
  publishedPosts: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [projects, blog, messages] = await Promise.all([
          apiFetch<Project[]>("/admin/projects"),
          apiFetch<Page<unknown>>("/blog?page=1&limit=1"),
          apiFetch<Page<{ read: boolean }>>("/admin/contact-messages?page=1&limit=100"),
        ]);

        setSummary({
          projects: projects.length,
          publishedPosts: blog.total,
          unreadMessages: messages.items.filter((m) => !m.read).length,
        });
      } catch {
        setError("No se pudo cargar el resumen");
      }
    }

    load();
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Dashboard
      </h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {summary && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard label="Proyectos" value={summary.projects} />
          <SummaryCard label="Posts publicados" value={summary.publishedPosts} />
          <SummaryCard label="Mensajes sin leer" value={summary.unreadMessages} />
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-black dark:text-zinc-50">{value}</p>
    </div>
  );
}

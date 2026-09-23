"use client";

import { useEffect, useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import { apiFetch, ApiError } from "@/lib/api";
import type { Project } from "@/lib/types";

interface FormState {
  title: string;
  description: string;
  stack: string;
  repo_url: string;
  demo_url: string;
  featured: boolean;
  image_urls: string[];
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  stack: "",
  repo_url: "",
  demo_url: "",
  featured: false,
  image_urls: [],
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setProjects(await apiFetch<Project[]>("/admin/projects"));
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(project: Project) {
    setEditingSlug(project.slug);
    setForm({
      title: project.title,
      description: project.description,
      stack: project.stack.join(", "),
      repo_url: project.repo_url ?? "",
      demo_url: project.demo_url ?? "",
      featured: project.featured,
      image_urls: project.image_urls,
    });
  }

  function resetForm() {
    setEditingSlug(null);
    setForm(EMPTY_FORM);
  }

  function removeImage(url: string) {
    setForm({ ...form, image_urls: form.image_urls.filter((u) => u !== url) });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      stack: form.stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      repo_url: form.repo_url || null,
      demo_url: form.demo_url || null,
      featured: form.featured,
      image_urls: form.image_urls,
    };

    try {
      if (editingSlug) {
        await apiFetch(`/projects/${editingSlug}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/projects", { method: "POST", body: JSON.stringify(payload) });
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(project: Project) {
    if (!confirm(`Borrar el proyecto "${project.title}"?`)) return;
    await apiFetch(`/projects/${project.slug}`, { method: "DELETE" });
    await load();
  }

  async function move(project: Project, direction: "up" | "down") {
    // Se usan las posiciones del array (no el valor `order` guardado) porque
    // los proyectos nuevos comparten order=0 por default: intercambiar
    // valores empatados no cambia nada.
    const sorted = [...projects].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((p) => p.slug === project.slug);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const swapWith = sorted[swapIdx];

    await apiFetch(`/projects/${project.slug}`, {
      method: "PUT",
      body: JSON.stringify({ order: swapIdx }),
    });
    await apiFetch(`/projects/${swapWith.slug}`, {
      method: "PUT",
      body: JSON.stringify({ order: idx }),
    });
    await load();
  }

  const sorted = [...projects].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">Proyectos</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 flex max-w-lg flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <h2 className="text-sm font-medium text-zinc-500">
          {editingSlug ? `Editar: ${editingSlug}` : "Nuevo proyecto"}
        </h2>

        <input
          required
          placeholder="Titulo"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <textarea
          required
          placeholder="Descripcion"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          placeholder="Stack (separado por comas: python, fastapi, next.js)"
          value={form.stack}
          onChange={(e) => setForm({ ...form, stack: e.target.value })}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          placeholder="URL del repo (opcional)"
          value={form.repo_url}
          onChange={(e) => setForm({ ...form, repo_url: e.target.value })}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          placeholder="URL de demo (opcional)"
          value={form.demo_url}
          onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Destacado
        </label>

        <div>
          <p className="mb-2 text-sm text-zinc-500">Imagenes</p>
          <div className="mb-2 flex flex-wrap gap-2">
            {form.image_urls.map((url) => (
              <div key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-16 w-16 rounded object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1.5 text-xs text-white"
                >
                  x
                </button>
              </div>
            ))}
          </div>
          <ImageUpload
            onUploaded={(url) => setForm({ ...form, image_urls: [...form.image_urls, url] })}
            label="Agregar imagen"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {editingSlug ? "Guardar cambios" : "Crear proyecto"}
          </button>
          {editingSlug && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <table className="w-full max-w-3xl border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <th className="py-2">Titulo</th>
            <th className="py-2">Slug</th>
            <th className="py-2">Destacado</th>
            <th className="py-2">Orden</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((project, idx) => (
            <tr key={project.slug} className="border-b border-zinc-100 dark:border-zinc-900">
              <td className="py-2">{project.title}</td>
              <td className="py-2 text-zinc-500">{project.slug}</td>
              <td className="py-2">{project.featured ? "Si" : "No"}</td>
              <td className="py-2">{project.order}</td>
              <td className="flex gap-2 py-2">
                <button disabled={idx === 0} onClick={() => move(project, "up")}>
                  ↑
                </button>
                <button disabled={idx === sorted.length - 1} onClick={() => move(project, "down")}>
                  ↓
                </button>
                <button className="underline" onClick={() => startEdit(project)}>
                  Editar
                </button>
                <button className="text-red-600 underline" onClick={() => handleDelete(project)}>
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

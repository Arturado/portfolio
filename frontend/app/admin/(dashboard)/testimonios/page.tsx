"use client";

import { useEffect, useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import { apiFetch, ApiError } from "@/lib/api";
import type { Testimonial } from "@/lib/types";

const EMPTY_FORM = { name: "", company: "", text: "", photo_url: "" };

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setTestimonials(await apiFetch<Testimonial[]>("/admin/testimonials"));
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(testimonial: Testimonial) {
    setEditingId(testimonial.id);
    setForm({
      name: testimonial.name,
      company: testimonial.company ?? "",
      text: testimonial.text,
      photo_url: testimonial.photo_url ?? "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      name: form.name,
      company: form.company || null,
      text: form.text,
      photo_url: form.photo_url || null,
    };

    try {
      if (editingId) {
        await apiFetch(`/testimonials/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/testimonials", { method: "POST", body: JSON.stringify(payload) });
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(testimonial: Testimonial) {
    if (!confirm(`Borrar el testimonio de "${testimonial.name}"?`)) return;
    await apiFetch(`/testimonials/${testimonial.id}`, { method: "DELETE" });
    await load();
  }

  async function move(testimonial: Testimonial, direction: "up" | "down") {
    // Se usan las posiciones del array (no el valor `order` guardado) porque
    // los testimonios nuevos comparten order=0 por default: intercambiar
    // valores empatados no cambia nada.
    const sorted = [...testimonials].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((t) => t.id === testimonial.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const swapWith = sorted[swapIdx];

    await apiFetch(`/testimonials/${testimonial.id}`, {
      method: "PUT",
      body: JSON.stringify({ order: swapIdx }),
    });
    await apiFetch(`/testimonials/${swapWith.id}`, {
      method: "PUT",
      body: JSON.stringify({ order: idx }),
    });
    await load();
  }

  const sorted = [...testimonials].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">Testimonios</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 flex max-w-lg flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <h2 className="text-sm font-medium text-zinc-500">
          {editingId ? "Editar testimonio" : "Nuevo testimonio"}
        </h2>

        <input
          required
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          placeholder="Empresa (opcional)"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <textarea
          required
          placeholder="Testimonio"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />

        <ImageUpload
          value={form.photo_url}
          onUploaded={(url) => setForm({ ...form, photo_url: url })}
          label="Subir foto"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {editingId ? "Guardar cambios" : "Crear testimonio"}
          </button>
          {editingId && (
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
            <th className="py-2">Nombre</th>
            <th className="py-2">Empresa</th>
            <th className="py-2">Orden</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((testimonial, idx) => (
            <tr key={testimonial.id} className="border-b border-zinc-100 dark:border-zinc-900">
              <td className="py-2">{testimonial.name}</td>
              <td className="py-2">{testimonial.company ?? "-"}</td>
              <td className="py-2">{testimonial.order}</td>
              <td className="flex gap-2 py-2">
                <button disabled={idx === 0} onClick={() => move(testimonial, "up")}>
                  ↑
                </button>
                <button
                  disabled={idx === sorted.length - 1}
                  onClick={() => move(testimonial, "down")}
                >
                  ↓
                </button>
                <button className="underline" onClick={() => startEdit(testimonial)}>
                  Editar
                </button>
                <button
                  className="text-red-600 underline"
                  onClick={() => handleDelete(testimonial)}
                >
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

"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import type { Service } from "@/lib/types";

const EMPTY_FORM = { title: "", description: "" };

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setServices(await apiFetch<Service[]>("/admin/services"));
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(service: Service) {
    setEditingId(service.id);
    setForm({ title: service.title, description: service.description });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (editingId) {
        await apiFetch(`/services/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/services", { method: "POST", body: JSON.stringify(form) });
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(service: Service) {
    if (!confirm(`Borrar el servicio "${service.title}"?`)) return;
    await apiFetch(`/services/${service.id}`, { method: "DELETE" });
    await load();
  }

  async function move(service: Service, direction: "up" | "down") {
    // Se usan las posiciones del array (no el valor `order` guardado) porque
    // los servicios nuevos comparten order=0 por default: intercambiar
    // valores empatados no cambia nada.
    const sorted = [...services].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s.id === service.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const swapWith = sorted[swapIdx];

    await apiFetch(`/services/${service.id}`, {
      method: "PUT",
      body: JSON.stringify({ order: swapIdx }),
    });
    await apiFetch(`/services/${swapWith.id}`, {
      method: "PUT",
      body: JSON.stringify({ order: idx }),
    });
    await load();
  }

  const sorted = [...services].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">Servicios</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 flex max-w-lg flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <h2 className="text-sm font-medium text-zinc-500">
          {editingId ? "Editar servicio" : "Nuevo servicio"}
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

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {editingId ? "Guardar cambios" : "Crear servicio"}
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
            <th className="py-2">Titulo</th>
            <th className="py-2">Orden</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((service, idx) => (
            <tr key={service.id} className="border-b border-zinc-100 dark:border-zinc-900">
              <td className="py-2">{service.title}</td>
              <td className="py-2">{service.order}</td>
              <td className="flex gap-2 py-2">
                <button disabled={idx === 0} onClick={() => move(service, "up")}>
                  ↑
                </button>
                <button disabled={idx === sorted.length - 1} onClick={() => move(service, "down")}>
                  ↓
                </button>
                <button className="underline" onClick={() => startEdit(service)}>
                  Editar
                </button>
                <button className="text-red-600 underline" onClick={() => handleDelete(service)}>
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

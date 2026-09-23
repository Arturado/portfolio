"use client";

import { useEffect, useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import { apiFetch, ApiError } from "@/lib/api";
import type { ExperienceEntry, Profile } from "@/lib/types";

const EMPTY_EXPERIENCE: ExperienceEntry = {
  title: "",
  company: "",
  period: "",
  description: "",
};

export default function ProfilePage() {
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch<Profile>("/profile").then((profile) => {
      setBio(profile.bio ?? "");
      setExperience(profile.experience ?? []);
      setSkills(profile.skills ?? []);
      setCvUrl(profile.cv_pdf_url);
    });
  }, []);

  function updateExperience(index: number, field: keyof ExperienceEntry, value: string) {
    setExperience(
      experience.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry))
    );
  }

  function addExperience() {
    setExperience([...experience, { ...EMPTY_EXPERIENCE }]);
  }

  function removeExperience(index: number) {
    setExperience(experience.filter((_, i) => i !== index));
  }

  function addSkill() {
    const skill = newSkill.trim();
    if (!skill || skills.includes(skill)) return;
    setSkills([...skills, skill]);
    setNewSkill("");
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify({ bio, experience, skills, cv_pdf_url: cvUrl }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">Perfil</h1>

      <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
        <div>
          <label className="mb-1 block text-sm text-zinc-500">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-500">CV (PDF)</label>
          <ImageUpload
            value={cvUrl}
            onUploaded={setCvUrl}
            accept="application/pdf"
            label="Subir CV"
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-zinc-500">Skills</p>
          <div className="mb-2 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800"
              >
                {skill}
                <button type="button" onClick={() => removeSkill(skill)}>
                  x
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Nuevo skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="button"
              onClick={addSkill}
              className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
            >
              Agregar
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm text-zinc-500">Experiencia</p>
          <div className="flex flex-col gap-4">
            {experience.map((entry, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <input
                  placeholder="Puesto"
                  value={entry.title}
                  onChange={(e) => updateExperience(index, "title", e.target.value)}
                  className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
                <input
                  placeholder="Empresa"
                  value={entry.company}
                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                  className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
                <input
                  placeholder="Periodo (ej. 2022 - presente)"
                  value={entry.period}
                  onChange={(e) => updateExperience(index, "period", e.target.value)}
                  className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
                <textarea
                  placeholder="Descripcion"
                  value={entry.description}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                  className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="self-start text-sm text-red-600 underline"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addExperience}
            className="mt-2 rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
          >
            Agregar experiencia
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">Guardado</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-fit rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

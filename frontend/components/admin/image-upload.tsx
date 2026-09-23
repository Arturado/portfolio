"use client";

import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";

interface ImageUploadProps {
  value?: string | null;
  onUploaded: (url: string) => void;
  accept?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onUploaded,
  accept = "image/jpeg,image/png,image/webp",
  label = "Subir archivo",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const isImage = accept.includes("image");

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);
      const result = await apiFetch<{ url: string }>("/admin/uploads", {
        method: "POST",
        body: form,
      });
      onUploaded(result.url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al subir el archivo");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {value && isImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="preview"
          className="h-24 w-24 rounded object-cover border border-zinc-200 dark:border-zinc-800"
        />
      )}
      {value && !isImage && (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 underline dark:text-blue-400"
        >
          Ver archivo actual
        </a>
      )}

      <label className="flex w-fit cursor-pointer items-center gap-2 rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700">
        {uploading ? "Subiendo..." : label}
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

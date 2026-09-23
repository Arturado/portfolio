"use client";

import { useState } from "react";
import { BlogEditor } from "@/components/admin/blog-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import type { BlogPost } from "@/lib/types";

export interface BlogPostFormValues {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string | null;
  tags: string;
  published: boolean;
}

interface BlogPostFormProps {
  initial?: BlogPost;
  submitLabel: string;
  loading: boolean;
  error: string;
  onSubmit: (values: BlogPostFormValues) => void;
}

export function BlogPostForm({ initial, submitLabel, loading, error, onSubmit }: BlogPostFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    initial?.cover_image_url ?? null
  );
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit({ title, slug, content, excerpt, cover_image_url: coverImageUrl, tags, published });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-500">Titulo</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-500">
          Slug {!initial && "(opcional, se genera desde el titulo)"}
        </label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-500">
          Extracto (opcional, se genera del contenido si se deja vacio)
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          maxLength={300}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-500">Tags (separados por comas)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="nextjs, fastapi, deploy"
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-zinc-500">Imagen de portada</label>
        <ImageUpload value={coverImageUrl} onUploaded={setCoverImageUrl} label="Subir portada" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-zinc-500">Contenido</label>
        <BlogEditor value={content} onChange={setContent} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Publicado
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BlogPostForm, type BlogPostFormValues } from "@/components/admin/blog-post-form";
import { apiFetch, ApiError } from "@/lib/api";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(values: BlogPostFormValues) {
    setError("");
    setLoading(true);

    try {
      await apiFetch("/blog", {
        method: "POST",
        body: JSON.stringify({
          title: values.title,
          slug: values.slug || undefined,
          content: values.content,
          excerpt: values.excerpt || undefined,
          cover_image_url: values.cover_image_url,
          tags: values.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          published: values.published,
        }),
      });
      router.push("/admin/blog");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al crear el post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">Nuevo post</h1>
      <BlogPostForm
        submitLabel="Crear post"
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

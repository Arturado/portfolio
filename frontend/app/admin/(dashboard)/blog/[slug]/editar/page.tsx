"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BlogPostForm, type BlogPostFormValues } from "@/components/admin/blog-post-form";
import { apiFetch, ApiError } from "@/lib/api";
import type { BlogPost } from "@/lib/types";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<BlogPost>(`/admin/blog/${params.slug}`)
      .then(setPost)
      .catch((err) =>
        setLoadError(err instanceof ApiError ? err.message : "Error al cargar el post")
      );
  }, [params.slug]);

  async function handleSubmit(values: BlogPostFormValues) {
    setError("");
    setLoading(true);

    try {
      await apiFetch(`/blog/${params.slug}`, {
        method: "PUT",
        body: JSON.stringify({
          title: values.title,
          slug: values.slug,
          content: values.content,
          excerpt: values.excerpt || null,
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
      setError(err instanceof ApiError ? err.message : "Error al guardar el post");
    } finally {
      setLoading(false);
    }
  }

  if (loadError) {
    return <p className="text-sm text-red-600">{loadError}</p>;
  }

  if (!post) {
    return <p className="text-sm text-zinc-500">Cargando...</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Editar: {post.title}
      </h1>
      <BlogPostForm
        initial={post}
        submitLabel="Guardar cambios"
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

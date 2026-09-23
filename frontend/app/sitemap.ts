import type { MetadataRoute } from "next";
import { apiFetch } from "@/lib/api";
import type { BlogPostSummary, Page } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Se genera en cada request (no en build time): en el build de Docker el
// backend todavia no esta accesible en la red del compose.
export const dynamic = "force-dynamic";

async function getAllPublishedPosts(): Promise<BlogPostSummary[]> {
  const posts: BlogPostSummary[] = [];
  let page = 1;

  while (true) {
    const data = await apiFetch<Page<BlogPostSummary>>(`/blog?page=${page}&limit=100`);
    posts.push(...data.items);
    if (page >= data.pages) break;
    page += 1;
  }

  return posts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPublishedPosts();

  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/proyectos`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/servicios`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/sobre-mi`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.published_at ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

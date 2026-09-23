import Link from "next/link";
import { Suspense } from "react";
import { apiFetch } from "@/lib/api";
import type { BlogPostSummary, Page } from "@/lib/types";

const LIMIT = 9;

export const metadata = {
  title: "Blog",
  description: "Articulos sobre desarrollo de software.",
};

async function BlogList({ page }: { page: number }) {
  const data = await apiFetch<Page<BlogPostSummary>>(`/blog?page=${page}&limit=${LIMIT}`);

  return (
    <>
      {data.items.length === 0 && (
        <p className="text-zinc-600 dark:text-zinc-400">Todavia no hay posts publicados.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block overflow-hidden rounded-lg border border-zinc-200 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            {post.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.cover_image_url} alt="" className="h-40 w-full object-cover" />
            )}
            <div className="p-4">
              <h2 className="font-medium text-black dark:text-zinc-50">{post.title}</h2>
              {post.excerpt && (
                <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {post.excerpt}
                </p>
              )}
              {post.published_at && (
                <p className="mt-2 text-xs text-zinc-500">
                  {new Date(post.published_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {data.pages > 1 && (
        <div className="mt-8 flex items-center gap-3 text-sm">
          {page > 1 ? (
            <Link href={`/blog?page=${page - 1}`} className="underline">
              Anterior
            </Link>
          ) : (
            <span className="text-zinc-400">Anterior</span>
          )}
          <span className="text-zinc-500">
            Pagina {page} de {data.pages}
          </span>
          {page < data.pages ? (
            <Link href={`/blog?page=${page + 1}`} className="underline">
              Siguiente
            </Link>
          ) : (
            <span className="text-zinc-400">Siguiente</span>
          )}
        </div>
      )}
    </>
  );
}

function BlogListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
        >
          <div className="h-40 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function BlogIndexPage({ searchParams }: PageProps<"/blog">) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-semibold text-black dark:text-zinc-50">Blog</h1>
      <Suspense key={page} fallback={<BlogListSkeleton />}>
        <BlogList page={page} />
      </Suspense>
    </div>
  );
}

import Link from "next/link";
import { Suspense } from "react";
import { Section } from "@/components/ui/section";
import { apiFetch } from "@/lib/api";
import type { BlogPostSummary, Page } from "@/lib/types";

const LIMIT = 9;

export const metadata = {
  title: "Blog",
  description: "Artículos sobre desarrollo de software.",
};

async function BlogList({ page }: { page: number }) {
  const data = await apiFetch<Page<BlogPostSummary>>(`/blog?page=${page}&limit=${LIMIT}`);

  return (
    <>
      {data.items.length === 0 && (
        <p className="text-body text-graphite/60">Todavía no hay posts publicados.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block overflow-hidden border border-ink/15 bg-paper transition-colors motion-reduce:transition-none hover:border-blueprint/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blueprint"
          >
            {post.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.cover_image_url} alt="" className="h-40 w-full border-b border-ink/15 object-cover" />
            )}
            <div className="p-4">
              <h2 className="font-display text-h3 text-ink">{post.title}</h2>
              {post.excerpt && (
                <p className="mt-1 line-clamp-2 text-body text-graphite/70">{post.excerpt}</p>
              )}
              {post.published_at && (
                <p className="mt-2 font-mono text-mono-xs uppercase tracking-wider text-graphite/45">
                  {new Date(post.published_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {data.pages > 1 && (
        <div className="mt-8 flex items-center gap-3 font-mono text-mono-sm">
          {page > 1 ? (
            <Link
              href={`/blog?page=${page - 1}`}
              className="text-blueprint underline decoration-blueprint/40 underline-offset-4 hover:text-ink"
            >
              Anterior
            </Link>
          ) : (
            <span className="text-graphite/30">Anterior</span>
          )}
          <span className="text-graphite/60">
            Página {page} de {data.pages}
          </span>
          {page < data.pages ? (
            <Link
              href={`/blog?page=${page + 1}`}
              className="text-blueprint underline decoration-blueprint/40 underline-offset-4 hover:text-ink"
            >
              Siguiente
            </Link>
          ) : (
            <span className="text-graphite/30">Siguiente</span>
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
        <div key={i} className="overflow-hidden border border-ink/15">
          <div className="h-40 w-full animate-pulse bg-ink/5" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 animate-pulse bg-ink/5" />
            <div className="h-3 w-full animate-pulse bg-ink/5" />
            <div className="h-3 w-1/3 animate-pulse bg-ink/5" />
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
    <Section width="wide" className="pt-14">
      <h1 className="mb-8 font-display text-h1 text-ink">Blog</h1>
      <Suspense key={page} fallback={<BlogListSkeleton />}>
        <BlogList page={page} />
      </Suspense>
    </Section>
  );
}

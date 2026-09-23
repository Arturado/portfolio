import DOMPurify from "isomorphic-dompurify";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { apiFetch, ApiError } from "@/lib/api";
import type { BlogPost } from "@/lib/types";

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    return await apiFetch<BlogPost>(`/blog/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const html = DOMPurify.sanitize(post.content);

  return (
    <Section width="narrow" className="pt-14">
      <article>
        <Link
          href="/blog"
          className="font-mono text-mono-sm text-blueprint underline decoration-blueprint/40 underline-offset-4 hover:text-ink"
        >
          ← Volver al blog
        </Link>

        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt=""
            className="mt-4 h-64 w-full border border-ink/15 object-cover"
          />
        )}

        <h1 className="mt-6 font-display text-h1 text-ink">{post.title}</h1>

        {post.published_at && (
          <p className="mt-2 font-mono text-mono-sm uppercase tracking-wider text-graphite/50">
            {new Date(post.published_at).toLocaleDateString()}
          </p>
        )}

        <div
          className="prose mt-8 max-w-none prose-headings:font-display prose-headings:text-ink prose-p:text-graphite prose-a:text-blueprint prose-strong:text-ink"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </Section>
  );
}

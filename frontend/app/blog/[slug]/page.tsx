import DOMPurify from "isomorphic-dompurify";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    <article className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/blog" className="text-sm text-zinc-500 underline">
        Volver al blog
      </Link>

      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image_url}
          alt=""
          className="mt-4 h-64 w-full rounded-lg object-cover"
        />
      )}

      <h1 className="mt-6 text-3xl font-semibold text-black dark:text-zinc-50">{post.title}</h1>

      {post.published_at && (
        <p className="mt-2 text-sm text-zinc-500">
          {new Date(post.published_at).toLocaleDateString()}
        </p>
      )}

      <div
        className="prose prose-zinc mt-8 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}

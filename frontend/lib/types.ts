export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  stack: string[];
  image_urls: string[];
  repo_url: string | null;
  demo_url: string | null;
  featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  company: string | null;
  text: string;
  photo_url: string | null;
  order: number;
  created_at: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  order: number;
  created_at: string;
}

export interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Profile {
  bio: string | null;
  experience: ExperienceEntry[] | null;
  skills: string[] | null;
  cv_pdf_url: string | null;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostSummary {
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

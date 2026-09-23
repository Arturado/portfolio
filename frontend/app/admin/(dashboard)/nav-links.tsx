"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/proyectos", label: "Proyectos" },
  { href: "/admin/testimonios", label: "Testimonios" },
  { href: "/admin/servicios", label: "Servicios" },
  { href: "/admin/perfil", label: "Perfil" },
  { href: "/admin/mensajes", label: "Mensajes" },
  { href: "/admin/blog", label: "Blog" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded px-3 py-2 text-sm ${
              active
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

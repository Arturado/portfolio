import { StatusIndicator } from "@/components/ui/status-indicator";
import { CONTACT_EMAIL, SITE_NAME, SOCIAL_LINKS } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/15">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="font-mono text-mono-xs uppercase tracking-wider text-graphite/60">
          © {year} {SITE_NAME}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-mono-sm text-graphite/70">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="underline decoration-blueprint/40 underline-offset-4 hover:text-blueprint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blueprint"
          >
            {CONTACT_EMAIL}
          </a>
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-blueprint/40 underline-offset-4 hover:text-blueprint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blueprint"
            >
              {social.label}
            </a>
          ))}
          <StatusIndicator />
        </div>
      </div>
    </footer>
  );
}

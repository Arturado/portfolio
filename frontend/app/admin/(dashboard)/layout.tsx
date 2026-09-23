import { LogoutButton } from "./logout-button";
import { NavLinks } from "./nav-links";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-zinc-200 p-4 dark:border-zinc-800">
        <div>
          <h2 className="mb-4 px-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            arturodev admin
          </h2>
          <NavLinks />
        </div>
        <LogoutButton />
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

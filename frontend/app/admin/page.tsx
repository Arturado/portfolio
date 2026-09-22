import { LogoutButton } from "./logout-button";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Panel de administracion
      </h1>
      <LogoutButton />
    </div>
  );
}

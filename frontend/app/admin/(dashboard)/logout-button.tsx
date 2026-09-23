"use client";

import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
    >
      Cerrar sesion
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/cn";

type Status = "checking" | "online" | "offline";

const POLL_INTERVAL_MS = 15_000;

const labels: Record<Status, string> = {
  checking: "verificando",
  online: "online",
  offline: "offline",
};

const dotClasses: Record<Status, string> = {
  checking: "bg-graphite/40",
  online: "bg-status-online",
  offline: "bg-status-offline",
};

interface StatusIndicatorProps {
  className?: string;
}

/** Hace fetch real a GET /health del backend y refleja el estado real. */
export function StatusIndicator({ className }: StatusIndicatorProps) {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        await apiFetch("/health");
        if (!cancelled) setStatus("online");
      } catch {
        if (!cancelled) setStatus("offline");
      }
    }

    check();
    const interval = setInterval(check, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={cn("inline-flex items-center gap-2 font-mono text-mono-sm", className)}>
      <span className="relative flex h-2 w-2">
        {status === "online" && (
          <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-status-online opacity-60" />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", dotClasses[status])} />
      </span>
      <span className="uppercase tracking-wider text-graphite/70">API {labels[status]}</span>
    </div>
  );
}

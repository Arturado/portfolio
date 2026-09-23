"use client";

import Script from "next/script";
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Section } from "@/components/ui/section";
import { apiFetch, ApiError } from "@/lib/api";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

type Status = "idle" | "loading" | "success" | "error";

function getRecaptchaToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error("reCAPTCHA todavía no cargó, esperá un segundo e intentá de nuevo."));
      return;
    }
    window.grecaptcha.ready(() => {
      window
        .grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action: "contact" })
        .then(resolve)
        .catch(() => reject(new Error("No pudimos validar el formulario. Probá de nuevo.")));
    });
  });
}

export default function ContactoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Completá todos los campos.");
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError("Ingresá un email válido.");
      return;
    }

    setError("");
    setStatus("loading");

    try {
      const recaptchaToken = await getRecaptchaToken();
      await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message, website, recaptcha_token: recaptchaToken }),
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "No pudimos enviar tu mensaje. Probá de nuevo en unos minutos.",
      );
    }
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
      {/* Oculta el badge visible de reCAPTCHA: la atribucion requerida va
          en el footer del form, tal como permiten los terminos de Google. */}
      <style>{`.grecaptcha-badge { visibility: hidden; }`}</style>

      <Section width="narrow" className="pb-0 pt-14">
        <h1 className="font-display text-h1 text-ink">Contacto</h1>
        <p className="mt-3 text-body text-graphite/70">
          Contame sobre tu proyecto y te respondo lo antes posible.
        </p>
      </Section>

      <Section width="narrow">
        {status === "success" ? (
          <div className="border border-blueprint/35 bg-blueprint/8 p-6">
            <p className="font-mono text-mono-xs uppercase tracking-wider text-blueprint">
              Mensaje enviado
            </p>
            <h2 className="mt-2 font-display text-h3 text-ink">¡Gracias por escribir!</h2>
            <p className="mt-2 text-body text-graphite/80">
              Recibimos tu mensaje y te va a llegar una confirmación por email. Te respondo a la
              brevedad.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Field label="Nombre" htmlFor="contact-name">
              <Input
                id="contact-name"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field label="Email" htmlFor="contact-email">
              <Input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field label="Mensaje" htmlFor="contact-message">
              <Textarea
                id="contact-message"
                name="message"
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Field>

            {/* Honeypot: un bot lo llena, un humano nunca lo ve. Off-screen
                en vez de display:none, que los bots ya saltean. */}
            <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="contact-website">Sitio web</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            {error && <p className="text-body text-status-offline">{error}</p>}

            <div className="mt-2 flex flex-col gap-3">
              <Button type="submit" disabled={status === "loading"} className="self-start">
                {status === "loading" ? "Enviando…" : "Enviar mensaje"}
              </Button>

              <p className="font-mono text-mono-xs text-graphite/50">
                Este sitio está protegido por reCAPTCHA. Aplican la{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-blueprint/40 underline-offset-4 hover:text-blueprint"
                >
                  Política de Privacidad
                </a>{" "}
                y los{" "}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-blueprint/40 underline-offset-4 hover:text-blueprint"
                >
                  Términos de Servicio
                </a>{" "}
                de Google.
              </p>
            </div>
          </form>
        )}
      </Section>
    </>
  );
}

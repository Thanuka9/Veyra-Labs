"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Calendar, CheckCircle2, Loader2, Mail, MapPin } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_LINKEDIN, CONTACT_LOCATION, contactProjectTypes } from "@/lib/content";
import { buildVeyraInquiryEmail, sendContactEmail } from "@/lib/email";
import { trackEvent } from "@/components/GoogleAnalytics";
import { LucideIcon } from "./LucideIcon";
import { Reveal } from "./Reveal";

const projectTypes = contactProjectTypes;

export function Contact() {
  const [type, setType] = useState(projectTypes[0]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const honeypot = (data.get("website") as string) || "";
    if (honeypot) return;

    const humanVer = ((data.get("human_ver") as string) || "").trim();
    if (humanVer !== "12") {
      setErrorMsg("Please answer the verification question correctly (6 + 6 = ?).");
      setStatus("error");
      return;
    }

    const name = (data.get("name") as string) || "";
    const email = (data.get("email") as string) || "";
    const company = (data.get("company") as string) || "";
    const message = (data.get("message") as string) || "";
    const consent = data.get("consent") === "on";

    if (!consent) {
      setErrorMsg("Please agree to be contacted about your project.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      await sendContactEmail(
        buildVeyraInquiryEmail({
          name,
          email,
          company,
          projectType: type,
          message,
          source: "Contact form — veyralabs.com",
        })
      );
      setStatus("success");
      trackEvent("submit", "contact", type);
      form.reset();
      setType(projectTypes[0]);
    } catch {
      setStatus("error");
      setErrorMsg(
        `Something went wrong. Email us directly at ${CONTACT_EMAIL} and we'll respond within 24 hours.`
      );
    }
  }

  return (
    <section id="contact" className="section section-tone-b relative">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-violet/20 bg-gradient-to-br from-surface via-surface to-surface-2 p-8 sm:p-12 lg:p-14">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
          <div className="pointer-events-none absolute left-1/2 top-[-40%] h-96 w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.25),transparent)] blur-3xl" />
          {/* Animated corner glow */}
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.15),transparent)] blur-3xl" />

          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan">
                <Calendar size={13} />
                Free discovery call
              </span>
              <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Ready to build something{" "}
                <span className="text-gradient">your clients will love?</span>
              </h2>
              <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted">
                Tell us about your product, timeline and goals. We&apos;ll respond within
                24 hours with next steps — no obligation, no sales pitch.
              </p>

              <div className="mt-7 space-y-3">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-2.5 text-sm font-medium text-foreground transition-colors hover:text-cyan"
                >
                  <LucideIcon icon={Mail} size={16} className="text-cyan" />
                  {CONTACT_EMAIL}
                </a>
                <p className="flex items-center gap-2.5 text-sm text-muted">
                  <LucideIcon icon={MapPin} size={16} className="text-violet" />
                  {CONTACT_LOCATION}
                </p>
                <a
                  href={CONTACT_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted transition-colors hover:text-cyan"
                >
                  LinkedIn
                </a>
              </div>

              <div className="mt-8 rounded-xl border border-border bg-surface/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet">
                  Signature client outcome
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  AI-driven forecasting kernels achieving <strong className="text-foreground">R² &gt; 0.90</strong> and{" "}
                  <strong className="text-foreground">40% reduction</strong> in manual audit overhead across enterprise RCM workflows — Collective RCM.
                </p>
              </div>
            </div>
            </Reveal>

            {status === "success" ? (
              <Reveal delay={1}>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-10 text-center">
                <CheckCircle2 size={40} className="text-emerald-400" />
                <h3 className="mt-4 text-xl font-bold">Inquiry sent!</h3>
                <p className="mt-2 max-w-sm text-sm text-muted">
                  Thanks — we&apos;ll review your project and respond within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm font-semibold text-cyan hover:underline"
                >
                  Send another message
                </button>
              </div>
              </Reveal>
            ) : (
              <Reveal delay={1}>
              <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Your name" name="name" placeholder="Jane Doe" required />
                  <Field label="Email" name="email" type="email" placeholder="you@company.com" required />
                </div>
                <Field label="Company" name="company" placeholder="Acme Inc. (optional)" />

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    What are you building?
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((t) => (
                      <button
                        type="button"
                        key={t}
                        aria-pressed={type === t}
                        onClick={() => setType(t)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                          type === t
                            ? "border-violet/60 bg-violet/15 text-foreground"
                            : "border-border bg-surface/80 text-muted hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Project details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Describe your idea, target users, timeline and budget range…"
                    className="resize-none rounded-xl border border-border bg-background/60 px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-violet/50 focus:ring-1 focus:ring-violet/30"
                  />
                </div>

                <Field
                  label="Verification — what is 6 + 6?"
                  name="human_ver"
                  placeholder="12"
                  required
                />

                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden
                />

                <label className="flex items-start gap-2.5 text-xs text-muted">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-0.5 accent-violet"
                  />
                  I agree to be contacted about my project. See our{" "}
                  <Link href="/privacy" className="font-medium text-cyan hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>

                {status === "error" && errorMsg && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group relative mt-1 inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-4 text-sm font-semibold text-white shadow-[0_0_32px_-8px_rgba(124,92,255,0.6)] transition-all hover:scale-[1.02] hover:shadow-[0_0_48px_-6px_rgba(124,92,255,0.85)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-[120%]" />
                  {status === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send inquiry
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded-xl border border-border bg-background/60 px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-violet/50 focus:ring-1 focus:ring-violet/30"
      />
    </div>
  );
}

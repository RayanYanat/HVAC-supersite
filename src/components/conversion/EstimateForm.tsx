"use client";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Minus, Plus, Check, CheckCircle2 } from "lucide-react";
import type { NicheConfig, Step, ContactField } from "@/lib/niche";

type Answers = Record<string, string | number | Record<string, string>>;

const CONTACT_META: Record<ContactField, { label: string; placeholder: string; type: string; required: boolean }> = {
  name:    { label: "Full name",     placeholder: "Jane Smith",          type: "text",  required: true },
  phone:   { label: "Phone number",  placeholder: "(415) 555-0199",      type: "tel",   required: true },
  email:   { label: "Email",         placeholder: "jane@email.com",      type: "email", required: true },
  address: { label: "Address",       placeholder: "Street, city",        type: "text",  required: true },
};

export default function EstimateForm({ form }: { form: NicheConfig["form"] }) {
  const steps = form.steps;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => {
    // seed counter defaults
    const seed: Answers = {};
    steps.forEach((s) => { if (s.type === "counter") seed[s.id] = s.default; });
    return seed;
  });
  const [submitted, setSubmitted] = useState(false);

  const step = steps[current];
  const isLast = current === steps.length - 1;
  const progress = Math.round(((current + 1) / steps.length) * 100);

  const setAnswer = (id: string, val: Answers[string]) =>
    setAnswers((a) => ({ ...a, [id]: val }));

  /* ── Per-step validation ─────────────────────────────────────────────── */
  const stepValid = (s: Step): boolean => {
    if (s.type === "single") return typeof answers[s.id] === "string" && !!answers[s.id];
    if (s.type === "counter") return typeof answers[s.id] === "number";
    if (s.type === "contact") {
      const c = (answers[s.id] as Record<string, string>) ?? {};
      return s.fields.every((f) => !CONTACT_META[f].required || (c[f] ?? "").trim().length > 0);
    }
    return true;
  };

  const next = () => {
    if (!stepValid(step)) return;
    if (isLast) { submitEstimate(answers); setSubmitted(true); return; }
    setCurrent((c) => c + 1);
  };
  const back = () => setCurrent((c) => Math.max(0, c - 1));

  /* Integration seam — mockup: client-only. Later: POST /api/estimate. */
  const submitEstimate = (data: Answers) => {
    if (process.env.NODE_ENV !== "production") console.log("[estimate]", data);
  };

  /* ── Confirmation ────────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-5 py-8 px-1">
        <span className="flex items-center justify-center w-14 h-14 rounded-full" style={{ backgroundColor: "rgba(200,81,31,0.1)" }}>
          <CheckCircle2 size={30} style={{ color: "var(--brand)" }} />
        </span>
        <div>
          <h3 className="font-heading text-[1.7rem] font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            {form.confirmation.title}
          </h3>
          <p className="text-[1rem] leading-relaxed max-w-md" style={{ color: "var(--text-muted)" }}>
            {form.confirmation.body}
          </p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setCurrent(0); }}
          className="text-[0.88rem] font-medium press"
          style={{ color: "var(--brand)" }}
        >
          ← Start another estimate
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-data text-[11px] tracking-[0.12em] uppercase" style={{ color: "var(--text-muted)" }}>
          Step {current + 1} of {steps.length}
        </span>
        <span className="font-data text-[11px] tabular" style={{ color: "var(--text-faint)" }}>{progress}%</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden mb-7" style={{ backgroundColor: "var(--surface-warm)" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: "var(--brand)" }} />
      </div>

      {/* Question */}
      <h3 className="font-heading text-[1.5rem] lg:text-[1.7rem] font-semibold leading-tight mb-1.5" style={{ color: "var(--foreground)" }}>
        {step.question}
      </h3>
      {step.hint && <p className="text-[0.92rem] mb-6" style={{ color: "var(--text-muted)" }}>{step.hint}</p>}
      {!step.hint && <div className="mb-6" />}

      {/* Step body */}
      <div className="min-h-[180px]">
        {step.type === "single" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {step.options.map((opt) => {
              const Icon = opt.icon;
              const active = answers[step.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => { setAnswer(step.id, opt.value); if (!isLast) setTimeout(() => setCurrent((c) => c + 1), 180); }}
                  className="press text-left p-4 rounded-[var(--radius)] transition-all duration-200"
                  style={{
                    backgroundColor: active ? "rgba(200,81,31,0.06)" : "var(--surface)",
                    border: `1.5px solid ${active ? "var(--brand)" : "var(--border-subtle)"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    {Icon ? <Icon size={22} style={{ color: active ? "var(--brand)" : "var(--text-muted)" }} /> : <span />}
                    {active && <Check size={16} style={{ color: "var(--brand)" }} />}
                  </div>
                  <div className="text-[0.98rem] font-medium" style={{ color: "var(--foreground)" }}>{opt.label}</div>
                  {opt.desc && <div className="text-[0.8rem] mt-0.5" style={{ color: "var(--text-muted)" }}>{opt.desc}</div>}
                </button>
              );
            })}
          </div>
        )}

        {step.type === "counter" && (() => {
          const val = (answers[step.id] as number) ?? step.default;
          const set = (v: number) => setAnswer(step.id, Math.min(step.max, Math.max(step.min, v)));
          return (
            <div className="flex items-center justify-center gap-6 py-6 rounded-[var(--radius)]" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-subtle)" }}>
              <button onClick={() => set(val - 1)} disabled={val <= step.min}
                className="press flex items-center justify-center w-12 h-12 rounded-full disabled:opacity-30"
                style={{ border: "1px solid var(--border-strong)", color: "var(--foreground)" }} aria-label="Decrease">
                <Minus size={18} />
              </button>
              <div className="text-center min-w-[90px]">
                <div className="font-heading text-[3rem] leading-none font-semibold tabular" style={{ color: "var(--foreground)" }}>{val}</div>
                <div className="text-[0.82rem] mt-1" style={{ color: "var(--text-muted)" }}>{step.unit}{val >= step.max ? "+" : ""}</div>
              </div>
              <button onClick={() => set(val + 1)} disabled={val >= step.max}
                className="press flex items-center justify-center w-12 h-12 rounded-full disabled:opacity-30"
                style={{ border: "1px solid var(--border-strong)", color: "var(--foreground)" }} aria-label="Increase">
                <Plus size={18} />
              </button>
            </div>
          );
        })()}

        {step.type === "contact" && (() => {
          const c = (answers[step.id] as Record<string, string>) ?? {};
          const setField = (f: string, v: string) =>
            setAnswers((a) => ({ ...a, [step.id]: { ...((a[step.id] as Record<string, string>) ?? {}), [f]: v } }));
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {step.fields.map((f) => {
                const meta = CONTACT_META[f];
                const full = f === "address";
                return (
                  <div key={f} className={full ? "sm:col-span-2" : ""}>
                    <label className="block text-[0.82rem] font-medium mb-2" style={{ color: "var(--foreground)" }}>
                      {meta.label} {meta.required && <span style={{ color: "var(--brand)" }}>*</span>}
                    </label>
                    <input
                      type={meta.type} placeholder={meta.placeholder} value={c[f] ?? ""}
                      onChange={(e) => setField(f, e.target.value)}
                      onFocus={(e) => { e.target.style.borderColor = "var(--brand)"; e.target.style.boxShadow = "0 0 0 3px rgba(200,81,31,0.12)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "var(--input)"; e.target.style.boxShadow = "none"; }}
                      className="w-full text-[0.95rem] px-4 py-3 outline-none transition-all duration-200"
                      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--input)", color: "var(--foreground)", borderRadius: "var(--radius)" }}
                    />
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between mt-8">
        <button onClick={back} disabled={current === 0}
          className="press inline-flex items-center gap-2 text-[0.9rem] font-medium disabled:opacity-0 transition-opacity"
          style={{ color: "var(--text-muted)" }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={next} disabled={!stepValid(step)}
          className="press inline-flex items-center gap-2.5 px-7 py-3.5 text-white text-[0.95rem] font-medium rounded-[var(--radius)] transition-all duration-300 shadow-soft disabled:opacity-40"
          style={{ backgroundColor: "var(--brand)" }}>
          {isLast ? "Get my estimate" : "Continue"}
          <ArrowRight size={16} />
        </button>
      </div>

      <p className="text-[0.8rem] mt-5" style={{ color: "var(--text-faint)" }}>
        Your information is kept private. No spam, no cold calls.
      </p>
    </div>
  );
}

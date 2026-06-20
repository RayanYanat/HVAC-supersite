"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle } from "lucide-react";
import type { CompanyData } from "@/lib/types";

const NEEDS = [
  { value: "",            label: "Select your service need…" },
  { value: "aircon",      label: "Air conditioning · repair or installation" },
  { value: "heating",     label: "Heating · furnace / heat pump repair or install" },
  { value: "ventilation", label: "Ventilation · ERV / HRV / duct work" },
  { value: "maintenance", label: "Maintenance · annual tune-up / service plan" },
  { value: "other",       label: "Other / general inquiry" },
];

export default function ContactSection({ company }: { company: CompanyData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", need: "", message: "" });

  const CONTACT_DETAILS = [
    { icon: Phone,  label: "Phone",        value: company.phone,         href: `tel:${company.phone}` },
    { icon: Mail,   label: "Email",        value: company.email ?? "On request",  href: company.email ? `mailto:${company.email}` : null },
    ...(company.address ? [{
      icon: MapPin, label: "Address", value: company.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(company.address)}`,
    }] : []),
    { icon: MapPin, label: "Service area", value: company.zone, href: null },
    { icon: Clock,  label: "Hours",        value: company.opening_hours ?? "Emergency 24/7", href: null },
  ];

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.set(".contact-header", { opacity: 0, y: 20 });
      gsap.set(".contact-card", { opacity: 0, y: 26 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 82%", once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
          tl.to(".contact-header", { opacity: 1, y: 0, duration: 0.6 })
            .to(".contact-card", { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, "-=0.3");
        },
      });
    },
    { scope: sectionRef }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputBase = {
    backgroundColor: "var(--surface)",
    border: "1px solid var(--input)",
    color: "var(--foreground)",
    borderRadius: "var(--radius)",
  } as React.CSSProperties;

  const onFocus = (e: React.FocusEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.borderColor = "var(--brand)";
    (e.target as HTMLElement).style.boxShadow = "0 0 0 3px rgba(200,81,31,0.12)";
  };
  const onBlur = (e: React.FocusEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.borderColor = "var(--input)";
    (e.target as HTMLElement).style.boxShadow = "none";
  };

  const labelCls = "block text-[0.82rem] font-medium mb-2";
  const labelStyle = { color: "var(--foreground)" } as React.CSSProperties;

  return (
    <section ref={sectionRef} id="contact" className="relative section-padding bg-bone">
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="contact-header max-w-2xl mb-12 lg:mb-14">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-7 h-px" style={{ backgroundColor: "var(--cool)" }} />
            <span className="font-data text-[12px] tracking-[0.12em] uppercase" style={{ color: "var(--cool)" }}>
              Contact
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05] font-semibold mb-4" style={{ color: "var(--foreground)" }}>
            Request a free estimate.
          </h2>
          <p className="text-[1.05rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Describe your situation and we&apos;ll call you back within{" "}
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>24 hours</span> with
            a concrete solution. No obligation, no pressure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">

          {/* ── Form ── */}
          <div className="contact-card p-7 lg:p-9 rounded-[1rem] bg-surface shadow-soft" style={{ border: "1px solid var(--border-subtle)" }}>
            {sent ? (
              <div className="flex flex-col items-start gap-5 py-6">
                <CheckCircle size={34} style={{ color: "var(--brand)" }} />
                <div>
                  <h3 className="font-heading text-[1.6rem] font-semibold mb-2" style={{ color: "var(--foreground)" }}>Request received</h3>
                  <p className="text-[0.98rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    We&apos;ve got your request. A technician will reach out within{" "}
                    <span style={{ color: "var(--foreground)", fontWeight: 500 }}>24 hours</span> to
                    schedule your service or estimate.
                  </p>
                </div>
                <button onClick={() => { setSent(false); setForm({ name: "", phone: "", need: "", message: "" }); }}
                  className="text-[0.88rem] font-medium transition-colors duration-200"
                  style={{ color: "var(--brand)" }}>
                  ← Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls} style={labelStyle}>Full name <span style={{ color: "var(--brand)" }}>*</span></label>
                    <input required type="text" placeholder="Jane Smith"
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={onFocus} onBlur={onBlur}
                      className="w-full text-[0.95rem] px-4 py-3 outline-none transition-all duration-200"
                      style={inputBase} />
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Phone number <span style={{ color: "var(--brand)" }}>*</span></label>
                    <input required type="tel" placeholder="(415) 555-0199"
                      value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      onFocus={onFocus} onBlur={onBlur}
                      className="w-full text-[0.95rem] px-4 py-3 outline-none transition-all duration-200"
                      style={inputBase} />
                  </div>
                </div>

                <div>
                  <label className={labelCls} style={labelStyle}>Service needed <span style={{ color: "var(--brand)" }}>*</span></label>
                  <div className="relative">
                    <select required value={form.need}
                      onChange={(e) => setForm({ ...form, need: e.target.value })}
                      onFocus={onFocus} onBlur={onBlur}
                      className="w-full appearance-none text-[0.95rem] px-4 py-3 outline-none cursor-pointer transition-all duration-200"
                      style={inputBase}>
                      {NEEDS.map((n) => (
                        <option key={n.value} value={n.value} disabled={n.value === ""}>{n.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelCls} style={labelStyle}>Description (optional)</label>
                  <textarea rows={4}
                    placeholder="Briefly describe the issue, the equipment involved, and how urgent it is…"
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={onFocus} onBlur={onBlur}
                    className="w-full text-[0.95rem] px-4 py-3 outline-none resize-none transition-all duration-200"
                    style={inputBase} />
                </div>

                <button type="submit"
                  className="press inline-flex items-center gap-2.5 px-8 py-3.5 text-white text-[0.95rem] font-medium rounded-[var(--radius)] transition-all duration-300 shadow-soft"
                  style={{ backgroundColor: "var(--brand)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--brand-dim)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--brand)")}>
                  Submit request
                  <ArrowRight size={16} />
                </button>

                <p className="text-[0.82rem]" style={{ color: "var(--text-faint)" }}>
                  Your information is kept private. No spam, no cold calls.
                </p>
              </form>
            )}
          </div>

          {/* ── Info col ── */}
          <div className="contact-card space-y-3">
            {/* Urgency card */}
            <div className="p-6 rounded-[1rem]" style={{ border: "1px solid var(--border-subtle)", backgroundColor: "var(--surface-warm)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: "var(--brand)" }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
                </span>
                <span className="font-data text-[11px] tracking-[0.12em] uppercase" style={{ color: "var(--brand)" }}>
                  Emergency available now
                </span>
              </div>
              <p className="text-[0.95rem] leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                HVAC emergency? We dispatch fast across{" "}
                <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{company.zone}</span>.
              </p>
              <a href={`tel:${company.phone}`} className="inline-flex items-center gap-2.5 text-[0.95rem] font-medium" style={{ color: "var(--brand)" }}>
                <Phone size={15} />
                {company.phone}
              </a>
            </div>

            {/* Details */}
            <div className="space-y-2">
              {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="lift flex items-start gap-3.5 px-5 py-4 rounded-[var(--radius)] bg-surface shadow-soft" style={{ border: "1px solid var(--border-subtle)" }}>
                  <Icon size={16} className="flex-shrink-0 mt-0.5" style={{ color: "var(--cool)" }} />
                  <div className="min-w-0">
                    <p className="text-[0.78rem] mb-0.5" style={{ color: "var(--text-faint)" }}>{label}</p>
                    {href ? (
                      <a href={href} className="text-[0.92rem] truncate block transition-colors duration-200" style={{ color: "var(--foreground)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--brand)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--foreground)")}>
                        {value}
                      </a>
                    ) : (
                      <p className="text-[0.92rem]" style={{ color: "var(--foreground)" }}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

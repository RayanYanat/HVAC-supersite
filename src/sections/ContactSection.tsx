"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle } from "lucide-react";
import type { CompanyData } from "@/lib/types";
import FloatingData from "@/components/shared/FloatingData";

const CONTACT_DATA = [
  { text: "FROST.PT: 32°F",  x: "3%",  y: "10%", delay: "0s",   duration: "12s", opacity: 0.09  },
  { text: "COOLING.ON",      x: "78%", y: "8%",  delay: "4s",   duration: "10s", opacity: 0.075 },
  { text: "AIRFLOW: ACTIVE", x: "5%",  y: "72%", delay: "2s",   duration: "9s",  opacity: 0.08  },
  { text: "TEMP: 68.0°F",    x: "68%", y: "82%", delay: "6s",   duration: "13s", opacity: 0.065 },
  { text: "STATUS: ONLINE",  x: "50%", y: "5%",  delay: "1s",   duration: "11s", opacity: 0.07  },
];

const NEEDS = [
  { value: "",            label: "— Select your service need —" },
  { value: "aircon",      label: "Air Conditioning — AC Repair or Installation" },
  { value: "heating",     label: "Heating — Furnace / Heat Pump Repair or Install" },
  { value: "ventilation", label: "Ventilation — ERV / HRV / Duct Work" },
  { value: "maintenance", label: "Maintenance — Annual Tune-Up / Service Plan" },
  { value: "other",       label: "Other / General Inquiry" },
];

/* CONTACT_DETAILS is built inside the component so it can reference company */

/* Cold palette for this section */
const COLD = "#38BDF8";
const COLD_FOCUS_BORDER = "rgba(56,189,248,0.6)";
const COLD_FOCUS_SHADOW = "0 0 0 1px rgba(56,189,248,0.2)";

export default function ContactSection({ company }: { company: CompanyData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", need: "", message: "" });

  const CONTACT_DETAILS = [
    { icon: Phone,  label: "Phone",        value: company.phone,         href: `tel:${company.phone}` },
    { icon: Mail,   label: "Email",        value: company.email ?? "—",  href: company.email ? `mailto:${company.email}` : null },
    ...(company.address ? [{
      icon: MapPin, label: "Address", value: company.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(company.address)}`,
    }] : []),
    { icon: MapPin, label: "Service Area", value: company.zone, href: null },
    { icon: Clock,  label: "Hours",        value: "Mon–Sat · 8am–7pm · Emergency 24/7", href: null },
  ];

  /*
   * "Interface de commande initialisée" — command-line form boot.
   *
   * Form rows reveal top-to-bottom via horizontal clip-path demask
   * (left → right), like fields being typed onto a terminal one
   * line at a time. Stagger 0.12s per row.
   *
   * Right info column slides in from the right with a slight delay
   * after the form rows start — establishes the form as primary,
   * info panel as secondary supporting context.
   *
   * Note: form rows only exist while !sent. Selectors are scoped to
   * sectionRef so post-submit re-renders are no-ops (safe).
   */
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
      const xAmp = isMobile ? 25 : 50;

      gsap.set(".contact-header",   { opacity: 0, y: 20 });
      gsap.set(".contact-row", {
        opacity: 0,
        clipPath: "inset(0% 100% 0% 0%)",
      });
      gsap.set(".contact-info-col", { opacity: 0, x: xAmp });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%", once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          tl.to(".contact-header", {
            opacity: 1, y: 0,
            duration: 0.7, ease: "power3.out",
          });

          tl.to(".contact-row", {
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.55,
            stagger: 0.12,
            ease: "power3.out",
          }, "-=0.35");

          tl.to(".contact-info-col", {
            opacity: 1, x: 0,
            duration: 0.85,
            ease: "power3.out",
          }, "-=0.5");
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
    backgroundColor: "#0D1117",
    border: "1px solid rgba(56,189,248,0.12)",
    color: "rgba(255,255,255,0.8)",
  };

  const onFocus = (e: React.FocusEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.borderColor = COLD_FOCUS_BORDER;
    (e.target as HTMLElement).style.boxShadow = COLD_FOCUS_SHADOW;
  };
  const onBlur = (e: React.FocusEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.borderColor = "rgba(56,189,248,0.12)";
    (e.target as HTMLElement).style.boxShadow = "none";
  };

  return (
    <section ref={sectionRef} id="contact"
      className="relative section-padding overflow-hidden"
      style={{ backgroundColor: "rgba(9,12,18,0.84)" }}>

      <FloatingData points={CONTACT_DATA} />

      {/* Cold grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(56,189,248,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,189,248,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }} />

      {/* Cold ambient glow — animated */}
      <div className="absolute -right-20 top-1/3 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(56,189,248,0.13) 0%, transparent 65%)",
          animation: "breathe 11s ease-in-out infinite",
        }} />
      <div className="absolute -left-40 bottom-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(56,189,248,0.10) 0%, transparent 65%)",
          animation: "breathe 15s ease-in-out infinite reverse",
          animationDelay: "4s",
        }} />
      <div className="absolute left-1/3 top-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(56,189,248,0.065) 0%, transparent 65%)",
          animation: "breathe 8s ease-in-out infinite",
          animationDelay: "2s",
        }} />

      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${COLD}40, transparent)` }} />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="contact-header mb-16 lg:mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px" style={{ backgroundColor: COLD }} />
            <span className="font-data text-[11px] tracking-[0.28em] uppercase"
              style={{ color: `${COLD}B0` }}>
              Contact
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.9] text-white font-extrabold mb-4">
            REQUEST A<br />
            <span style={{ color: COLD, textShadow: "0 0 40px rgba(56,189,248,0.4)" }}>
              FREE ESTIMATE
            </span>
          </h2>
          <p className="max-w-lg text-base leading-relaxed"
            style={{ color: "rgba(255,255,255,0.4)" }}>
            Describe your situation. We&apos;ll call you back within{" "}
            <span style={{ color: "rgba(255,255,255,0.75)" }}>24 hours</span> with
            a concrete solution — no obligation, no pressure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-16">

          {/* ── Form ── */}
          <div className="contact-form-col">
            {sent ? (
              <div className="p-10 flex flex-col items-start gap-5"
                style={{ border: `1px solid ${COLD}40`, backgroundColor: `${COLD}08` }}>
                <CheckCircle size={32} style={{ color: COLD }} />
                <div>
                  <h3 className="font-heading text-2xl text-white font-bold mb-2">REQUEST RECEIVED</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                    We&apos;ve got your request. A technician will reach out within{" "}
                    <span style={{ color: "rgba(255,255,255,0.75)" }}>24 hours</span> to
                    schedule your service or estimate.
                  </p>
                </div>
                <button onClick={() => { setSent(false); setForm({ name: "", phone: "", need: "", message: "" }); }}
                  className="font-data text-[11px] tracking-widest uppercase transition-colors duration-200"
                  style={{ color: `${COLD}80` }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = COLD)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = `${COLD}80`)}>
                  ← Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="contact-row grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block font-data text-[10px] tracking-[0.25em] uppercase mb-2"
                      style={{ color: "rgba(255,255,255,0.3)" }}>
                      Full Name <span style={{ color: COLD }}>*</span>
                    </label>
                    <input required type="text" placeholder="[Jane Smith]"
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={onFocus} onBlur={onBlur}
                      className="w-full text-sm px-4 py-3.5 outline-none transition-all duration-200 placeholder:opacity-20"
                      style={inputBase} />
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block font-data text-[10px] tracking-[0.25em] uppercase mb-2"
                      style={{ color: "rgba(255,255,255,0.3)" }}>
                      Phone Number <span style={{ color: COLD }}>*</span>
                    </label>
                    <input required type="tel" placeholder="[(XXX) XXX-XXXX]"
                      value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      onFocus={onFocus} onBlur={onBlur}
                      className="w-full text-sm px-4 py-3.5 outline-none transition-all duration-200 placeholder:opacity-20"
                      style={inputBase} />
                  </div>
                </div>

                {/* Need */}
                <div className="contact-row">
                  <label className="block font-data text-[10px] tracking-[0.25em] uppercase mb-2"
                    style={{ color: "rgba(255,255,255,0.3)" }}>
                    Service Needed <span style={{ color: COLD }}>*</span>
                  </label>
                  <div className="relative">
                    <select required value={form.need}
                      onChange={(e) => setForm({ ...form, need: e.target.value })}
                      onFocus={onFocus} onBlur={onBlur}
                      className="w-full appearance-none text-sm px-4 py-3.5 outline-none cursor-pointer transition-all duration-200"
                      style={inputBase}>
                      {NEEDS.map((n) => (
                        <option key={n.value} value={n.value} disabled={n.value === ""}
                          style={{ backgroundColor: "#0D1117" }}>
                          {n.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke={`${COLD}80`} strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="contact-row">
                  <label className="block font-data text-[10px] tracking-[0.25em] uppercase mb-2"
                    style={{ color: "rgba(255,255,255,0.3)" }}>
                    Description (optional)
                  </label>
                  <textarea rows={4}
                    placeholder="Briefly describe the issue, the equipment involved, and how urgent it is..."
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={onFocus} onBlur={onBlur}
                    className="w-full text-sm px-4 py-3.5 outline-none resize-none transition-all duration-200 placeholder:opacity-20"
                    style={inputBase} />
                </div>

                {/* Submit — stays orange for urgency conversion */}
                <button type="submit"
                  className="contact-row group relative flex items-center gap-3 px-9 py-4 text-white text-xs font-bold tracking-[0.2em] uppercase overflow-hidden transition-colors duration-200 glow-brand"
                  style={{ backgroundColor: "#FF6B1A" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#C4420A")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#FF6B1A")}>
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)" }} />
                  <span>Submit Request</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="contact-row font-data text-[10px] tracking-wider"
                  style={{ color: "rgba(255,255,255,0.18)" }}>
                  Your information is kept private — no spam, no cold calls.
                </p>
              </form>
            )}
          </div>

          {/* ── Info col ── */}
          <div className="contact-info-col space-y-3">

            {/* Urgency card — cold framing for Texas */}
            <div className="p-6 mb-6"
              style={{ border: `1px solid ${COLD}30`, backgroundColor: `${COLD}07` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                    style={{ backgroundColor: COLD }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: COLD }} />
                </span>
                <span className="font-data text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: COLD }}>
                  Emergency Available Now
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4"
                style={{ color: "rgba(255,255,255,0.6)" }}>
                AC down in the Texas heat?
                We dispatch within{" "}
                <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>2 hours</span> across{" "}
                <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{company.zone}</span>.
              </p>
              <a href={`tel:${company.phone}`}
                className="flex items-center gap-2.5 text-sm font-bold tracking-wider transition-colors duration-200"
                style={{ color: COLD }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}>
                <Phone size={14} />
                {company.phone}
              </a>
            </div>

            {/* Details */}
            <div className="space-y-1">
              {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 px-5 py-4 transition-colors duration-200"
                  style={{ border: "1px solid rgba(56,189,248,0.07)", backgroundColor: "#0D1117" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = `${COLD}22`)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(56,189,248,0.07)")}>
                  <Icon size={14} className="flex-shrink-0 mt-0.5"
                    style={{ color: `${COLD}70` }} />
                  <div className="min-w-0">
                    <p className="font-data text-[9px] tracking-[0.22em] uppercase mb-1"
                      style={{ color: "rgba(255,255,255,0.22)" }}>{label}</p>
                    {href ? (
                      <a href={href} className="text-sm truncate block transition-colors duration-200"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = COLD)}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}>
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{value}</p>
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

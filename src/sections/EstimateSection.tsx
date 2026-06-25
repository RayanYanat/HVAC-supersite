"use client";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Clock, FileText, CalendarDays } from "lucide-react";
import type { CompanyData } from "@/lib/types";
import { getTemplateNiche } from "@/lib/niche";
import EstimateForm from "@/components/conversion/EstimateForm";
import BookingEmbed from "@/components/conversion/BookingEmbed";

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? "your-cal-username/estimate";

export default function EstimateSection({ company }: { company: CompanyData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const niche = getTemplateNiche();
  const [tab, setTab] = useState<"form" | "booking">("form");

  /* Open the booking tab when a "#book" CTA is used. The smooth-scroll handler
     preventDefaults anchor clicks (so the hash never changes) — so we listen to
     BOTH the hash (direct URL) and clicks on any #book link (the hero/CTA). */
  useEffect(() => {
    const openBooking = () => setTab("booking");
    const onHash = () => { if (window.location.hash === "#book") openBooking(); };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.('a[href="#book"]')) openBooking();
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const CONTACT_DETAILS = [
    { icon: Phone,  label: "Phone",        value: company.phone,        href: `tel:${company.phone}` },
    { icon: Mail,   label: "Email",        value: company.email ?? "On request", href: company.email ? `mailto:${company.email}` : null },
    ...(company.address ? [{
      icon: MapPin, label: "Address", value: company.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(company.address)}`,
    }] : []),
    { icon: MapPin, label: "Service area", value: company.zone, href: null },
    { icon: Clock,  label: "Hours",        value: company.opening_hours ?? "By appointment", href: null },
  ];

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.set(".est-header", { opacity: 0, y: 20 });
      gsap.set(".est-card", { opacity: 0, y: 26 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 82%", once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
          tl.to(".est-header", { opacity: 1, y: 0, duration: 0.6 })
            .to(".est-card", { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, "-=0.3");
        },
      });
    },
    { scope: sectionRef }
  );

  const TabButton = ({ id, icon: Icon, label }: { id: "form" | "booking"; icon: typeof FileText; label: string }) => {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        className="press inline-flex items-center gap-2.5 px-5 py-3 rounded-[var(--radius)] text-[0.92rem] font-medium transition-all duration-200"
        style={{
          backgroundColor: active ? "var(--brand)" : "var(--surface)",
          color: active ? "#fff" : "var(--text-muted)",
          border: `1px solid ${active ? "var(--brand)" : "var(--border-subtle)"}`,
        }}
      >
        <Icon size={17} />
        {label}
      </button>
    );
  };

  return (
    <section ref={sectionRef} id="contact" className="relative section-padding bg-bone">
      {/* booking deep-link anchor (offset under navbar) */}
      <span id="book" className="absolute" style={{ top: 0 }} aria-hidden />
      <div id="estimate" className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="est-header max-w-2xl mb-10 lg:mb-12">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-7 h-px" style={{ backgroundColor: "var(--cool)" }} />
            <span className="font-data text-[12px] tracking-[0.12em] uppercase" style={{ color: "var(--cool)" }}>
              {niche.form.eyebrow}
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05] font-semibold mb-4" style={{ color: "var(--foreground)" }}>
            {niche.form.title}
          </h2>
          <p className="text-[1.05rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {niche.form.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">

          {/* ── Conversion card (tabs) ── */}
          <div className="est-card">
            <div className="flex gap-2.5 mb-6">
              <TabButton id="form" icon={FileText} label="Request an estimate" />
              <TabButton id="booking" icon={CalendarDays} label="Book a visit" />
            </div>

            <div className="p-6 lg:p-8 rounded-[1.1rem] bg-surface shadow-soft" style={{ border: "1px solid var(--border-subtle)" }}>
              {tab === "form" ? (
                <EstimateForm form={niche.form} />
              ) : (
                <div>
                  <h3 className="font-heading text-[1.5rem] lg:text-[1.7rem] font-semibold leading-tight mb-1.5" style={{ color: "var(--foreground)" }}>
                    {niche.booking.title}
                  </h3>
                  <p className="text-[0.95rem] leading-relaxed mb-6 max-w-md" style={{ color: "var(--text-muted)" }}>
                    {niche.booking.subtitle}
                  </p>
                  <BookingEmbed calLink={CAL_LINK} />
                </div>
              )}
            </div>
          </div>

          {/* ── Info col ── */}
          <div className="est-card space-y-3">
            <div className="p-6 rounded-[1rem]" style={{ border: "1px solid var(--border-subtle)", backgroundColor: "var(--surface-warm)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: "var(--brand)" }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
                </span>
                <span className="font-data text-[11px] tracking-[0.12em] uppercase" style={{ color: "var(--brand)" }}>
                  {niche.aside.badge}
                </span>
              </div>
              <p className="text-[0.95rem] leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                {niche.aside.text}
              </p>
              <a href={`tel:${company.phone}`} className="inline-flex items-center gap-2.5 text-[0.95rem] font-medium" style={{ color: "var(--brand)" }}>
                <Phone size={15} />
                {company.phone}
              </a>
            </div>

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

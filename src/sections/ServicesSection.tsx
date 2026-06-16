"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { Flame, Thermometer, AirVent, Wrench, ArrowRight } from "lucide-react";
import FloatingData from "@/components/shared/FloatingData";

const SVC_DATA = [
  { text: "SYS.HEATING", x: "3%",  y: "12%", delay: "0s",   duration: "9s",  opacity: 0.09  },
  { text: "BTU: 80K",    x: "78%", y: "8%",  delay: "3s",   duration: "11s", opacity: 0.07  },
  { text: "EFF: 96.4%",  x: "60%", y: "88%", delay: "1.5s", duration: "8s",  opacity: 0.08  },
  { text: "FLOW.OK",     x: "5%",  y: "75%", delay: "5s",   duration: "13s", opacity: 0.065 },
  { text: "TX.ZONE.A",   x: "88%", y: "55%", delay: "2s",   duration: "10s", opacity: 0.07  },
];

/* ─── Per-service color tokens ──────────────────────────── */
const PALETTE = {
  heating:     { accent: "#FF6B1A", dim: "#C4420A", glow: "rgba(255,107,26,0.11)",  bgIcon: "rgba(255,107,26,0.09)"  },
  aircon:      { accent: "#38BDF8", dim: "#0EA5E9", glow: "rgba(56,189,248,0.10)",  bgIcon: "rgba(56,189,248,0.09)"  },
  ventilation: { accent: "#0EA5E9", dim: "#0284C7", glow: "rgba(14,165,233,0.09)",  bgIcon: "rgba(14,165,233,0.09)"  },
  maintenance: { accent: "#94A3B8", dim: "#64748B", glow: "rgba(148,163,184,0.07)", bgIcon: "rgba(148,163,184,0.07)" },
};

const SERVICES = [
  {
    num: "01", icon: Flame, color: PALETTE.heating,
    img: "/hvac/Gemini_Generated_Image_ifqtwyifqtwyifqt.webp",
    domain: "Heating",
    headline: "My heating system broke down",
    detail: "Furnace failure, no heat, cold rooms — we dispatch within 2 hours. Full diagnostic included, no hidden fees.",
    tags: ["Gas / Electric Furnace", "Heat Pump", "Radiant Floor", "Boiler"],
    cta: "Request Emergency Service",
    featured: true,
  },
  {
    num: "02", icon: Thermometer, color: PALETTE.aircon,
    img: "/hvac/Gemini_Generated_Image_bs76gtbs76gtbs76.webp",
    domain: "Air Conditioning",
    headline: "I need AC installed or repaired",
    detail: "Central AC, mini-split, ductless systems — NATE-certified installation. Free in-home estimate. Financing available.",
    tags: ["Central AC", "Mini-Split", "Ductless", "AC Repair"],
    cta: "Get a Free Estimate",
    featured: false,
  },
  {
    num: "03", icon: AirVent, color: PALETTE.ventilation,
    img: "/hvac/Gemini_Generated_Image_t77cryt77cryt77c.webp",
    domain: "Ventilation",
    headline: "My indoor air quality is poor",
    detail: "ERV / HRV systems, duct cleaning, air purification — fresh, filtered air throughout your home, year-round.",
    tags: ["ERV / HRV", "Duct Cleaning", "Air Purification", "Dehumidification"],
    cta: "Explore My Options",
    featured: false,
  },
  {
    num: "04", icon: Wrench, color: PALETTE.maintenance,
    img: "/hvac/Gemini_Generated_Image_3gqvr93gqvr93gqv.webp",
    domain: "Maintenance",
    headline: "I want to protect my equipment",
    detail: "Annual service plans — tune-ups, priority scheduling, parts discounts. One trusted partner for all your HVAC needs.",
    tags: ["Annual Tune-Up", "Priority Service", "Parts Discount", "Multi-System Plans"],
    cta: "View Service Plans",
    featured: false,
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  /*
   * "Connexion de modules" — alternating-direction card slide-in.
   *
   * Each card flies in from the side opposite to its index parity, with
   * a 1.5° rotation that corrects to 0°. The cards land like control
   * panels snapping into place on a rack.
   *
   *   index 0 (Heating)     → from LEFT,  rotation -1.5°
   *   index 1 (AirCon)      → from RIGHT, rotation +1.5°
   *   index 2 (Ventilation) → from LEFT,  rotation -1.5°
   *   index 3 (Maintenance) → from RIGHT, rotation +1.5°
   *
   * Mobile (<640px) halves the X-amplitude so the effect remains
   * visible without breaking layout on narrow viewports.
   */
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.set(".svc-header", { opacity: 0, y: 30 });
      gsap.set(".svc-card", {
        opacity: 0,
        x:        (i) => (i % 2 === 0 ? -60 : 60),
        rotation: (i) => (i % 2 === 0 ? -1.5 : 1.5),
        transformOrigin: "center center",
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%", once: true,
        onEnter: () => {
          // Adapt amplitude for mobile in the to-tween (re-set if needed)
          if (window.innerWidth < 640) {
            gsap.set(".svc-card", {
              x: (i) => (i % 2 === 0 ? -30 : 30),
            });
          }

          gsap.to(".svc-header", {
            opacity: 1, y: 0,
            duration: 0.7, ease: "power3.out",
          });
          gsap.to(".svc-card", {
            opacity: 1, x: 0, rotation: 0,
            duration: 0.85, stagger: 0.12,
            ease: "power3.out", delay: 0.15,
          });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="services"
      className="relative section-padding overflow-hidden"
      style={{ backgroundColor: "rgba(13,15,18,0.84)" }}>

      {/* Floating ambient data */}
      <FloatingData points={SVC_DATA} />

      {/* Animated ambient blobs */}
      <div className="absolute -left-48 top-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,107,26,0.11) 0%, transparent 62%)",
          animation: "breathe 11s ease-in-out infinite",
        }} />
      <div className="absolute -right-32 bottom-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,107,26,0.075) 0%, transparent 62%)",
          animation: "breathe 15s ease-in-out infinite reverse",
          animationDelay: "4s",
        }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255,107,26,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,107,26,0.018) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }} />
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,107,26,0.3), transparent)" }} />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="svc-header mb-16 lg:mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px" style={{ backgroundColor: "#FF6B1A" }} />
            <span className="font-data text-[11px] tracking-[0.28em] uppercase"
              style={{ color: "rgba(255,107,26,0.75)" }}>
              Our Services
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.9] text-white font-extrabold mb-5">
            WHAT DO YOU<br />
            <span style={{ color: "#FF6B1A" }}>NEED TODAY?</span>
          </h2>
          <p className="max-w-xl text-base leading-relaxed"
            style={{ color: "rgba(255,255,255,0.68)" }}>
            Every situation is different. Pick what matches your problem —
            we&apos;ll handle everything else.
          </p>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            const c = svc.color;
            return (
              <div key={svc.num}
                className="svc-card group relative flex flex-col p-8 lg:p-10 overflow-hidden transition-all duration-500"
                style={{
                  backgroundColor: "#0A0C0F",
                  border: `1px solid ${svc.featured ? `${c.accent}28` : "rgba(255,255,255,0.05)"}`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${c.accent}55`;
                  el.style.boxShadow = `0 0 50px ${c.glow}`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = svc.featured ? `${c.accent}28` : "rgba(255,255,255,0.05)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Background image — treated as duotone texture */}
                <Image
                  src={svc.img}
                  alt={svc.domain}
                  fill
                  className="object-cover opacity-[0.28] group-hover:opacity-[0.50] transition-opacity duration-700"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {/* Colour tint overlay — accent on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 110%, ${c.accent}12 0%, transparent 70%)` }} />

                {/* Number watermark */}
                <span className="absolute top-5 right-7 font-heading text-[6rem] leading-none font-extrabold select-none pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.55)" }}>
                  {svc.num}
                </span>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: `${c.accent}80` }} />
                <div className="absolute bottom-0 left-0 right-0 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: `linear-gradient(to top, ${c.accent}0D, transparent)` }} />

                {/* Top row */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-data text-[11px] tracking-[0.3em] uppercase font-semibold"
                    style={{ color: `${c.accent}B0` }}>
                    {svc.domain}
                  </span>
                  <div className="relative w-11 h-11 flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: c.bgIcon }}>
                    <Icon size={18} style={{ color: c.accent }} />
                  </div>
                </div>

                {/* Headline */}
                <h3 className="font-heading text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.05] text-white font-bold mb-4">
                  {svc.headline}
                </h3>

                {/* Detail */}
                <p className="text-sm leading-relaxed mb-7 flex-1"
                  style={{ color: "rgba(255,255,255,0.65)" }}>
                  {svc.detail}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {svc.tags.map((tag) => (
                    <span key={tag}
                      className="font-data text-[10px] tracking-wider uppercase px-2.5 py-1 transition-colors duration-300"
                      style={{ color: `${c.accent}70`, border: `1px solid ${c.accent}22` }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a href="#contact"
                  className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 group/cta w-fit"
                  style={{ color: `${c.accent}80` }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = c.accent)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = `${c.accent}80`)}>
                  <span>{svc.cta}</span>
                  <ArrowRight size={12} className="group-hover/cta:translate-x-1.5 transition-transform duration-200" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Bottom strip */}
        <div className="mt-10 flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
          <p className="font-data text-[11px] tracking-wider uppercase text-center"
            style={{ color: "rgba(255,255,255,0.48)" }}>
            All work fully guaranteed — Free estimates, no commitment
          </p>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
        </div>
      </div>
    </section>
  );
}

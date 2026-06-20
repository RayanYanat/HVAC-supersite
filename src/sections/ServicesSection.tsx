"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { Flame, Thermometer, AirVent, Wrench, ArrowRight } from "lucide-react";

/* Each service carries a hot/cold accent — heating/maintenance = ember,
   cooling/ventilation = slate. The duality reads across the whole grid. */
const SERVICES = [
  {
    icon: Flame, accent: "var(--brand)", tone: "hot",
    img: "/hvac/service-heating.webp",
    domain: "Heating",
    headline: "My heating system broke down",
    detail: "Furnace failure, no heat, cold rooms. We dispatch fast. Full diagnostic included, no hidden fees.",
    tags: ["Furnace", "Heat pump", "Boiler"],
    cta: "Request emergency service",
  },
  {
    icon: Thermometer, accent: "var(--cool)", tone: "cold",
    img: "/hvac/service-cooling.webp",
    domain: "Air conditioning",
    headline: "I need AC installed or repaired",
    detail: "Central AC, mini-split, ductless systems. Clean installation, free in-home estimate, financing available.",
    tags: ["Central AC", "Mini-split", "Repair"],
    cta: "Get a free estimate",
  },
  {
    icon: AirVent, accent: "var(--cool)", tone: "cold",
    img: "/hvac/service-ventilation.webp",
    domain: "Ventilation",
    headline: "My indoor air quality is poor",
    detail: "ERV / HRV systems, duct cleaning, air purification. Fresh, filtered air throughout your home, year-round.",
    tags: ["ERV / HRV", "Duct cleaning", "Purification"],
    cta: "Explore my options",
  },
  {
    icon: Wrench, accent: "var(--brand)", tone: "hot",
    img: "/hvac/service-maintenance.webp",
    domain: "Maintenance",
    headline: "I want to protect my equipment",
    detail: "Annual service plans: tune-ups, priority scheduling, parts discounts. One trusted partner for it all.",
    tags: ["Annual tune-up", "Priority", "Plans"],
    cta: "View service plans",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.set(".svc-header", { opacity: 0, y: 24 });
      gsap.set(".svc-card", { opacity: 0, y: 28 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%", once: true,
        onEnter: () => {
          gsap.to(".svc-header", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
          gsap.to(".svc-card", { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.1 });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="services" className="relative section-padding bg-bone">
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="svc-header max-w-2xl mb-14 lg:mb-16">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-7 h-px" style={{ backgroundColor: "var(--brand)" }} />
            <span className="font-data text-[12px] tracking-[0.12em] uppercase" style={{ color: "var(--brand)" }}>
              Our services
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05] font-semibold" style={{ color: "var(--foreground)" }}>
            What do you need today?
          </h2>
          <p className="text-[1.05rem] leading-relaxed mt-4" style={{ color: "var(--text-muted)" }}>
            Every situation is different. Pick what matches your problem.
            we&apos;ll handle everything else.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <article
                key={svc.domain}
                className="svc-card group flex flex-col rounded-[1rem] overflow-hidden transition-all duration-300 bg-surface shadow-soft"
                style={{ border: "1px solid var(--border-subtle)" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 4px 8px rgba(74,49,28,0.08), 0 18px 36px rgba(74,49,28,0.13), 0 40px 70px rgba(74,49,28,0.14)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = ""; }}
              >
                {/* Photo */}
                <div className="relative h-44 lg:h-52 overflow-hidden" style={{ backgroundColor: "var(--surface-warm)" }}>
                  <Image
                    src={svc.img}
                    alt={svc.domain}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  {/* tone tab */}
                  <span
                    className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.72rem] font-medium"
                    style={{ backgroundColor: "var(--surface)", color: svc.accent }}
                  >
                    <Icon size={14} />
                    {svc.domain}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-6 lg:p-7">
                  <h3 className="font-heading text-[1.4rem] leading-snug font-semibold mb-2.5" style={{ color: "var(--foreground)" }}>
                    {svc.headline}
                  </h3>
                  <p className="text-[0.95rem] leading-relaxed mb-5 flex-1" style={{ color: "var(--text-muted)" }}>
                    {svc.detail}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {svc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.75rem] px-2.5 py-1 rounded-full"
                        style={{ color: "var(--text-muted)", backgroundColor: "var(--surface-warm)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-[0.9rem] font-medium w-fit transition-colors duration-200"
                    style={{ color: svc.accent }}
                  >
                    <span>{svc.cta}</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Reassurance strip */}
        <div className="mt-10 flex items-center justify-center gap-3 text-center">
          <span className="text-[0.9rem]" style={{ color: "var(--text-muted)" }}>
            All work fully guaranteed. Free estimates, no commitment.
          </span>
        </div>
      </div>
    </section>
  );
}

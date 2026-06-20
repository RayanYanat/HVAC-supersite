"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Phone, ArrowRight, MapPin, ShieldCheck, Star, Flame, Snowflake } from "lucide-react";
import type { CompanyData } from "@/lib/types";

export default function HeroSection({ company }: { company: CompanyData }) {
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Calm editorial entrance ──────────────────────────────────────
   * Gentle upward fades, no violent parallax. Premium = restraint.
   * Classes are pre-hidden in globals.css (FOUC guard); GSAP reveals. */
  useGSAP(
    () => {
      gsap.set([".hero-badge", ".hero-sub", ".hero-cta", ".hero-data-strip"], { y: 14 });
      gsap.set([".hero-title-1", ".hero-title-2"], { y: 24 });
      gsap.set(".hero-frame", { scale: 0.97 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to(".hero-badge", { y: 0, opacity: 1, duration: 0.6 })
        .to(".hero-title-1", { y: 0, opacity: 1, duration: 0.8 }, "-=0.3")
        .to(".hero-title-2", { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
        .to(".hero-sub", { y: 0, opacity: 1, duration: 0.6 }, "-=0.5")
        .to(".hero-cta", { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, "-=0.35")
        .to(".hero-data-strip", { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
        .to(".hero-frame", { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }, "-=0.8");

      /* Gentle scroll parallax on the hero photo — image is pre-scaled so the
         drift never reveals an edge. Skipped under reduced-motion. */
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        gsap.registerPlugin(ScrollTrigger);
        gsap.to(".hero-photo", {
          yPercent: -9,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-bone"
    >
      {/* Top hairline — the hot/cold signature, woven in quietly */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-10"
        style={{ background: "linear-gradient(to right, #C8511F 0%, #C8511F 50%, #2B6E8F 50%, #2B6E8F 100%)" }}
      />

      {/* Soft cool light, upper area — leads on freshness / cooling */}
      <div
        className="absolute -top-40 right-[-10%] w-[680px] h-[680px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(43,110,143,0.09) 0%, transparent 65%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-28 lg:pt-36 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">

          {/* ── Left: editorial content ── */}
          <div>
            {/* Eyebrow */}
            <div className="hero-badge flex items-center gap-2.5 mb-7">
              <MapPin size={15} className="text-cool" />
              <span className="font-data text-[12px] tracking-[0.12em] uppercase" style={{ color: "var(--cool)" }}>
                Serving {company.city} &amp; surrounding areas
              </span>
            </div>

            {/* Headline — editorial serif, sentence case */}
            <h1 className="font-heading text-[clamp(2.9rem,6vw,5rem)] leading-[1.02] font-semibold tracking-[-0.02em]" style={{ color: "var(--foreground)" }}>
              <span className="hero-title-1 block">Heating &amp; cooling</span>
              <span className="hero-title-2 block">
                you can{" "}
                <span className="italic" style={{ color: "var(--brand)" }}>count&nbsp;on</span>.
              </span>
            </h1>

            {/* Subhead */}
            <p className="hero-sub max-w-md text-[1.06rem] leading-relaxed mt-7" style={{ color: "var(--text-muted)" }}>
              Furnace down or AC out? Licensed local technicians, same-day
              service, and a free estimate — no surprises, across{" "}
              <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{company.zone}</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3.5 mt-9">
              <a
                href={`tel:${company.phone}`}
                className="group press inline-flex items-center justify-center gap-2.5 px-7 py-4 text-white text-[0.95rem] font-medium rounded-[var(--radius)] transition-all duration-300 shadow-soft"
                style={{ backgroundColor: "var(--brand)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--brand-dim)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--brand)")}
              >
                <Phone size={17} />
                <span>Call now — {company.phone}</span>
              </a>
              <a
                href="#contact"
                className="group press inline-flex items-center justify-center gap-2.5 px-7 py-4 text-[0.95rem] font-medium rounded-[var(--radius)] transition-all duration-300 hover:bg-[rgba(28,26,23,0.04)]"
                style={{ color: "var(--foreground)", border: "1px solid var(--border-strong)" }}
              >
                <span>Free estimate</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>

            {/* Heating / cooling duality pills */}
            <div className="hero-data-strip flex flex-wrap items-center gap-x-8 gap-y-4 mt-12 pt-8" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-2.5">
                <Snowflake size={17} className="text-cool" />
                <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Cooling</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Flame size={17} className="text-brand" />
                <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Heating</span>
              </div>
              <div className="h-8 w-px hidden sm:block" style={{ backgroundColor: "var(--border-subtle)" }} />
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-xl font-semibold" style={{ color: "var(--foreground)" }}>15+</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>years local</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={15} fill="#E2611E" className="text-brand-bright" style={{ color: "#E2611E" }} />
                <span className="font-heading text-xl font-semibold" style={{ color: "var(--foreground)" }}>4.9</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>500+ reviews</span>
              </div>
            </div>
          </div>

          {/* ── Right: comfort photo ── */}
          <div className="hero-frame relative">
            <div className="relative aspect-[4/5] sm:aspect-[5/5] lg:aspect-[4/5] rounded-[1.1rem] overflow-hidden shadow-card" style={{ backgroundColor: "var(--surface-warm)" }}>
              <Image
                src="/hvac/hero-comfort.webp"
                alt="Cool, fresh, comfortable home interior on a hot day"
                fill
                priority
                className="hero-photo object-cover scale-[1.12] will-change-transform"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* gentle bottom scrim for badge legibility */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(28,26,23,0.28) 0%, transparent 38%)" }} />

              {/* Floating trust badge */}
              <div className="absolute left-4 bottom-4 flex items-center gap-3 px-4 py-3 rounded-[var(--radius)] shadow-soft" style={{ backgroundColor: "var(--surface)" }}>
                <span className="flex items-center justify-center w-9 h-9 rounded-md text-white" style={{ backgroundColor: "var(--cool)" }}>
                  <ShieldCheck size={19} />
                </span>
                <div>
                  <div className="text-[0.9rem] font-medium leading-tight" style={{ color: "var(--foreground)" }}>Licensed &amp; insured</div>
                  <div className="text-[0.78rem]" style={{ color: "var(--text-muted)" }}>Background-checked techs</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

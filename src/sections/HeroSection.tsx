"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Phone, ArrowRight, MapPin, Star, Snowflake, Flame } from "lucide-react";
import type { CompanyData } from "@/lib/types";

export default function HeroSection({ company }: { company: CompanyData }) {
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Cinematic entrance + slow zoom + scroll parallax ─────────────── */
  useGSAP(
    () => {
      gsap.set([".hero-badge", ".hero-sub", ".hero-cta", ".hero-data-strip"], { y: 18, opacity: 0 });
      gsap.set([".hero-title-1", ".hero-title-2"], { y: 34, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".hero-badge", { y: 0, opacity: 1, duration: 0.7 }, 0.2)
        .to(".hero-title-1", { y: 0, opacity: 1, duration: 1.0 }, "-=0.4")
        .to(".hero-title-2", { y: 0, opacity: 1, duration: 1.0 }, "-=0.8")
        .to(".hero-sub", { y: 0, opacity: 1, duration: 0.7 }, "-=0.55")
        .to(".hero-cta", { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 }, "-=0.4")
        .to(".hero-data-strip", { y: 0, opacity: 1, duration: 0.7 }, "-=0.35")
        .to(".hero-scroll", { opacity: 1, duration: 0.8 }, "-=0.3");

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        gsap.registerPlugin(ScrollTrigger);
        // Slow cinematic zoom-in on load
        gsap.fromTo(".hero-photo", { scale: 1.18 }, { scale: 1.06, duration: 2.4, ease: "power2.out" });
        // Scroll parallax — image drifts up slower than the page
        gsap.to(".hero-photo", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true },
        });
        // Content lifts away slightly as you scroll past
        gsap.to(".hero-content", {
          yPercent: -8, opacity: 0.6, ease: "none",
          scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden"
      style={{ backgroundColor: "#17120D" }}
    >
      {/* Top hot/cold hairline */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-30"
        style={{ background: "linear-gradient(to right, #E2611E 0%, #E2611E 50%, #38A0C4 50%, #38A0C4 100%)" }}
      />

      {/* ── Full-bleed image ── */}
      <div className="absolute inset-0" style={{ backgroundColor: "#17120D" }}>
        <Image
          src="/hvac/hero-comfort.webp"
          alt="Cool, fresh, comfortable home with climate under control on a hot day"
          fill
          priority
          className="hero-photo object-cover will-change-transform"
          sizes="100vw"
        />
        {/* Cinematic scrim — warm dark, heavier on the left where text lives */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(100deg, rgba(20,15,11,0.82) 0%, rgba(20,15,11,0.55) 38%, rgba(20,15,11,0.12) 68%, rgba(20,15,11,0.30) 100%)" }}
        />
        {/* Bottom fade for the data strip */}
        <div className="absolute bottom-0 left-0 right-0 h-64" style={{ background: "linear-gradient(to top, rgba(16,12,9,0.7) 0%, transparent 100%)" }} />
      </div>

      {/* ── Content ── */}
      <div className="hero-content relative z-20 w-full max-w-7xl mx-auto px-5 lg:px-8 pb-16 lg:pb-24 pt-32">
        {/* Eyebrow */}
        <div className="hero-badge flex items-center gap-2.5 mb-6">
          <MapPin size={15} style={{ color: "#7FD0E8" }} />
          <span className="font-data text-[12px] tracking-[0.14em] uppercase" style={{ color: "rgba(245,240,233,0.85)" }}>
            Serving {company.city} &amp; surrounding areas
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-heading font-semibold tracking-[-0.02em] max-w-4xl text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.98]" style={{ color: "#FBF7F1" }}>
          <span className="hero-title-1 block">Fast repairs, expert installs,</span>
          <span className="hero-title-2 block">
            year-round{" "}<span className="italic" style={{ color: "#FFB27A" }}>comfort</span>.
          </span>
        </h1>

        {/* Subhead */}
        <p className="hero-sub max-w-xl text-[1.08rem] leading-relaxed mt-6" style={{ color: "rgba(245,240,233,0.82)" }}>
          Licensed local technicians, same-day service, free estimates. We keep{" "}
          <span style={{ color: "#FBF7F1", fontWeight: 500 }}>{company.zone}</span> comfortable
          all year. Heating and cooling, done right.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3.5 mt-9">
          <a
            href={`tel:${company.phone}`}
            className="press inline-flex items-center justify-center gap-2.5 px-7 py-4 text-white text-[0.95rem] font-medium rounded-[var(--radius)] transition-all duration-300 shadow-card"
            style={{ backgroundColor: "var(--brand)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--brand-dim)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--brand)")}
          >
            <Phone size={17} />
            <span>Call now · {company.phone}</span>
          </a>
          <a
            href="#contact"
            className="press inline-flex items-center justify-center gap-2.5 px-7 py-4 text-[0.95rem] font-medium rounded-[var(--radius)] transition-all duration-300"
            style={{ color: "#FBF7F1", border: "1px solid rgba(245,240,233,0.35)", backdropFilter: "blur(2px)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(245,240,233,0.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            <span>Free estimate</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>

        {/* Trust strip */}
        <div className="hero-data-strip flex flex-wrap items-center gap-x-7 gap-y-3 mt-12 pt-7" style={{ borderTop: "1px solid rgba(245,240,233,0.18)" }}>
          <div className="flex items-center gap-2.5">
            <Snowflake size={16} style={{ color: "#7FD0E8" }} />
            <span className="text-sm font-medium" style={{ color: "#FBF7F1" }}>Cooling</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Flame size={16} style={{ color: "#FFB27A" }} />
            <span className="text-sm font-medium" style={{ color: "#FBF7F1" }}>Heating</span>
          </div>
          <div className="h-7 w-px hidden sm:block" style={{ backgroundColor: "rgba(245,240,233,0.22)" }} />
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-xl font-semibold tabular" style={{ color: "#FBF7F1" }}>15+</span>
            <span className="text-xs" style={{ color: "rgba(245,240,233,0.7)" }}>years local</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star size={15} fill="#FFC65A" style={{ color: "#FFC65A" }} />
            <span className="font-heading text-xl font-semibold tabular" style={{ color: "#FBF7F1" }}>4.9</span>
            <span className="text-xs" style={{ color: "rgba(245,240,233,0.7)" }}>500+ reviews</span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="font-data text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(245,240,233,0.6)" }}>Scroll</span>
        <span className="w-px h-9 block" style={{ background: "linear-gradient(to bottom, rgba(245,240,233,0.5), transparent)" }} />
      </div>
    </section>
  );
}

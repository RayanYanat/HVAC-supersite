"use client";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Phone, ArrowRight, Settings } from "lucide-react";
import ThermalCanvas from "@/components/shared/ThermalCanvas";
import { COMPANY } from "@/lib/constants";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null); // deep — slowest
  const layer2Ref = useRef<HTMLDivElement>(null); // mid
  const layer3Ref = useRef<HTMLDivElement>(null); // content — closest

  /* ── Entrance animation ─────────────────────────────── */
  /*
   * gsap.set() runs inside useGSAP which uses useLayoutEffect — it fires
   * synchronously BEFORE the browser paints. Elements are hidden before the
   * first frame, eliminating the 0.5s flash of visible content that gsap.from()
   * caused (from() sets initial state too late, after SSR HTML is already painted).
   */
  useGSAP(
    () => {
      // Set initial states before first paint
      gsap.set(".hero-badge",      { y: 24, opacity: 0 });
      gsap.set(".hero-title-1",    { y: 80, opacity: 0 });
      gsap.set(".hero-title-2",    { y: 80, opacity: 0 });
      gsap.set(".hero-title-3",    { y: 40, opacity: 0 });
      gsap.set(".hero-divider",    { scaleX: 0 });
      gsap.set(".hero-sub",        { y: 20, opacity: 0 });
      gsap.set(".hero-cta",        { y: 20, opacity: 0 });
      gsap.set(".hero-scroll",     { opacity: 0 });
      gsap.set(".hero-data-strip", { y: 20, opacity: 0 });
      gsap.set(".hero-frame",      { opacity: 0, scale: 0.94 });
      gsap.set(".hero-rightbar",   { opacity: 0, x: 16 });

      // Animate to final state
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".hero-badge",      { y: 0, opacity: 1, duration: 0.7 })
        .to(".hero-title-1",    { y: 0, opacity: 1, duration: 1.0 }, "-=0.2")
        .to(".hero-title-2",    { y: 0, opacity: 1, duration: 1.0 }, "-=0.75")
        .to(".hero-title-3",    { y: 0, opacity: 1, duration: 0.7 }, "-=0.6")
        .to(".hero-divider",    { scaleX: 1, duration: 1.0, ease: "expo.out" }, "-=0.5")
        .to(".hero-sub",        { y: 0, opacity: 1, duration: 0.6 }, "-=0.5")
        .to(".hero-cta",        { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 }, "-=0.3")
        .to(".hero-scroll",     { opacity: 1, duration: 0.8 }, "-=0.2")
        .to(".hero-data-strip", { y: 0, opacity: 1, duration: 0.6 }, "-=0.6")
        .to(".hero-frame",      { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }, "-=1.0")
        .to(".hero-rightbar",   { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, "-=0.8");
    },
    { scope: containerRef }
  );

  /* ── Mouse parallax ─────────────────────────────────── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      gsap.to(layer1Ref.current, { x: dx * -18, y: dy * -12, duration: 2, ease: "power2.out" });
      gsap.to(layer2Ref.current, { x: dx * -9,  y: dy * -6,  duration: 1.8, ease: "power2.out" });
      gsap.to(layer3Ref.current, { x: dx * 6,   y: dy * 4,   duration: 1.6, ease: "power2.out" });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden bg-[#0A0C0F]"
    >
      {/* ── Layer 1 : canvas + grid (deepest) ── */}
      <div ref={layer1Ref} className="absolute inset-0 will-change-transform">
        <ThermalCanvas />

        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,107,26,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,107,26,0.035) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* ── Layer 2 : atmospheric glows (mid) ── */}
      <div ref={layer2Ref} className="absolute inset-0 pointer-events-none will-change-transform">
        {/* Central deep glow — breathes slowly */}
        <div
          className="absolute bottom-[-10%] left-[48%] -translate-x-1/2 w-[900px] h-[700px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,107,26,0.28) 0%, rgba(196,66,10,0.12) 35%, transparent 70%)",
            animation: "breathe 6s ease-in-out infinite",
          }}
        />
        {/* Left heat column */}
        <div
          className="absolute bottom-0 left-[18%] w-[280px] h-[65%] opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at bottom, rgba(255,107,26,0.4) 0%, transparent 70%)",
            animation: "breathe 8s ease-in-out infinite 1s",
          }}
        />
        {/* Right heat column */}
        <div
          className="absolute bottom-0 right-[16%] w-[220px] h-[50%] opacity-15"
          style={{
            background:
              "radial-gradient(ellipse at bottom, rgba(255,133,52,0.35) 0%, transparent 70%)",
            animation: "breathe 7s ease-in-out infinite 2.5s",
          }}
        />

        {/* Vignette — corners darkened */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 40%, transparent 45%, rgba(10,12,15,0.85) 100%)",
          }}
        />

        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0A0C0F] to-transparent" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-[#0A0C0F] to-transparent" />
      </div>

      {/* Film grain now global via GlobalTexture — removed from hero */}

      {/* ── Thermal viewfinder frame — corner brackets (desktop only) ── */}
      <div className="absolute inset-5 pointer-events-none z-10 hidden lg:block">
        {/* Top-left */}
        <div
          className="hero-frame absolute top-0 left-0 w-10 h-10"
          style={{ borderTop: "1px solid rgba(255,107,26,0.35)", borderLeft: "1px solid rgba(255,107,26,0.35)" }}
        />
        {/* Top-right */}
        <div
          className="hero-frame absolute top-0 right-0 w-10 h-10"
          style={{ borderTop: "1px solid rgba(255,107,26,0.35)", borderRight: "1px solid rgba(255,107,26,0.35)" }}
        />
        {/* Bottom-left */}
        <div
          className="hero-frame absolute bottom-0 left-0 w-10 h-10"
          style={{ borderBottom: "1px solid rgba(255,107,26,0.35)", borderLeft: "1px solid rgba(255,107,26,0.35)" }}
        />
        {/* Bottom-right */}
        <div
          className="hero-frame absolute bottom-0 right-0 w-10 h-10"
          style={{ borderBottom: "1px solid rgba(255,107,26,0.35)", borderRight: "1px solid rgba(255,107,26,0.35)" }}
        />
      </div>

      {/* ── Layer 3 : content (closest) ── */}
      <div
        ref={layer3Ref}
        className="relative z-20 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-5 lg:px-8 pt-28 pb-24 will-change-transform"
      >
        {/* Badge */}
        <div className="hero-badge flex items-center gap-3 mb-10">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-brand opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
          </span>
          <span className="font-data text-[11px] text-brand/75 tracking-[0.28em] uppercase">
            NATE Certified &nbsp;·&nbsp; {COMPANY.zone} &nbsp;·&nbsp; 15+ Years of Experience
          </span>
        </div>

        {/* Title */}
        <div className="mb-8 overflow-hidden">
          <h1 className="hero-title-1 font-heading text-[clamp(4rem,11vw,10.5rem)] leading-[0.88] text-white font-extrabold">
            Fast, Reliable
          </h1>
          <h1 className="hero-title-2 font-heading text-[clamp(4rem,11vw,10.5rem)] leading-[0.88] text-brand font-extrabold text-glow-brand">
            HVAC Service
          </h1>
          <p className="hero-title-3 font-heading text-[clamp(1.6rem,4.5vw,4.2rem)] leading-[1.05] font-bold mt-3" style={{ color: "rgba(255,255,255,0.22)" }}>
            NATE-certified — same-day emergency response.
          </p>
        </div>

        {/* Divider */}
        <div className="hero-divider w-20 h-[2px] bg-brand origin-left mb-8" />

        {/* Subtitle */}
        <p className="hero-sub max-w-lg text-lg leading-relaxed mb-12" style={{ color: "rgba(255,255,255,0.42)" }}>
          From emergency breakdowns to full system installs —
          we keep{" "}
          <span className="font-medium" style={{ color: "rgba(255,255,255,0.72)" }}>{COMPANY.zone}</span>{" "}
          homes comfortable, year-round. Free estimate, no obligation.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-16">
          <a
            href={`tel:${COMPANY.phone}`}
            className="hero-cta group relative flex items-center gap-3 px-7 py-4 bg-brand text-white text-xs font-bold tracking-[0.18em] uppercase overflow-hidden transition-all duration-300 hover:bg-brand-dim glow-brand"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <Phone size={14} />
            <span>Emergency — Call Now</span>
          </a>

          <a
            href="#contact"
            className="hero-cta group flex items-center gap-3 px-7 py-4 border border-white/15 text-white/75 text-xs font-bold tracking-[0.18em] uppercase hover:border-brand hover:text-brand transition-all duration-300"
          >
            <span>Get a Free Estimate</span>
            <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
          </a>

          <a
            href="#services"
            className="hero-cta flex items-center gap-2.5 px-7 py-4 text-white/30 text-xs font-bold tracking-[0.18em] uppercase hover:text-white/60 transition-colors duration-300"
          >
            <Settings size={13} />
            <span>Our Services</span>
          </a>
        </div>

        {/* Data strip */}
        <div className="hero-data-strip flex flex-wrap gap-x-10 gap-y-3 border-t border-white/5 pt-7">
          {[
            ["15+", "Years of experience"],
            ["500+", "Customers served"],
            ["< 4h", "Response time"],
            ["98%", "Satisfaction rate"],
          ].map(([val, label]) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="font-data text-brand text-sm font-medium">{val}</span>
              <span className="font-data text-white/25 text-[11px] tracking-wider uppercase">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right-side thermal data bar (desktop only) ── */}
      <div className="hero-rightbar absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-end gap-0 z-20 pointer-events-none select-none">
        <span
          className="font-data text-[9px] tracking-[0.3em] uppercase mb-4"
          style={{ color: "rgba(255,107,26,0.4)", writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.3em" }}
        >
          THERMAL RANGE
        </span>
        <div className="flex flex-col items-center gap-0">
          {/* Scale ticks */}
          <span className="font-data text-[9px]" style={{ color: "rgba(255,107,26,0.55)" }}>104°F</span>
          <div className="flex items-center gap-1.5 my-1.5">
            <div className="w-2 h-px" style={{ backgroundColor: "rgba(255,107,26,0.3)" }} />
            <div className="w-px h-8" style={{ backgroundColor: "rgba(255,107,26,0.15)" }} />
          </div>
          <span className="font-data text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
          <div className="w-px h-8 my-1" style={{ backgroundColor: "rgba(255,107,26,0.12)" }} />
          <span className="font-data text-[9px]" style={{ color: "rgba(255,107,26,0.4)" }}>72°F</span>
          <div className="flex items-center gap-1.5 my-1.5">
            <div className="w-2 h-px" style={{ backgroundColor: "rgba(255,107,26,0.25)" }} />
            <div className="w-px h-8" style={{ backgroundColor: "rgba(255,107,26,0.1)" }} />
          </div>
          <span className="font-data text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>AMBIENT</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="font-data text-[9px] tracking-[0.35em] uppercase text-white/25">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}

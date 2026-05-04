"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { STATS } from "@/lib/constants";
import FloatingData from "@/components/shared/FloatingData";

const STATS_DATA = [
  { text: "COP: 4.2",      x: "4%",  y: "10%", delay: "0s",   duration: "10s", opacity: 0.09  },
  { text: "TEMP: 72.4°F",  x: "82%", y: "15%", delay: "4s",   duration: "12s", opacity: 0.08  },
  { text: "RH: 48.2%",     x: "55%", y: "82%", delay: "2s",   duration: "9s",  opacity: 0.07  },
  { text: "PSI: 14.7",     x: "7%",  y: "68%", delay: "6s",   duration: "11s", opacity: 0.06  },
  { text: "DELTA.T: 20°",  x: "70%", y: "45%", delay: "1s",   duration: "14s", opacity: 0.075 },
];

const BARS = [92, 78, 98, 85];

/* Transition zone — stats get cool steel tones */
const STAT_COLORS = ["#FF6B1A", "#38BDF8", "#38BDF8", "#94A3B8"];

const TICKER_ITEMS = [
  "Service Area: [City], TX",
  "[County]", "[Surrounding Cities]",
  "NATE Certified", "EPA 608 Licensed",
  "ACCA Member", "BBB Accredited",
  "Same-Day Response",
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  /*
   * "Boot sequence" — sequential stat activation, like a HVAC dashboard
   * powering up channels one by one.
   *
   * Header reveals via horizontal clip-path demask (left → right). Then
   * each stat fires its own boot phase, staggered by 0.35s:
   *
   *   1. Stat container fades up (0.4s)
   *   2. Counter animates 0 → final value (0.9s)         ← reading the dial
   *   3. Bar fills to its target percentage (0.55s)      ← AFTER counter completes
   *
   * The bar deliberately starts after the counter — never simultaneously —
   * so each stat reads as a discrete instrument coming online.
   *
   * Total cascade: ~3s for the full panel to be live.
   */
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      // Header: hidden + horizontally clipped (closed shutter)
      gsap.set(".stats-header", {
        opacity: 0,
        clipPath: "inset(0% 100% 0% 0%)",
      });
      // Stat items: subtle fade-up, animated per-stat in the boot loop below
      gsap.set(".stat-item", { opacity: 0, y: 18 });

      // Header demask trigger
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%", once: true,
        onEnter: () => {
          gsap.to(".stats-header", {
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.85,
            ease: "power3.out",
          });
        },
      });

      // Per-stat boot sequence
      STATS.forEach((stat, i) => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 78%", once: true,
          onEnter: () => {
            const itemEl = document.querySelectorAll<HTMLElement>(".stat-item")[i];
            const numEl  = document.querySelectorAll<HTMLElement>(".stat-num")[i];
            const barEl  = document.querySelectorAll<HTMLElement>(".stat-bar-fill")[i];

            const baseDelay = 0.55 + i * 0.35;   // sequential boot
            const counterDelay = baseDelay + 0.1;
            const counterDuration = 0.9;
            const barDelay = counterDelay + counterDuration; // strictly after

            if (itemEl) {
              gsap.to(itemEl, {
                opacity: 1, y: 0,
                duration: 0.4,
                ease: "power3.out",
                delay: baseDelay,
              });
            }

            if (numEl) {
              const obj = { v: 0 };
              gsap.to(obj, {
                v: stat.value,
                duration: counterDuration,
                ease: "power2.out",
                delay: counterDelay,
                onUpdate() {
                  numEl.textContent = Math.round(obj.v) + stat.suffix;
                },
              });
            }

            if (barEl) {
              gsap.to(barEl, {
                width: `${BARS[i]}%`,
                duration: 0.55,
                ease: "power2.out",
                delay: barDelay,
              });
            }
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="stats"
      className="relative section-padding overflow-hidden"
      style={{ backgroundColor: "rgba(10,12,15,0.83)" }}>

      <FloatingData points={STATS_DATA} />

      {/*
       * Bascule diagonale : la chaleur résiduelle vit en haut-gauche
       * (d'où l'on vient), le frais émerge en bas-droite (où l'on va).
       * La diagonale matérialise spatialement la transition thermique.
       */}
      {/* Warm residue — upper-left: heat carried over from sections above */}
      <div className="absolute -left-40 -top-32 w-[640px] h-[560px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,107,26,0.13) 0%, transparent 62%)",
          animation: "breathe 12s ease-in-out infinite",
        }} />
      {/* Cool emergence — lower-right: cold expanding toward Trust/Contact */}
      <div className="absolute -right-32 -bottom-32 w-[720px] h-[620px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(56,189,248,0.14) 0%, transparent 62%)",
          animation: "breathe 9s ease-in-out infinite reverse",
          animationDelay: "3s",
        }} />

      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(56,189,248,0.15), transparent)" }} />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="stats-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 lg:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              {/* Dual-color accent line — warm left, cold right */}
              <div className="w-10 h-px" style={{
                background: "linear-gradient(to right, #FF6B1A, #38BDF8)"
              }} />
              <span className="font-data text-[11px] tracking-[0.28em] uppercase"
                style={{ color: "rgba(56,189,248,0.7)" }}>
                By the Numbers
              </span>
            </div>
            <h2 className="font-heading text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.9] text-white font-extrabold">
              RESULTS THAT<br />
              <span style={{ color: "#38BDF8", textShadow: "0 0 40px rgba(56,189,248,0.35)" }}>
                SPEAK FOR THEMSELVES
              </span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed lg:text-right"
            style={{ color: "rgba(255,255,255,0.35)" }}>
            Real numbers, verifiable facts — because trust
            is built on transparency, not promises.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-16">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="stat-item">
              <div className="flex items-baseline gap-1 mb-3">
                <span className="stat-num font-heading text-[clamp(3.2rem,7vw,5rem)] leading-none font-extrabold"
                  style={{
                    color: STAT_COLORS[i],
                    textShadow: `0 0 40px ${STAT_COLORS[i]}55`,
                  }}>
                  0{stat.suffix}
                </span>
              </div>
              <p className="font-data text-[11px] tracking-[0.22em] uppercase mb-5"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                {stat.label}
              </p>
              <div className="w-full h-px relative overflow-hidden"
                style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
                <div className="stat-bar-fill h-full absolute left-0 top-0 transition-all"
                  style={{ width: "0%", backgroundColor: STAT_COLORS[i] }} />
              </div>
              <div className="mt-2 text-right">
                <span className="font-data text-[9px] tracking-wider"
                  style={{ color: "rgba(255,255,255,0.14)" }}>
                  {BARS[i]}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Ticker */}
        <div className="flex items-center gap-4 px-6 py-4"
          style={{ border: "1px solid rgba(56,189,248,0.08)", backgroundColor: "#090B0E" }}>
          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "#38BDF8" }} />
          <div className="flex flex-wrap gap-x-8 gap-y-1">
            {TICKER_ITEMS.map((item) => (
              <span key={item} className="font-data text-[11px] tracking-wider uppercase"
                style={{ color: "rgba(255,255,255,0.22)" }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

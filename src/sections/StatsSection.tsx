"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { STATS } from "@/lib/constants";
import type { CompanyData } from "@/lib/types";

/* Alternating hot/cold accent across the four metrics. */
const ACCENTS = ["var(--brand)", "var(--cool)", "var(--brand)", "var(--cool)"];

export default function StatsSection({ company }: { company: CompanyData }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.set(".stats-header", { opacity: 0, y: 20 });
      gsap.set(".stat-item", { opacity: 0, y: 22 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 82%", once: true,
        onEnter: () => {
          gsap.to(".stats-header", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
          gsap.to(".stat-item", { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: "power2.out", delay: 0.1 });

          STATS.forEach((stat, i) => {
            const numEl = document.querySelectorAll<HTMLElement>(".stat-num")[i];
            if (!numEl) return;
            const obj = { v: 0 };
            gsap.to(obj, {
              v: stat.value,
              duration: 1.1,
              ease: "power2.out",
              delay: 0.3 + i * 0.12,
              onUpdate() { numEl.textContent = Math.round(obj.v) + stat.suffix; },
            });
          });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="stats" className="relative section-padding bg-bone">
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="stats-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-12 lg:mb-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-7 h-px" style={{ backgroundColor: "var(--cool)" }} />
              <span className="font-data text-[12px] tracking-[0.12em] uppercase" style={{ color: "var(--cool)" }}>
                By the numbers
              </span>
            </div>
            <h2 className="font-heading text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05] font-semibold" style={{ color: "var(--foreground)" }}>
              Results that speak for themselves.
            </h2>
          </div>
          <p className="max-w-xs text-[0.98rem] leading-relaxed lg:text-right" style={{ color: "var(--text-muted)" }}>
            Real numbers across {company.zone}. Trust is built on
            transparency, not promises.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="stat-item" style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.25rem" }}>
              <div className="stat-num tabular font-heading text-[clamp(2.8rem,5vw,4rem)] leading-none font-semibold" style={{ color: ACCENTS[i] }}>
                0{stat.suffix}
              </div>
              <p className="text-[0.92rem] mt-3" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

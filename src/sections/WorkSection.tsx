"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { CompanyData } from "@/lib/types";

/*
 * Column map for 3-col desktop grid (6 items, rows assigned by CSS auto-placement):
 *   index: 0 → col 1 (row-span-2), 1 → col 2, 2 → col 3,
 *          3 → col 2,               4 → col 3, 5 → col 1 (row-span-2)
 */
const COL_MAP = [1, 2, 3, 2, 3, 1] as const;

export default function WorkSection({ company }: { company: CompanyData }) {
  /* ── Location label: city only (card tags stay compact) ────────── */
  const loc = company.city;

  const PROJECTS = [
    {
      id: 1,
      img: "/hvac/Gemini_Generated_Image_k3jcsok3jcsok3jc.webp",
      type: "Air Conditioning",
      title: "Residential Mini-Split Install",
      location: loc,
      color: "#38BDF8",
      size: "large",
    },
    {
      id: 2,
      img: "/hvac/Gemini_Generated_Image_u72k8uu72k8uu72k.webp",
      type: "Heating",
      title: "Furnace Replacement",
      location: loc,
      color: "#FF6B1A",
      size: "small",
    },
    {
      id: 3,
      img: "/hvac/Gemini_Generated_Image_d8mta1d8mta1d8mt.webp",
      type: "Ventilation",
      title: "Commercial Duct System",
      location: loc,
      color: "#0EA5E9",
      size: "small",
    },
    {
      id: 4,
      img: "/hvac/Gemini_Generated_Image_wg48zewg48zewg48.webp",
      type: "Maintenance",
      title: "Annual Service Plan",
      location: loc,
      color: "#94A3B8",
      size: "small",
    },
    {
      id: 5,
      img: "/hvac/Gemini_Generated_Image_dw1vrydw1vrydw1v.webp",
      type: "Air Conditioning",
      title: "Commercial Rooftop Units",
      location: loc,
      color: "#38BDF8",
      size: "small",
    },
    {
      id: 6,
      img: "/hvac/Gemini_Generated_Image_rq2gcerq2gcerq2g.webp",
      type: "Heating",
      title: "Heat Pump Installation",
      location: loc,
      color: "#FF6B1A",
      size: "large",
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      /*
       * Must register inside useGSAP (useLayoutEffect) — NOT at module level.
       * Module-level code in "use client" components runs during Next.js SSR
       * where browser APIs don't exist, crashing the server build.
       */
      gsap.registerPlugin(ScrollTrigger);

      /* ── Entrance: scan-reveal + header ──────────────────────────── */
      gsap.set(".work-header", { opacity: 0, y: 30 });
      gsap.set(".work-card", {
        opacity: 0,
        clipPath: "inset(0% 100% 0% 0%)",
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(".work-header", {
            opacity: 1, y: 0,
            duration: 0.7, ease: "power3.out",
          });

          const isDesktop = window.innerWidth >= 1024;

          if (isDesktop) {
            gsap.to(".work-card", {
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.85,
              ease: "power3.out",
              delay: 0.25,
              stagger: (i) => (COL_MAP[i] - 1) * 0.18,
            });
          } else {
            gsap.to(".work-card", {
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.7,
              stagger: 0.10,
              ease: "power3.out",
              delay: 0.2,
            });
          }
        },
      });

      /* ── Scroll-linked column parallax (desktop only) ─────────────
       *
       * Column 1 (col-1): starts 50 px lower, ends 50 px higher  → moves UP
       * Column 3 (col-3): starts 35 px higher, ends 35 px lower  → moves DOWN
       * Column 2: stationary reference
       *
       * scrub: 1.5  →  slight lag behind scroll for a "weight" feel.
       * Only activates on desktop (≥1024 px) because the grid collapses to
       * 1-2 columns on smaller screens where the effect has no visual basis.
       * ─────────────────────────────────────────────────────────────── */
      if (window.innerWidth >= 1024) {
        const col1 = sectionRef.current!.querySelectorAll<HTMLElement>("[data-col='1']");
        const col3 = sectionRef.current!.querySelectorAll<HTMLElement>("[data-col='3']");

        const tlPara = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        tlPara
          .fromTo(col1, { y: 50  }, { y: -50, ease: "none" }, 0)
          .fromTo(col3, { y: -35 }, { y: 35,  ease: "none" }, 0);
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative section-padding overflow-hidden"
      style={{ backgroundColor: "rgba(28,21,16,1.0)" }}
    >
      {/* Top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(56,189,248,0.2), transparent)" }}
      />

      {/* Animated ambient blobs */}
      <div
        className="absolute -left-40 top-1/3 w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,107,26,0.085) 0%, transparent 60%)",
          animation: "breathe 13s ease-in-out infinite",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute -right-32 bottom-1/4 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(56,189,248,0.085) 0%, transparent 60%)",
          animation: "breathe 10s ease-in-out infinite reverse",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="work-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px" style={{ backgroundColor: "#38BDF8" }} />
              <span
                className="font-data text-[11px] tracking-[0.28em] uppercase"
                style={{ color: "rgba(56,189,248,0.75)" }}
              >
                Our Work
              </span>
            </div>
            <h2 className="font-heading text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.9] text-white font-extrabold">
              BUILT RIGHT,<br />
              <span style={{ color: "#38BDF8", textShadow: "0 0 40px rgba(56,189,248,0.35)" }}>
                EVERY TIME
              </span>
            </h2>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-3">
            <p
              className="max-w-xs text-sm leading-relaxed lg:text-right"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              A selection of recent installations and service calls across{" "}
              <span style={{ color: "rgba(255,255,255,0.6)" }}>{company.zone}</span>.
            </p>
            <a
              href="#contact"
              className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-200"
              style={{ color: "rgba(56,189,248,0.65)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#38BDF8")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(56,189,248,0.65)")}
            >
              <span>Start your project</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* Photo grid — asymmetric 3-column with column parallax data attrs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[280px]">
          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              data-col={COL_MAP[i]}
              className={`work-card group relative overflow-hidden cursor-pointer ${
                project.size === "large" ? "lg:row-span-2" : ""
              }`}
              style={{ border: "1px solid rgba(255,255,255,0.05)" }}
            >
              {/* Photo */}
              <Image
                src={project.img}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Base overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(to top, rgba(28,21,16,0.92) 0%, rgba(28,21,16,0.45) 50%, rgba(28,21,16,0.15) 100%)",
                }}
              />

              {/* Hover overlay — color-tinted */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to top, ${project.color}30 0%, transparent 60%)`,
                }}
              />

              {/* Top tag */}
              <div className="absolute top-4 left-4">
                <span
                  className="font-data text-[9px] tracking-[0.25em] uppercase px-2.5 py-1"
                  style={{
                    color: project.color,
                    border: `1px solid ${project.color}50`,
                    backgroundColor: "rgba(28,21,16,0.65)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {project.type}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                <h3 className="font-heading text-lg font-bold text-white leading-tight mb-1">
                  {project.title}
                </h3>
                <p
                  className="font-data text-[10px] tracking-wider uppercase"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {project.location}
                </p>

                {/* CTA — visible on hover */}
                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  <div className="w-5 h-px" style={{ backgroundColor: project.color }} />
                  <span
                    className="font-data text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: project.color }}
                  >
                    View project
                  </span>
                </div>
              </div>

              {/* Corner arrow */}
              <div
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0"
                style={{ backgroundColor: "rgba(28,21,16,0.7)", backdropFilter: "blur(6px)" }}
              >
                <ArrowUpRight size={14} style={{ color: project.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div
          className="mt-8 flex items-center justify-between gap-4 px-6 py-5"
          style={{ border: "1px solid rgba(56,189,248,0.08)", backgroundColor: "#0E0B09" }}
        >
          <p
            className="font-data text-[11px] tracking-wider uppercase"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            180+ projects completed across {company.zone}
          </p>
          <a
            href="#contact"
            className="flex items-center gap-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-opacity duration-200 flex-shrink-0"
            style={{ color: "#38BDF8" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            <span>Get a Free Estimate</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80",
    type: "Air Conditioning",
    title: "Residential Mini-Split Install",
    location: "[City], TX",
    color: "#38BDF8",
    size: "large", // spans 2 rows
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    type: "Heating",
    title: "Furnace Replacement",
    location: "[City], TX",
    color: "#FF6B1A",
    size: "small",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80",
    type: "Ventilation",
    title: "Commercial Duct System",
    location: "[City], TX",
    color: "#0EA5E9",
    size: "small",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=900&q=80",
    type: "Maintenance",
    title: "Annual Service Plan",
    location: "[City], TX",
    color: "#94A3B8",
    size: "small",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=80",
    type: "Air Conditioning",
    title: "Commercial Rooftop Units",
    location: "[City], TX",
    color: "#38BDF8",
    size: "small",
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80",
    type: "Heating",
    title: "Heat Pump Installation",
    location: "[City], TX",
    color: "#FF6B1A",
    size: "large",
  },
];

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);

  /*
   * "Scan et révélation" — left-to-right clipPath reveal, column-staggered.
   *
   * Cards reveal via inset clip-path animating right edge from 100% → 0%.
   * On desktop (≥1024px) the stagger is by GRID COLUMN, not by index —
   * so the entire column 1 reveals first, then column 2, then column 3,
   * mimicking a horizontal scan across the project portfolio.
   *
   * 3-col grid layout with size:large at indices 0 and 5 (row-span-2):
   *   index → column: [1, 2, 3, 2, 3, 1]
   *
   * On smaller viewports the grid collapses to 1 or 2 cols, so a
   * sequential index-based stagger feels more natural there.
   */
  useGSAP(
    () => {
      gsap.set(".work-header", { opacity: 0, y: 30 });
      gsap.set(".work-card", {
        opacity: 0,
        clipPath: "inset(0% 100% 0% 0%)",
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%", once: true,
        onEnter: () => {
          gsap.to(".work-header", {
            opacity: 1, y: 0,
            duration: 0.7, ease: "power3.out",
          });

          const isDesktop = window.innerWidth >= 1024;

          if (isDesktop) {
            // Column-based scan: col-1 → col-2 → col-3
            const colMap = [1, 2, 3, 2, 3, 1];
            gsap.to(".work-card", {
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.85,
              ease: "power3.out",
              delay: 0.25,
              stagger: (i) => (colMap[i] - 1) * 0.18,
            });
          } else {
            // Sequential reveal on tablet/mobile
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
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative section-padding overflow-hidden"
      style={{ backgroundColor: "rgba(13,15,18,0.85)" }}
    >
      {/* Top edge */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(56,189,248,0.2), transparent)" }} />

      {/* Animated ambient blobs */}
      <div className="absolute -left-40 top-1/3 w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,107,26,0.085) 0%, transparent 60%)",
          animation: "breathe 13s ease-in-out infinite",
          animationDelay: "2s",
        }} />
      <div className="absolute -right-32 bottom-1/4 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(56,189,248,0.085) 0%, transparent 60%)",
          animation: "breathe 10s ease-in-out infinite reverse",
        }} />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="work-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px" style={{ backgroundColor: "#38BDF8" }} />
              <span className="font-data text-[11px] tracking-[0.28em] uppercase"
                style={{ color: "rgba(56,189,248,0.75)" }}>
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
            <p className="max-w-xs text-sm leading-relaxed lg:text-right"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              A selection of recent installations and service calls
              across {" "}
              <span style={{ color: "rgba(255,255,255,0.6)" }}>[City] &amp; surrounding areas, TX</span>.
            </p>
            <a href="#contact"
              className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-200"
              style={{ color: "rgba(56,189,248,0.65)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#38BDF8")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(56,189,248,0.65)")}>
              <span>Start your project</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* Photo grid — asymmetric 3-column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[280px]">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
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

              {/* Base overlay — dark gradient from bottom */}
              <div className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,12,15,0.92) 0%, rgba(10,12,15,0.45) 50%, rgba(10,12,15,0.15) 100%)",
                }} />

              {/* Hover overlay — color-tinted */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to top, ${project.color}30 0%, transparent 60%)`,
                }} />

              {/* Top tag */}
              <div className="absolute top-4 left-4">
                <span className="font-data text-[9px] tracking-[0.25em] uppercase px-2.5 py-1"
                  style={{
                    color: project.color,
                    border: `1px solid ${project.color}50`,
                    backgroundColor: "rgba(10,12,15,0.65)",
                    backdropFilter: "blur(6px)",
                  }}>
                  {project.type}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                <h3 className="font-heading text-lg font-bold text-white leading-tight mb-1">
                  {project.title}
                </h3>
                <p className="font-data text-[10px] tracking-wider uppercase"
                  style={{ color: "rgba(255,255,255,0.35)" }}>
                  {project.location}
                </p>

                {/* CTA — visible on hover */}
                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  <div className="w-5 h-px" style={{ backgroundColor: project.color }} />
                  <span className="font-data text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: project.color }}>
                    View project
                  </span>
                </div>
              </div>

              {/* Corner arrow */}
              <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0"
                style={{ backgroundColor: "rgba(10,12,15,0.7)", backdropFilter: "blur(6px)" }}>
                <ArrowUpRight size={14} style={{ color: project.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-8 flex items-center justify-between gap-4 px-6 py-5"
          style={{ border: "1px solid rgba(56,189,248,0.08)", backgroundColor: "#090B0E" }}>
          <p className="font-data text-[11px] tracking-wider uppercase"
            style={{ color: "rgba(255,255,255,0.25)" }}>
            [XX]+ projects completed across [Zone], TX
          </p>
          <a href="#contact"
            className="flex items-center gap-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-200 flex-shrink-0"
            style={{ color: "#38BDF8" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}>
            <span>Get a Free Estimate</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowLeftRight, Check, ArrowRight } from "lucide-react";
import type { CompanyData } from "@/lib/types";

/* Comfort outcomes shown on the "after" side — the credible install image
   carries the comfort message via these captions. */
const OUTCOMES = ["Even heat in every room", "Up to 40% lower bills", "Whisper-quiet operation"];

export default function WorkSection({ company }: { company: CompanyData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = viewerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.set(".work-header", { opacity: 0, y: 24 });
      gsap.set(".work-viewer", { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%", once: true,
        onEnter: () => {
          gsap.to(".work-header", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
          gsap.to(".work-viewer", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.1 });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="work" className="relative section-padding" style={{ backgroundColor: "var(--surface-warm)" }}>
      <div className="relative max-w-6xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="work-header max-w-2xl mb-12">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-7 h-px" style={{ backgroundColor: "var(--cool)" }} />
            <span className="font-data text-[12px] tracking-[0.12em] uppercase" style={{ color: "var(--cool)" }}>
              Proof, not promises
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05] font-semibold" style={{ color: "var(--foreground)" }}>
            See the difference for yourself.
          </h2>
          <p className="text-[1.05rem] leading-relaxed mt-4" style={{ color: "var(--text-muted)" }}>
            A real installation from a customer&apos;s home in {company.city}. Drag the handle —
            old, struggling equipment on one side, our finished work on the other.
          </p>
        </div>

        {/* Before / after viewer */}
        <div className="work-viewer">
          <div
            ref={viewerRef}
            className="relative w-full aspect-[16/10] rounded-[1.1rem] overflow-hidden shadow-card select-none"
            style={{ cursor: "ew-resize", touchAction: "none", border: "1px solid var(--border-subtle)" }}
            onPointerDown={(e) => { dragging.current = true; setFromClientX(e.clientX); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }}
            onPointerMove={(e) => { if (dragging.current) setFromClientX(e.clientX); }}
            onPointerUp={() => { dragging.current = false; }}
          >
            {/* After (full, underneath) */}
            <Image src="/hvac/proof-after.webp" alt="After — clean new installation" fill className="object-cover pointer-events-none" sizes="(max-width: 1024px) 100vw, 1100px" />

            {/* Before (clipped overlay) */}
            <div className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <Image src="/hvac/proof-before.webp" alt="Before — old, failing equipment" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 1100px" />
            </div>

            {/* Labels */}
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[0.78rem] font-medium pointer-events-none" style={{ backgroundColor: "rgba(28,26,23,0.72)", color: "#EDE7DE" }}>
              Before
            </span>
            <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-[0.78rem] font-medium pointer-events-none" style={{ backgroundColor: "var(--brand)", color: "#fff" }}>
              After
            </span>

            {/* Outcome chips on the after side */}
            <div className="absolute left-0 right-4 bottom-4 flex flex-col items-end gap-2 pointer-events-none">
              {OUTCOMES.map((o) => (
                <span key={o} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.8rem] font-medium" style={{ backgroundColor: "var(--surface)", color: "var(--foreground)" }}>
                  <Check size={14} style={{ color: "var(--brand)" }} />
                  {o}
                </span>
              ))}
            </div>

            {/* Handle */}
            <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${pos}%`, width: 2, backgroundColor: "#FAF7F2", transform: "translateX(-1px)" }}>
              <div className="absolute top-1/2 left-1/2 flex items-center justify-center rounded-full shadow-soft" style={{ width: 44, height: 44, transform: "translate(-50%,-50%)", backgroundColor: "#FAF7F2", color: "var(--foreground)" }}>
                <ArrowLeftRight size={19} />
              </div>
            </div>
          </div>

          {/* Below: hint + CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-[0.92rem]" style={{ color: "var(--text-muted)" }}>
              180+ installations completed across {company.zone}.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-white text-[0.92rem] font-medium rounded-[var(--radius)] transition-all duration-300 shadow-soft"
              style={{ backgroundColor: "var(--brand)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--brand-dim)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--brand)")}
            >
              Book your free visit
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

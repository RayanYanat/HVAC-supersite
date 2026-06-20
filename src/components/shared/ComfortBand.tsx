"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CompanyData } from "@/lib/types";

/**
 * Full-bleed parallax image band — a cinematic breathing moment between
 * sections. The image drifts slower than the page (parallax), an editorial
 * pull-quote sits over a warm cinematic scrim.
 */
export default function ComfortBand({ company }: { company: CompanyData }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(".band-quote", { opacity: 0, y: 28 });

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 80%", once: true,
        onEnter: () => gsap.to(".band-quote", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }),
      });

      if (!reduce) {
        gsap.fromTo(
          ".band-photo",
          { yPercent: -12 },
          {
            yPercent: 12, ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      }
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative overflow-hidden h-[62vh] min-h-[460px] flex items-center">
      <div className="absolute inset-0">
        <Image
          src="/hvac/comfort-band.webp"
          alt="A serene, comfortable home with a wall-mounted unit at golden hour"
          fill
          className="band-photo object-cover scale-[1.18] will-change-transform"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(18,13,9,0.78) 0%, rgba(18,13,9,0.5) 45%, rgba(18,13,9,0.25) 100%)" }} />
      </div>

      <div className="band-quote relative z-10 max-w-4xl mx-auto px-5 lg:px-8 w-full">
        <p className="font-heading font-medium text-[clamp(1.8rem,4vw,3.4rem)] leading-[1.12]" style={{ color: "#FBF7F1" }}>
          &ldquo;Warm when it&apos;s freezing, cool when it&apos;s blazing. That&apos;s the whole job,
          and we do it <span className="italic" style={{ color: "#FFB27A" }}>right</span>.&rdquo;
        </p>
        <p className="font-data text-[12px] tracking-[0.14em] uppercase mt-6" style={{ color: "rgba(245,240,233,0.7)" }}>
          {company.name}, serving {company.city}
        </p>
      </div>
    </section>
  );
}

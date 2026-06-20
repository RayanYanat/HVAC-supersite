"use client";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Global GSAP + smooth-scroll configuration — mounts once, no DOM output.
 *
 * Lenis drives a buttery momentum scroll and is wired into GSAP's ticker so
 * ScrollTrigger stays in perfect sync (no jitter between smooth scroll and
 * scroll-linked animations). Disabled entirely under prefers-reduced-motion.
 *
 * Everything lives inside useEffect (browser-only) — module-level GSAP/Lenis
 * calls crash Next static generation since "use client" code still runs on
 * the server during SSR.
 */
export default function GSAPConfig() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    /* ── Lenis smooth scroll ─────────────────────────────────────────── */
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    /* Smooth anchor navigation, offset for the fixed navbar. */
    const navOffset = window.innerWidth >= 1024 ? -88 : -72;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;
      if (href === "#") {
        e.preventDefault();
        lenis.scrollTo(0);
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: navOffset });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}

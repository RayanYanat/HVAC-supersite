"use client";
import { useEffect, useRef } from "react";

/**
 * Thermal crosshair cursor — desktop only (pointer: fine).
 *
 * Two-layer design:
 *   • Dot  — 4 px solid brand, follows cursor with no lag (transform on rAF)
 *   • Ring — 28 px thin bracket, follows with 0.10 lerp lag for "weight" feel
 *
 * Interactive elements (a, button, [role=button]) trigger an expand state:
 *   ring grows to 44 px + brightens. Uses event delegation so dynamically
 *   rendered React elements are always covered without re-registering listeners.
 *
 * cursor: none is set on <html> (not body) so it applies inside iframes too.
 * Removed on cleanup to not bleed into other pages.
 */
export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only activate for fine-pointer devices (mouse / trackpad, not touch).
    // Elements are rendered at opacity:0 — reveal them here before starting
    // the loop so touch devices never see the ring sitting at (0,0).
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (dotRef.current)  dotRef.current.style.opacity  = "1";
    if (ringRef.current) ringRef.current.style.opacity = "1";

    const root = document.documentElement;
    root.style.cursor = "none";

    let mouseX = -200, mouseY = -200; // off-screen until first move
    let ringX  = -200, ringY  = -200;
    let hovering = false;
    let rafId: number;

    /* ── Move handler — dot tracks exactly ─────────────────── */
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    /* ── rAF loop — ring lerps toward cursor ────────────────── */
    const tick = () => {
      const lerp = hovering ? 0.14 : 0.10;
      ringX += (mouseX - ringX) * lerp;
      ringY += (mouseY - ringY) * lerp;

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    /* ── Hover detection via event delegation ───────────────── */
    const SELECTOR = "a, button, [role=button], label, input, textarea, select";

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(SELECTOR)) {
        hovering = true;
        if (ringRef.current) {
          ringRef.current.style.width        = "44px";
          ringRef.current.style.height       = "44px";
          ringRef.current.style.borderColor  = "rgba(255,107,26,0.75)";
          ringRef.current.style.boxShadow    =
            "0 0 16px rgba(255,107,26,0.25), inset 0 0 6px rgba(255,107,26,0.06)";
        }
        if (dotRef.current) {
          dotRef.current.style.backgroundColor = "rgba(255,107,26,0.5)";
          dotRef.current.style.width  = "8px";
          dotRef.current.style.height = "8px";
        }
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(SELECTOR)) {
        hovering = false;
        if (ringRef.current) {
          ringRef.current.style.width        = "28px";
          ringRef.current.style.height       = "28px";
          ringRef.current.style.borderColor  = "rgba(255,107,26,0.35)";
          ringRef.current.style.boxShadow    =
            "0 0 8px rgba(255,107,26,0.10)";
        }
        if (dotRef.current) {
          dotRef.current.style.backgroundColor = "#FF6B1A";
          dotRef.current.style.width  = "4px";
          dotRef.current.style.height = "4px";
        }
      }
    };

    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout",  onOut,  { passive: true });

    /* ── Hide cursor when it leaves the window ──────────────── */
    const onLeave = () => {
      mouseX = -200;
      mouseY = -200;
    };
    document.addEventListener("mouseleave", onLeave);

    return () => {
      root.style.cursor = "";
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      {/* Dot — exact position, no lag */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width:           "4px",
          height:          "4px",
          backgroundColor: "#FF6B1A",
          borderRadius:    "50%",
          opacity:         0,           /* revealed in useEffect on pointer:fine only */
          willChange:      "transform",
          transition:      "width 0.15s, height 0.15s, background-color 0.15s",
        }}
      />

      {/* Ring — lagged, bracket feel with slight squareness */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width:        "28px",
          height:       "28px",
          border:       "1px solid rgba(255,107,26,0.35)",
          borderRadius: "3px",   /* slight squareness — tactical / thermal feel */
          opacity:      0,       /* revealed in useEffect on pointer:fine only */
          willChange:   "transform",
          transition:
            "width 0.25s ease, height 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          boxShadow: "0 0 8px rgba(255,107,26,0.10)",
        }}
      />
    </>
  );
}

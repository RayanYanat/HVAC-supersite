"use client";

import { useEffect, useState } from "react";

/**
 * ConceptBanner — shown ONLY on personalized drafts (the [slug] route).
 *
 * Frames the page as a DRAFT design direction so the templated visuals read
 * as intentional ("a concept made for you"), not as a generic template — and
 * pre-answers the "you made it for me, so where's my logo / my services?"
 * reaction: what they're seeing is the design; their content lands in the
 * final build.
 *
 * UX rules:
 *  - Appears AFTER the hero has had its moment (delay), so the wow is intact.
 *  - Anchored to the bottom, never overlaps the hero.
 *  - Subtle, on-palette (dark / thermal orange), dismissible. Respects reduced-motion.
 */
export default function ConceptBanner({ name }: { name: string }) {
  const [shown, setShown] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setShown(true), reduce ? 600 : 3000); // let the hero land first
    return () => clearTimeout(t);
  }, []);

  if (closed) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 flex justify-center sm:inset-x-0 sm:bottom-5 pointer-events-none">
      <div
        className="pointer-events-auto w-full sm:w-auto sm:max-w-lg"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0)" : "translateY(125%)",
          transition: "opacity 700ms ease, transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          className="relative flex items-start gap-3 rounded-xl border px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderColor: "rgba(28,26,23,0.10)",
            boxShadow: "0 18px 48px -16px rgba(28,26,23,0.28)",
          }}
        >
          <span
            className="mt-[6px] h-2 w-2 shrink-0 rounded-[3px]"
            style={{ background: "linear-gradient(135deg, #C8511F 50%, #2B6E8F 50%)" }}
            aria-hidden
          />

          <div className="min-w-0">
            <p
              className="font-medium uppercase"
              style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#C8511F" }}
            >
              A design draft · for {name}
            </p>
            <p className="mt-1 leading-snug" style={{ fontSize: "12.5px", color: "rgba(28,26,23,0.78)" }}>
              Fully mobile-ready. Your services, branding and photos come in the final build.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setClosed(true)}
            aria-label="Dismiss"
            className="-mr-1 -mt-1 ml-1 shrink-0 rounded p-1 text-base leading-none transition-opacity hover:opacity-60"
            style={{ color: "#9A9286" }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

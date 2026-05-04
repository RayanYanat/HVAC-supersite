/*
 * ThermalNarrative — Continuous ambient-temperature gradient behind all sections.
 *
 * Rendered as an absolute layer inside <main>, spanning the full document
 * height. Section backgrounds (rgba ~0.84) let this gradient subtly tint
 * each section's atmosphere based on scroll depth, creating a felt — not
 * seen — descent from "Texas heat" (top) to "cool comfort" (bottom).
 *
 * Calibration vs page narrative:
 *   0–38%   warm orange   — Hero / Services / start of Work
 *   49–51%  transparent   — bascule (ThermalDivider/Stats midpoint)
 *   58–100% cool cyan     — Trust / Contact / Footer
 *
 * The transparent gap at 49–51% prevents linear-interp between #FF6B1A
 * and #38BDF8 from producing muddy brown-gray intermediates. Warm fades
 * to alpha 0, then cool emerges from alpha 0 — a clean handover.
 *
 * Alpha caps at 0.11 — well below conscious perception. Through a section
 * at 0.84 background opacity, the felt color contribution is ~1.8% per
 * pixel, which the eye integrates over scroll distance into a temperature
 * sensation rather than a visible gradient.
 *
 * Layer placement:
 *   body solid black
 *   AmbientCanvas (fixed, z=0 root)
 *   main (relative, z=1 root — own stacking context)
 *     ThermalNarrative (absolute inset, z=0 inside main)  ← THIS
 *     <sections> (in flow, default z, painted above narrative)
 *   GlobalTexture grain (fixed, z=9000+ root)
 */
export default function ThermalNarrative() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        background:
          "linear-gradient(180deg," +
          " rgba(255,107,26,0.110) 0%,"  +
          " rgba(255,107,26,0.090) 12%," +
          " rgba(255,107,26,0.060) 26%," +
          " rgba(255,107,26,0.025) 40%," +
          " rgba(255,107,26,0.000) 49%," +
          " rgba(56,189,248,0.000) 51%," +
          " rgba(56,189,248,0.025) 60%," +
          " rgba(56,189,248,0.060) 74%," +
          " rgba(56,189,248,0.090) 88%," +
          " rgba(56,189,248,0.110) 100%)",
      }}
    />
  );
}

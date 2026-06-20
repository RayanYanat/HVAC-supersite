import { Phone, ArrowRight } from "lucide-react";
import type { CompanyData } from "@/lib/types";

/**
 * Full-width deep-ink CTA band — the one dramatic dark moment in an otherwise
 * light page. Warm charcoal (never cold blue-black) so it punctuates rather
 * than clashes. Sits just before the footer.
 */
export default function CTABand({ company }: { company: CompanyData }) {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#1B1714" }}>
      {/* hot/cold hairline */}
      <div className="h-[3px]" style={{ background: "linear-gradient(to right, #E2611E 0%, #E2611E 50%, #38A0C4 50%, #38A0C4 100%)" }} />

      {/* soft ember glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(226,97,30,0.16) 0%, transparent 65%)" }}
      />

      <div className="relative max-w-5xl mx-auto px-5 lg:px-8 py-20 lg:py-28 text-center">
        <span className="font-data text-[12px] tracking-[0.14em] uppercase" style={{ color: "#FFB27A" }}>
          Comfort is one call away
        </span>
        <h2 className="font-heading font-semibold tracking-[-0.02em] mt-5 text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[1.02]" style={{ color: "#FBF7F1" }}>
          Ready to feel comfortable again?
        </h2>
        <p className="max-w-xl mx-auto text-[1.08rem] leading-relaxed mt-5" style={{ color: "rgba(245,240,233,0.7)" }}>
          Same-day service, upfront pricing, and a free estimate. No pressure.
          We keep {company.zone} comfortable, all year round.
        </p>

        <div className="flex flex-col sm:flex-row gap-3.5 justify-center mt-9">
          <a
            href={`tel:${company.phone}`}
            className="press inline-flex items-center justify-center gap-2.5 px-8 py-4 text-white text-[0.95rem] font-medium rounded-[var(--radius)] transition-colors duration-300 shadow-card hover:brightness-110"
            style={{ backgroundColor: "var(--brand)" }}
          >
            <Phone size={17} />
            <span>Call now · {company.phone}</span>
          </a>
          <a
            href="#contact"
            className="press inline-flex items-center justify-center gap-2.5 px-8 py-4 text-[0.95rem] font-medium rounded-[var(--radius)] transition-colors duration-300 hover:bg-[rgba(245,240,233,0.08)]"
            style={{ color: "#FBF7F1", border: "1px solid rgba(245,240,233,0.35)" }}
          >
            <span>Get a free estimate</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

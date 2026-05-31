"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ShieldCheck, Clock, Award, ThumbsUp, Star } from "lucide-react";
import type { CompanyData } from "@/lib/types";
import FloatingData from "@/components/shared/FloatingData";

const TRUST_DATA = [
  { text: "CERT.TECH",      x: "3%",  y: "8%",  delay: "0s",   duration: "11s", opacity: 0.085 },
  { text: "VERIFIED: YES",  x: "80%", y: "12%", delay: "3.5s", duration: "9s",  opacity: 0.07  },
  { text: "LIC.INSURED",    x: "6%",  y: "60%", delay: "1.5s", duration: "13s", opacity: 0.075 },
  { text: "RATING: 5.0",    x: "72%", y: "78%", delay: "5s",   duration: "10s", opacity: 0.065 },
  { text: "SAT: 98.2%",     x: "45%", y: "90%", delay: "2.5s", duration: "12s", opacity: 0.08  },
];

const CERTIFICATIONS = [
  { label: "CERT", sub: "Certified Technicians" },
  { label: "LIC",  sub: "Fully Licensed" },
  { label: "INS",  sub: "Fully Insured" },
  { label: "5★",   sub: "Top Rated" },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12}
          className={i < count ? "text-[#FBBF24] fill-[#FBBF24]" : "text-white/15"} />
      ))}
    </div>
  );
}

export default function TrustSection({ company }: { company: CompanyData }) {
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Review location: city only (fits the compact review card) ─── */
  const loc = company.city;

  /* REASONS references company.zone → defined inside component */
  const REASONS = [
    { icon: ShieldCheck, text: "Certified & fully licensed technicians — the highest industry standard" },
    { icon: Clock,       text: `Guaranteed response within 4 hours across ${company.zone}` },
    { icon: Award,       text: "15+ years of HVAC expertise — residential & commercial" },
    { icon: ThumbsUp,    text: "98% customer satisfaction — verified Google reviews" },
  ];

  /* REVIEWS — realistic names + city derived from zone */
  const REVIEWS = [
    {
      name: "Marcus T.",
      location: loc,
      rating: 5,
      date: "2 weeks ago",
      text: "Fast, professional, and honest. They diagnosed the issue in minutes and had everything fixed the same day. Highly recommend.",
      service: "Furnace Repair",
    },
    {
      name: "Sarah K.",
      location: loc,
      rating: 5,
      date: "1 month ago",
      text: "Got a new mini-split installed before summer hit. Clean work, great pricing, and they handled all the permits. Will use again.",
      service: "AC Installation",
    },
    {
      name: "James R.",
      location: loc,
      rating: 5,
      date: "3 months ago",
      text: "On a maintenance plan for 2 years now. Always on time, always thorough. Best HVAC company in the area, no question.",
      service: "Annual Maintenance Plan",
    },
  ];

  /*
   * "Vérification système" — system-check activation cascade.
   *
   * Each reason is preceded by an ICON FLASH: scale 0.4 → 1.25 (overshoot
   * pop) → 1.0 (settle with back-out). The flash fires fractionally before
   * its line of text appears, like a status LED lighting up before the
   * label confirms the check.
   *
   * After the 4 reasons cascade (0.2s stagger), the certification badges
   * (NATE / EPA / ACCA / BBB) light up left-to-right with a back-out pop
   * — they read as validation indicators clicking on one after the other.
   *
   * Reviews fade up in parallel with the certs to fill the right column
   * without competing for attention with the verification cascade.
   */
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.set(".trust-header", { opacity: 0 });
      gsap.set(".trust-reason", { opacity: 0, y: 12 });
      gsap.set(".trust-icon",   { opacity: 0, scale: 0.4, transformOrigin: "center center" });
      gsap.set(".cert-badge",   { opacity: 0, scale: 0.85, transformOrigin: "center center" });
      gsap.set(".review-card",  { opacity: 0, y: 30 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%", once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          tl.to(".trust-header", {
            opacity: 1,
            duration: 0.7, ease: "power3.out",
          });

          // Per-reason: icon flash precedes the line, staggered 0.2s
          const reasons = sectionRef.current?.querySelectorAll<HTMLElement>(".trust-reason") ?? [];
          reasons.forEach((reason, i) => {
            const icon = reason.querySelector<HTMLElement>(".trust-icon");
            const tStart = 0.3 + i * 0.2;

            // Line of text fades up
            tl.to(reason, {
              opacity: 1, y: 0,
              duration: 0.45, ease: "power3.out",
            }, tStart);

            // Icon flash: pop bright then settle
            if (icon) {
              tl.to(icon, {
                opacity: 1, scale: 1.25,
                duration: 0.12, ease: "power2.out",
              }, tStart + 0.04);
              tl.to(icon, {
                scale: 1,
                duration: 0.28, ease: "back.out(2)",
              }, tStart + 0.16);
            }
          });

          // Cert badges: validation indicators clicking on left → right
          tl.to(".cert-badge", {
            opacity: 1, scale: 1,
            duration: 0.4, stagger: 0.1,
            ease: "back.out(1.8)",
          }, "+=0.15");

          // Reviews: fade up in parallel with certs (right column fills together)
          tl.to(".review-card", {
            opacity: 1, y: 0,
            duration: 0.7, stagger: 0.14,
            ease: "power3.out",
          }, "<-=0.5");
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="confiance"
      className="relative section-padding overflow-hidden"
      style={{ backgroundColor: "rgba(13,15,18,0.84)" }}>

      <FloatingData points={TRUST_DATA} />

      {/* Animated ambient blobs */}
      <div className="absolute -right-40 top-1/4 w-[580px] h-[580px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,107,26,0.11) 0%, transparent 62%)",
          animation: "breathe 10s ease-in-out infinite",
        }} />
      <div className="absolute -left-36 bottom-1/3 w-[460px] h-[460px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,107,26,0.08) 0%, transparent 62%)",
          animation: "breathe 14s ease-in-out infinite reverse",
          animationDelay: "5s",
        }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255,107,26,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,107,26,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }} />
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,107,26,0.25), transparent)" }} />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="trust-header mb-16 lg:mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px" style={{ backgroundColor: "#FF6B1A" }} />
            <span className="font-data text-[11px] tracking-[0.28em] uppercase"
              style={{ color: "rgba(255,107,26,0.7)" }}>
              Why Choose Us
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.9] text-white font-extrabold">
            AN HVAC COMPANY<br />
            <span style={{ color: "#FF6B1A" }}>YOU CAN ACTUALLY</span><br />
            TRUST
          </h2>
        </div>

        {/* Two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Left — Reasons + Certs */}
          <div>
            <div className="space-y-5 mb-12">
              {REASONS.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.text} className="trust-reason flex items-start gap-4">
                    <div className="trust-icon flex-shrink-0 w-9 h-9 flex items-center justify-center"
                      style={{ border: "1px solid rgba(255,107,26,0.2)", backgroundColor: "rgba(255,107,26,0.08)" }}>
                      <Icon size={15} style={{ color: "#FF6B1A" }} />
                    </div>
                    <p className="text-sm leading-relaxed pt-1.5"
                      style={{ color: "rgba(255,255,255,0.6)" }}>
                      {r.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Certifications */}
            <div>
              <p className="font-data text-[10px] tracking-[0.28em] uppercase mb-5"
                style={{ color: "rgba(255,255,255,0.25)" }}>
                Certifications &amp; Licenses
              </p>
              <div className="flex flex-wrap gap-3">
                {CERTIFICATIONS.map((cert) => (
                  <div key={cert.label} className="cert-badge px-5 py-4 transition-colors duration-300"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "#0A0C0F" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,107,26,0.3)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)")}>
                    <div className="font-heading text-xl font-extrabold mb-0.5"
                      style={{ color: "#FF6B1A" }}>{cert.label}</div>
                    <div className="font-data text-[9px] tracking-wider uppercase"
                      style={{ color: "rgba(255,255,255,0.25)" }}>{cert.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Google aggregate */}
            <div className="mt-10 flex items-center gap-4 px-6 py-4"
              style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0A0C0F" }}>
              <div>
                <div className="font-heading text-3xl font-extrabold text-white">5.0</div>
                <StarRow count={5} />
              </div>
              <div className="w-px h-10" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              <div>
                <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
                  5-star rated on Google
                </p>
                <p className="font-data text-[10px] tracking-wider uppercase mt-0.5"
                  style={{ color: "rgba(255,255,255,0.25)" }}>
                  47+ verified reviews
                </p>
              </div>
              <div className="ml-auto font-heading text-2xl font-extrabold"
                style={{ color: "rgba(255,255,255,0.08)" }}>G</div>
            </div>
          </div>

          {/* Right — Reviews */}
          <div className="space-y-4">
            {REVIEWS.map((review, i) => (
              <div key={`review-${i}`} className="review-card relative p-6 overflow-hidden group transition-colors duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0A0C0F" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.10)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)")}>

                {/* Hover shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,107,26,0.025) 50%, transparent 60%)" }} />

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "rgba(255,107,26,0.15)" }}>
                      <span className="font-heading text-sm font-bold" style={{ color: "#FF6B1A" }}>
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>{review.name}</p>
                      <p className="font-data text-[10px] tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>{review.location}</p>
                    </div>
                  </div>
                  <span className="font-data text-[9px] tracking-wider uppercase"
                    style={{ color: "rgba(255,255,255,0.2)" }}>{review.date}</span>
                </div>

                <StarRow count={review.rating} />

                <p className="text-sm leading-relaxed mt-3 mb-4"
                  style={{ color: "rgba(255,255,255,0.45)" }}>
                  &ldquo;{review.text}&rdquo;
                </p>

                <span className="font-data text-[9px] tracking-[0.2em] uppercase px-2.5 py-1"
                  style={{ color: "rgba(255,107,26,0.5)", border: "1px solid rgba(255,107,26,0.15)" }}>
                  {review.service}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

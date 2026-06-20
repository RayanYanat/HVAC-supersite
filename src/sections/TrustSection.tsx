"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ShieldCheck, Clock, Award, ThumbsUp, Star } from "lucide-react";
import type { CompanyData } from "@/lib/types";

const CERTIFICATIONS = [
  { label: "Certified", sub: "Technicians" },
  { label: "Licensed",  sub: "Fully" },
  { label: "Insured",   sub: "Fully" },
  { label: "5★ rated",  sub: "Top reviews" },
];

function StarRow({ count, size = 13 }: { count: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size}
          style={{ color: i < count ? "#E2A21E" : "var(--border-strong)" }}
          fill={i < count ? "#E2A21E" : "transparent"} />
      ))}
    </div>
  );
}

export default function TrustSection({ company }: { company: CompanyData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const loc = company.city;

  const REASONS = [
    { icon: ShieldCheck, text: "Certified & fully licensed technicians at the highest industry standard." },
    { icon: Clock,       text: `Guaranteed fast response across ${company.zone}.` },
    { icon: Award,       text: "15+ years of HVAC expertise across residential & commercial." },
    { icon: ThumbsUp,    text: "98% customer satisfaction, verified on Google." },
  ];

  const REVIEWS = [
    { name: "Marcus T.", location: loc, rating: 5, date: "2 weeks ago", service: "Furnace repair",
      text: "Fast, professional, and honest. They diagnosed the issue in minutes and had everything fixed the same day. Highly recommend." },
    { name: "Sarah K.", location: loc, rating: 5, date: "1 month ago", service: "AC installation",
      text: "Got a new mini-split installed before summer hit. Clean work, great pricing, and they handled all the permits. Will use again." },
    { name: "James R.", location: loc, rating: 5, date: "3 months ago", service: "Maintenance plan",
      text: "On a maintenance plan for 2 years now. Always on time, always thorough. Best HVAC company in the area, no question." },
  ];

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.set(".trust-header", { opacity: 0, y: 22 });
      gsap.set(".trust-reason", { opacity: 0, y: 14 });
      gsap.set(".cert-badge", { opacity: 0, y: 12 });
      gsap.set(".review-card", { opacity: 0, y: 26 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 82%", once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
          tl.to(".trust-header", { opacity: 1, y: 0, duration: 0.6 })
            .to(".trust-reason", { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.3")
            .to(".cert-badge", { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 }, "-=0.2")
            .to(".review-card", { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, "-=0.6");
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="confiance" className="relative section-padding" style={{ backgroundColor: "var(--surface-warm)" }}>
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <div className="trust-header max-w-2xl mb-14 lg:mb-16">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-7 h-px" style={{ backgroundColor: "var(--brand)" }} />
            <span className="font-data text-[12px] tracking-[0.12em] uppercase" style={{ color: "var(--brand)" }}>
              Why choose us
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05] font-semibold" style={{ color: "var(--foreground)" }}>
            An HVAC company you can{" "}<span className="italic" style={{ color: "var(--brand)" }}>actually</span>{" "}trust.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Left — reasons + certs + google */}
          <div>
            <div className="space-y-5 mb-10">
              {REASONS.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.text} className="trust-reason flex items-start gap-4">
                    <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-[var(--radius)]" style={{ backgroundColor: "var(--surface)", color: "var(--brand)", border: "1px solid var(--border-subtle)" }}>
                      <Icon size={17} />
                    </span>
                    <p className="text-[1rem] leading-relaxed pt-1.5" style={{ color: "var(--foreground)" }}>
                      {r.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Certifications */}
            <div className="flex flex-wrap gap-3 mb-8">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.label} className="cert-badge px-5 py-4 rounded-[var(--radius)] bg-surface shadow-soft" style={{ border: "1px solid var(--border-subtle)" }}>
                  <div className="font-heading text-[1.15rem] font-semibold" style={{ color: "var(--foreground)" }}>{cert.label}</div>
                  <div className="text-[0.78rem]" style={{ color: "var(--text-muted)" }}>{cert.sub}</div>
                </div>
              ))}
            </div>

            {/* Google aggregate */}
            <div className="flex items-center gap-5 px-6 py-5 rounded-[var(--radius)] bg-surface shadow-soft" style={{ border: "1px solid var(--border-subtle)" }}>
              <div>
                <div className="font-heading text-[2rem] font-semibold leading-none mb-1.5" style={{ color: "var(--foreground)" }}>5.0</div>
                <StarRow count={5} />
              </div>
              <div className="w-px h-11" style={{ backgroundColor: "var(--border-subtle)" }} />
              <div>
                <p className="text-[0.95rem] font-medium" style={{ color: "var(--foreground)" }}>5-star rated on Google</p>
                <p className="text-[0.82rem] mt-0.5" style={{ color: "var(--text-muted)" }}>47+ verified reviews</p>
              </div>
            </div>
          </div>

          {/* Right — reviews */}
          <div className="space-y-4">
            {REVIEWS.map((review, i) => (
              <div key={`review-${i}`} className="review-card lift p-6 rounded-[var(--radius)] bg-surface shadow-soft" style={{ border: "1px solid var(--border-subtle)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center font-heading text-[0.95rem] font-semibold" style={{ backgroundColor: "var(--surface-warm)", color: "var(--brand)" }}>
                      {review.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-[0.95rem] font-medium" style={{ color: "var(--foreground)" }}>{review.name}</p>
                      <p className="text-[0.8rem]" style={{ color: "var(--text-muted)" }}>{review.location}</p>
                    </div>
                  </div>
                  <span className="text-[0.78rem]" style={{ color: "var(--text-faint)" }}>{review.date}</span>
                </div>

                <StarRow count={review.rating} />

                <p className="text-[0.95rem] leading-relaxed mt-3 mb-4" style={{ color: "var(--text-muted)" }}>
                  &ldquo;{review.text}&rdquo;
                </p>

                <span className="text-[0.78rem] px-2.5 py-1 rounded-full" style={{ color: "var(--cool)", backgroundColor: "var(--surface-warm)" }}>
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

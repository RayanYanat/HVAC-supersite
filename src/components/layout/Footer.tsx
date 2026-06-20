"use client";
import { Phone, Mail, MapPin } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import type { CompanyData } from "@/lib/types";

const CERTIFS = ["Certified", "Licensed", "Insured", "5★ rated"];

/* Warm ink footer — deep charcoal, never the cold blue-black.
   Grounds the bright editorial page like the last page of a magazine. */
const INK = "#1B1714";
const ON_INK = "rgba(245,240,233,0.92)";
const ON_INK_MUTED = "rgba(245,240,233,0.55)";
const ON_INK_FAINT = "rgba(245,240,233,0.38)";

export default function Footer({ company }: { company: CompanyData }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: INK }}>
      {/* hot/cold hairline at the very top */}
      <div className="h-[3px]" style={{ background: "linear-gradient(to right, var(--brand) 0%, var(--brand) 50%, var(--cool) 50%, var(--cool) 100%)" }} />

      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 lg:py-20">

          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-5">
              <span className="inline-block w-2.5 h-2.5 rounded-[3px]" style={{ background: "linear-gradient(135deg, var(--brand) 50%, var(--cool) 50%)" }} />
              <span className="font-heading text-[1.6rem] font-semibold" style={{ color: ON_INK, letterSpacing: "-0.02em" }}>
                {company.name}
              </span>
            </a>
            <p className="text-[0.95rem] leading-relaxed max-w-xs mb-7" style={{ color: ON_INK_MUTED }}>
              Licensed HVAC contractor serving {company.zone}. Heating, air
              conditioning, ventilation and maintenance, done right every time.
            </p>
            <div className="flex flex-wrap gap-2">
              {CERTIFS.map((c) => (
                <span key={c} className="text-[0.78rem] font-medium px-3 py-1.5 rounded-full"
                  style={{ border: "1px solid rgba(245,240,233,0.16)", color: ON_INK_MUTED }}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[0.78rem] tracking-[0.1em] uppercase mb-5 font-data" style={{ color: ON_INK_FAINT }}>
              Navigation
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="underline-grow text-[0.95rem] transition-colors duration-200" style={{ color: ON_INK_MUTED }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--brand-bright)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = ON_INK_MUTED)}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className="text-[0.95rem] font-medium transition-colors duration-200" style={{ color: "var(--brand-bright)" }}>
                  Free estimate →
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[0.78rem] tracking-[0.1em] uppercase mb-5 font-data" style={{ color: ON_INK_FAINT }}>
              Contact
            </p>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${company.phone}`} className="flex items-center gap-3 text-[0.95rem] transition-colors duration-200" style={{ color: ON_INK_MUTED }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--brand-bright)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = ON_INK_MUTED)}>
                  <Phone size={14} style={{ color: "var(--brand-bright)", flexShrink: 0 }} />
                  <span className="font-data tracking-wide">{company.phone}</span>
                </a>
              </li>
              {company.email && (
                <li>
                  <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-[0.95rem] transition-colors duration-200" style={{ color: ON_INK_MUTED }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--brand-bright)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = ON_INK_MUTED)}>
                    <Mail size={14} style={{ color: "var(--brand-bright)", flexShrink: 0 }} />
                    <span>{company.email}</span>
                  </a>
                </li>
              )}
              <li className="flex items-start gap-3 text-[0.95rem]" style={{ color: ON_INK_MUTED }}>
                <MapPin size={14} style={{ color: "var(--brand-bright)", flexShrink: 0, marginTop: 2 }} />
                <span>{company.address ?? company.zone}</span>
              </li>
            </ul>

            <div className="mt-7 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-[var(--radius)]" style={{ border: "1px solid rgba(245,240,233,0.12)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: "var(--brand-bright)" }} />
              <span className="text-[0.78rem] tracking-wide" style={{ color: ON_INK_MUTED }}>
                Emergency service 24/7
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(245,240,233,0.10)" }}>
          <p className="text-[0.82rem]" style={{ color: ON_INK_FAINT }}>
            © {year} {company.name}. All rights reserved
          </p>
          <div className="flex items-center gap-6">
            {["Privacy policy", "Terms of service", "Sitemap"].map((item) => (
              <a key={item} href="#" className="text-[0.82rem] transition-colors duration-200" style={{ color: ON_INK_FAINT }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = ON_INK_MUTED)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = ON_INK_FAINT)}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

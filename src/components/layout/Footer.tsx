"use client";
import { Phone, Mail, MapPin } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import type { CompanyData } from "@/lib/types";

const CERTIFS = ["NATE", "EPA 608", "ACCA", "BBB"];

export default function Footer({ company }: { company: CompanyData }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: "#07090C", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,107,26,0.4), transparent)" }} />

      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 lg:py-20">

          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-5">
              <span className="text-lg" style={{ color: "#FF6B1A" }}>▸</span>
              <span className="font-heading text-2xl font-extrabold tracking-widest uppercase text-white">
                {company.name}
              </span>
            </a>
            <p className="text-sm leading-relaxed max-w-xs mb-7"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              Licensed HVAC contractor serving {company.zone}.
              Heating, air conditioning, ventilation, and maintenance —
              done right, every time.
            </p>
            <div className="flex flex-wrap gap-2">
              {CERTIFS.map((c) => (
                <span key={c}
                  className="font-heading text-xs font-bold tracking-widest uppercase px-3 py-1.5 transition-colors duration-200"
                  style={{ border: "1px solid rgba(255,107,26,0.2)", color: "rgba(255,107,26,0.6)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,107,26,0.45)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,107,26,0.85)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,107,26,0.2)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,107,26,0.6)";
                  }}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-data text-[10px] tracking-[0.28em] uppercase mb-6"
              style={{ color: "rgba(255,255,255,0.25)" }}>
              Navigation
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}
                    className="text-sm font-medium transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FF6B1A")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact"
                  className="text-sm font-bold transition-colors duration-200"
                  style={{ color: "rgba(255,107,26,0.7)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FF6B1A")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,107,26,0.7)")}>
                  Free Estimate →
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-data text-[10px] tracking-[0.28em] uppercase mb-6"
              style={{ color: "rgba(255,255,255,0.25)" }}>
              Contact
            </p>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${company.phone}`}
                  className="flex items-center gap-3 text-sm transition-colors duration-200"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FF6B1A")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}>
                  <Phone size={13} style={{ color: "rgba(255,107,26,0.5)", flexShrink: 0 }} />
                  <span className="font-data tracking-wider">{company.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`}
                  className="flex items-center gap-3 text-sm transition-colors duration-200"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FF6B1A")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}>
                  <Mail size={13} style={{ color: "rgba(255,107,26,0.5)", flexShrink: 0 }} />
                  <span>{company.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                <MapPin size={13} style={{ color: "rgba(255,107,26,0.5)", flexShrink: 0, marginTop: 2 }} />
                <span>{company.address ?? company.zone}</span>
              </li>
            </ul>

            <div className="mt-7 flex items-center gap-2.5 px-4 py-3"
              style={{ border: "1px solid rgba(255,107,26,0.15)", backgroundColor: "rgba(255,107,26,0.05)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                style={{ backgroundColor: "#FF6B1A" }} />
              <span className="font-data text-[10px] tracking-wider uppercase"
                style={{ color: "rgba(255,107,26,0.65)" }}>
                Emergency Service 24/7
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="font-data text-[10px] tracking-wider"
            style={{ color: "rgba(255,255,255,0.2)" }}>
            © {year} {company.name} — All rights reserved · {company.license}
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((item) => (
              <a key={item} href="#"
                className="font-data text-[10px] tracking-wider transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.2)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.2)")}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import type { CompanyData } from "@/lib/types";

export default function Navbar({ company }: { company: CompanyData }) {
  const [scrolled, setScrolled]           = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  /* ── Scroll: shrink trigger ─────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Active section: IntersectionObserver ───────────────────────── */
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.slice(1));

    /*
     * rootMargin "-30% 0px -65% 0px" creates a narrow band ~30% from
     * the top of the viewport. The section whose heading crosses that
     * band becomes "active" — gives a tight, accurate reading-position
     * indicator without needing scroll event math.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-30% 0px -65% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(10,12,15,0.92)" : "transparent",
        backdropFilter:        scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter:  scrolled ? "blur(12px)" : "none",
        borderBottom:          scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}
    >
      {/* Inner row — height shrinks on scroll */}
      <div
        className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between gap-8 transition-all duration-500"
        style={{ height: scrolled ? "48px" : "80px" }}
      >

        {/* Logo */}
        <a
          href="#"
          className="font-heading font-bold tracking-widest uppercase text-white flex items-center gap-2 transition-all duration-500"
          style={{ fontSize: scrolled ? "1rem" : "1.25rem" }}
        >
          <span className="text-brand">▸</span>
          {company.name}
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium tracking-widest uppercase transition-colors duration-200 group"
                style={{ color: isActive ? "#FF6B1A" : "rgba(255,255,255,0.5)" }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = "#FF6B1A";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                }}
              >
                {link.label}
                {/* Animated underline */}
                <span
                  className="absolute -bottom-1 left-0 h-px bg-brand transition-all duration-300 ease-out"
                  style={{ width: isActive ? "100%" : "0%" }}
                />
              </a>
            );
          })}
        </nav>

        {/* Right: phone + CTA */}
        <div className="hidden lg:flex items-center gap-5">
          <a
            href={`tel:${company.phone}`}
            className="flex items-center gap-2 transition-colors duration-200"
            style={{ color: "rgba(255,255,255,0.7)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#FF6B1A"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
          >
            <Phone size={14} className="text-brand" />
            <span className="font-data text-sm tracking-wider">{company.phone}</span>
          </a>
          <a
            href="#contact"
            className="px-5 py-2.5 bg-brand text-white text-xs font-bold tracking-widest uppercase rounded-none hover:bg-brand-dim transition-all duration-300 glow-brand"
            style={{ paddingBlock: scrolled ? "0.5rem" : "0.625rem" }}
          >
            Free Estimate
          </a>
        </div>

        {/* Mobile: phone + burger */}
        <div className="flex lg:hidden items-center gap-4">
          <a
            href={`tel:${company.phone}`}
            className="flex items-center gap-1.5 text-brand"
            aria-label="Call us"
          >
            <Phone size={16} />
            <span className="font-data text-xs">{company.phone}</span>
          </a>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="lg:hidden px-5 py-6 flex flex-col gap-5"
          style={{
            backgroundColor:       "rgba(10,12,15,0.97)",
            backdropFilter:        "blur(16px)",
            WebkitBackdropFilter:  "blur(16px)",
            borderTop:             "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-bold tracking-widest uppercase transition-colors"
                style={{ color: isActive ? "#FF6B1A" : "rgba(255,255,255,0.6)" }}
              >
                {isActive && <span className="mr-2 text-brand">▸</span>}
                {link.label}
              </a>
            );
          })}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-5 py-3 bg-brand text-white text-xs font-bold tracking-widest uppercase text-center"
          >
            Free Estimate
          </a>
        </div>
      )}
    </header>
  );
}

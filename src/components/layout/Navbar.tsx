"use client";
import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import type { CompanyData } from "@/lib/types";

export default function Navbar({ company }: { company: CompanyData }) {
  const [scrolled, setScrolled]           = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  /* ── Scroll: shrink + surface trigger ───────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Active section: IntersectionObserver ───────────────────────── */
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
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
        backgroundColor: scrolled ? "rgba(250,247,242,0.88)" : "transparent",
        backdropFilter:        scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter:  scrolled ? "blur(12px)" : "none",
        borderBottom:          scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between gap-8 transition-all duration-500"
        style={{ height: scrolled ? "60px" : "80px" }}
      >

        {/* Logo */}
        <a
          href="#"
          className="font-heading font-semibold flex items-center gap-2 transition-all duration-500"
          style={{ fontSize: scrolled ? "1.2rem" : "1.4rem", color: "var(--foreground)", letterSpacing: "-0.02em" }}
        >
          <span
            className="inline-block w-2.5 h-2.5 rounded-[3px]"
            style={{ background: "linear-gradient(135deg, var(--brand) 50%, var(--cool) 50%)" }}
          />
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
                className="relative text-[0.92rem] font-medium transition-colors duration-200"
                style={{ color: isActive ? "var(--brand)" : "var(--text-muted)" }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--foreground)"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
              >
                {link.label}
                <span
                  className="absolute -bottom-1.5 left-0 h-px transition-all duration-300 ease-out"
                  style={{ width: isActive ? "100%" : "0%", backgroundColor: "var(--brand)" }}
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
            style={{ color: "var(--foreground)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--foreground)"; }}
          >
            <Phone size={15} className="text-brand" />
            <span className="font-data text-[0.85rem] tracking-wide">{company.phone}</span>
          </a>
          <a
            href="#contact"
            className="px-5 py-2.5 text-white text-[0.85rem] font-medium rounded-[var(--radius)] transition-all duration-300"
            style={{ backgroundColor: "var(--brand)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--brand-dim)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--brand)")}
          >
            Free estimate
          </a>
        </div>

        {/* Mobile: phone + burger */}
        <div className="flex lg:hidden items-center gap-4">
          <a
            href={`tel:${company.phone}`}
            className="flex items-center gap-1.5 text-brand whitespace-nowrap"
            aria-label="Call us"
          >
            <Phone size={16} />
            <span className="font-data text-xs">{company.phone}</span>
          </a>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="transition-colors"
            style={{ color: "var(--foreground)" }}
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
            backgroundColor:       "rgba(250,247,242,0.98)",
            backdropFilter:        "blur(16px)",
            WebkitBackdropFilter:  "blur(16px)",
            borderTop:             "1px solid var(--border-subtle)",
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[0.95rem] font-medium transition-colors"
                style={{ color: isActive ? "var(--brand)" : "var(--foreground)" }}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-5 py-3 text-white text-[0.9rem] font-medium text-center rounded-[var(--radius)]"
            style={{ backgroundColor: "var(--brand)" }}
          >
            Free estimate
          </a>
        </div>
      )}
    </header>
  );
}

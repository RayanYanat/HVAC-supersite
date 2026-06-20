"use client";
import { useEffect, useRef, useState } from "react";
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

  /* Over the dark cinematic hero (top, not scrolled) text must be light;
     once scrolled onto the bone surface it flips back to ink. */
  const textMain  = scrolled ? "var(--foreground)" : "#FBF7F1";
  const textMuted = scrolled ? "var(--text-muted)" : "rgba(245,240,233,0.82)";

  /* Auto-fit the FULL business name: scraped names vary wildly in length and
     we outreach without manual review, so the name is NEVER truncated or
     ellipsised (that would kill the bespoke feel). Instead the font shrinks
     just enough to keep the complete name on one line, within a width budget. */
  const nameRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = nameRef.current;
    if (!el) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const fit = () => {
      const base = scrolled ? 19.2 : 22.4; // px ≈ 1.2rem / 1.4rem
      if (!ctx) { el.style.fontSize = base + "px"; return; }
      // Width budget for the name: full row minus the right-side controls,
      // the brand dot and gap. A 3% safety margin guarantees no clipping.
      const budget = window.innerWidth >= 1024 ? 400 : window.innerWidth - 128;
      const family = getComputedStyle(el).fontFamily || "serif";
      ctx.font = `600 ${base}px ${family}`;
      const natural = ctx.measureText(company.name).width * 1.03;
      const size = natural > budget ? Math.max(11, (base * budget) / natural) : base;
      el.style.fontSize = size + "px";
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [scrolled, company.name]);

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
          className="font-heading font-semibold flex items-center gap-2 flex-1 min-w-0 overflow-hidden transition-all duration-500"
          style={{ color: textMain, letterSpacing: "-0.02em" }}
        >
          <span
            className="inline-block w-2.5 h-2.5 rounded-[3px] flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--brand) 50%, var(--cool) 50%)" }}
          />
          <span ref={nameRef} className="whitespace-nowrap" style={{ transition: "font-size 0.3s ease" }}>
            {company.name}
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 flex-shrink-0">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className="relative text-[0.92rem] font-medium transition-colors duration-200"
                style={{ color: isActive ? "var(--brand)" : textMuted }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = textMain; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = textMuted; }}
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
        <div className="hidden lg:flex items-center gap-5 flex-shrink-0">
          <a
            href={`tel:${company.phone}`}
            className="flex items-center gap-2 transition-colors duration-200"
            style={{ color: textMain }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = textMain; }}
          >
            <Phone size={15} style={{ color: scrolled ? "var(--brand)" : "#FFB27A" }} />
            <span className="font-data text-[0.85rem] tracking-wide">{company.phone}</span>
          </a>
          <a
            href="#contact"
            className="press px-5 py-2.5 text-white text-[0.85rem] font-medium rounded-[var(--radius)] transition-all duration-300"
            style={{ backgroundColor: "var(--brand)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--brand-dim)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--brand)")}
          >
            Free estimate
          </a>
        </div>

        {/* Mobile: burger only — keeps full room for the business name.
            The phone lives in the menu + the hero CTA. */}
        <div className="flex lg:hidden items-center flex-shrink-0 pl-3">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="transition-colors"
            style={{ color: textMain }}
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
            href={`tel:${company.phone}`}
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex items-center justify-center gap-2.5 px-5 py-3 text-white text-[0.9rem] font-medium rounded-[var(--radius)]"
            style={{ backgroundColor: "var(--brand)" }}
          >
            <Phone size={16} />
            Call now · {company.phone}
          </a>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="px-5 py-3 text-[0.9rem] font-medium text-center rounded-[var(--radius)]"
            style={{ color: "var(--foreground)", border: "1px solid var(--border-strong)" }}
          >
            Free estimate
          </a>
        </div>
      )}
    </header>
  );
}

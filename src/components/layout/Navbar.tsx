"use client";
import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { COMPANY, NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Threshold at 5px instead of 40px: the background only disappears at the
    // absolute top of the page. iOS momentum scroll can never accidentally
    // dip below this value from mid-page, eliminating background flicker
    // when scrolling upward.
    const onScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        // bg-[#0A0C0F]/90 and backdrop-blur-md replaced with inline rgba():
        // Tailwind v4 opacity modifiers on arbitrary/variable colors are unreliable —
        // they generate color-mix() which iOS Safari can misinterpret.
        // rgba() is the only guaranteed path across all browsers.
        backgroundColor: scrolled ? "rgba(10,12,15,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 lg:h-20 flex items-center justify-between gap-8">

        {/* Logo */}
        <a
          href="#"
          className="font-heading text-xl lg:text-2xl font-bold tracking-widest uppercase text-white flex items-center gap-2"
        >
          <span className="text-brand">▸</span>
          {COMPANY.name}
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-widest uppercase text-white/50 hover:text-brand transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: phone + CTA */}
        <div className="hidden lg:flex items-center gap-5">
          <a
            href={`tel:${COMPANY.phone}`}
            className="flex items-center gap-2 text-white/70 hover:text-brand transition-colors duration-200"
          >
            <Phone size={14} className="text-brand" />
            <span className="font-data text-sm tracking-wider">{COMPANY.phone}</span>
          </a>
          <a
            href="#contact"
            className="px-5 py-2.5 bg-brand text-white text-xs font-bold tracking-widest uppercase rounded-none hover:bg-brand-dim transition-colors duration-200 glow-brand"
          >
            Free Estimate
          </a>
        </div>

        {/* Mobile: phone + burger */}
        <div className="flex lg:hidden items-center gap-4">
          <a
            href={`tel:${COMPANY.phone}`}
            className="flex items-center gap-1.5 text-brand"
            aria-label="Appeler"
          >
            <Phone size={16} />
            <span className="font-data text-xs">{COMPANY.phone}</span>
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
            backgroundColor: "rgba(10,12,15,0.95)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-bold tracking-widest uppercase text-white/60 hover:text-brand transition-colors"
            >
              {link.label}
            </a>
          ))}
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

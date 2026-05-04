import AmbientCanvas    from "@/components/shared/AmbientCanvas";
import GlobalTexture    from "@/components/shared/GlobalTexture";
import GSAPConfig       from "@/components/shared/GSAPConfig";
import ThermalNarrative from "@/components/shared/ThermalNarrative";
import Navbar           from "@/components/layout/Navbar";
import HeroSection      from "@/sections/HeroSection";
import ServicesSection  from "@/sections/ServicesSection";
import ThermalDivider   from "@/components/shared/ThermalDivider";
import WorkSection      from "@/sections/WorkSection";
import StatsSection     from "@/sections/StatsSection";
import TrustSection     from "@/sections/TrustSection";
import ContactSection   from "@/sections/ContactSection";
import Footer           from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      {/* ── Global atmospheric layers (fixed, behind everything) ── */}
      <AmbientCanvas />
      <GlobalTexture />

      {/* Navbar lives outside <main> so its position:fixed / z-50 sits in the
          root stacking context — guaranteed above main's zIndex:1 bubble.
          On iOS, fixed elements inside a z-indexed parent can be trapped;
          this placement eliminates that class of bug entirely. */}
      <Navbar />

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* Global GSAP configuration — mounts once, no DOM output.
            Must be first child so config is applied before any section
            registers its ScrollTrigger instances. */}
        <GSAPConfig />

        {/* Continuous warm→cool temperature spine, behind every section.
            Section backgrounds at ~0.84 alpha let this gradient subtly
            tint each section's atmosphere as the visitor scrolls down. */}
        <ThermalNarrative />
        <HeroSection />
        <ServicesSection />
        <ThermalDivider />
        <WorkSection />
        <StatsSection />
        <TrustSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}

import { notFound }   from "next/navigation";
import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import type { CompanyData } from "@/lib/types";

import AmbientCanvas    from "@/components/shared/AmbientCanvas";
import CustomCursor     from "@/components/shared/CustomCursor";
import GlobalTexture    from "@/components/shared/GlobalTexture";
import GSAPConfig       from "@/components/shared/GSAPConfig";
import ThermalNarrative from "@/components/shared/ThermalNarrative";
import ThermalDivider   from "@/components/shared/ThermalDivider";
import Navbar           from "@/components/layout/Navbar";
import Footer           from "@/components/layout/Footer";
import HeroSection      from "@/sections/HeroSection";
import ServicesSection  from "@/sections/ServicesSection";
import StatsSection     from "@/sections/StatsSection";
import WorkSection      from "@/sections/WorkSection";
import TrustSection     from "@/sections/TrustSection";
import ContactSection   from "@/sections/ContactSection";

/* ── ISR config ────────────────────────────────────────────────────────────
 * dynamicParams = true  → slugs not in generateStaticParams are rendered
 *                          on first request, then cached.
 * revalidate = 86400    → cached HTML is considered fresh for 24 h.
 *                          After that, next request triggers a background
 *                          regeneration (stale-while-revalidate).
 * generateStaticParams  → returns [] so nothing is pre-built at deploy time;
 *                          every page is generated on-demand.
 * ─────────────────────────────────────────────────────────────────────────── */
export const dynamicParams = true;
export const revalidate    = 86400;

export async function generateStaticParams() {
  return [];
}

/* ── Data fetcher ─────────────────────────────────────────────────────────── */
async function getCompany(slug: string): Promise<CompanyData | null> {
  const { data, error } = await getSupabase()
    .from("leads")
    .select("slug, name, zone, phone, email, license")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as CompanyData;
}

/* ── Dynamic metadata ─────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company  = await getCompany(slug);

  if (!company) {
    return {
      title:       "HVAC Experts — Fast, Reliable Service",
      description: "Licensed HVAC contractor. Same-day emergency response — free estimates.",
    };
  }

  return {
    title:       `${company.name} — HVAC Experts in ${company.zone}`,
    description: `Licensed HVAC contractor in ${company.zone}. Emergency response — free estimates. Call ${company.phone}.`,
  };
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company  = await getCompany(slug);

  if (!company) return notFound();

  return (
    <>
      {/* Global atmospheric layers — fixed, behind everything */}
      <AmbientCanvas />
      <GlobalTexture />
      <CustomCursor />

      {/* Navbar outside <main> → root stacking context → iOS safe */}
      <Navbar company={company} />

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* GSAPConfig first child — registers plugins before ScrollTriggers */}
        <GSAPConfig />

        <ThermalNarrative />
        <HeroSection     company={company} />
        <ServicesSection />
        <ThermalDivider  />
        <WorkSection     company={company} />
        <StatsSection    company={company} />
        <TrustSection    company={company} />
        <ContactSection  company={company} />
        <Footer          company={company} />
      </main>
    </>
  );
}

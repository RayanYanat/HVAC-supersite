import { notFound }   from "next/navigation";
import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import type { CompanyData } from "@/lib/types";

import VisitTracker     from "@/components/shared/VisitTracker";
import ConceptBanner    from "@/components/shared/ConceptBanner";
import GSAPConfig       from "@/components/shared/GSAPConfig";
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
    .select("slug, name, city, phone, email, address, opening_hours")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  /* Compute `zone` from the raw `city` field — never stored in the DB.
   * Every component that shows a service-area label uses company.zone. */
  const row = data as Omit<CompanyData, "zone">;
  return { ...row, zone: `${row.city} & surrounding areas` };
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
    title:       `${company.name} — HVAC Experts in ${company.city}`,
    description: `Licensed HVAC contractor in ${company.city}. Emergency response — free estimates. Call ${company.phone}.`,
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
      {/* Navbar outside <main> → root stacking context → iOS safe */}
      <VisitTracker slug={slug} />
      <Navbar company={company} />

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* GSAPConfig first child — registers plugins before ScrollTriggers */}
        <GSAPConfig />

        <HeroSection     company={company} />
        <ServicesSection />
        <WorkSection     company={company} />
        <StatsSection    company={company} />
        <TrustSection    company={company} />
        <ContactSection  company={company} />
        <Footer          company={company} />
      </main>

      <ConceptBanner name={company.name} />
    </>
  );
}

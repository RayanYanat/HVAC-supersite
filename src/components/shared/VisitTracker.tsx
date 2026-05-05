"use client";
import { useEffect } from "react";

/**
 * Fires a single POST to /api/track when the page mounts.
 * Renders nothing — purely a side-effect component.
 *
 * Why client-side and not in the Server Component?
 * The [slug] page uses ISR (revalidate = 86400). The Server Component
 * only re-executes once per 24 h per slug, so inserting there would
 * log one visit per day regardless of real traffic.
 * A useEffect fires on every actual browser load — exactly what we want.
 */
export default function VisitTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch("/api/track", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ slug }),
    }).catch(() => {}); // fire-and-forget — never blocks UI
  }, [slug]);

  return null;
}

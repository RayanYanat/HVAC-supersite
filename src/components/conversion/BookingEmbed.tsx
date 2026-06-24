"use client";
import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

/**
 * Cal.com inline booking. Rendered ONLY when its tab is opened (the parent
 * mounts it on demand), so the Cal.com script never touches the initial page
 * load. A single Cal account serves every mockup; swap NEXT_PUBLIC_CAL_LINK
 * (or the prop) for the client's calendar when the site is sold.
 */
export default function BookingEmbed({ calLink }: { calLink: string }) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: { light: { "cal-brand": "#C8511F" }, dark: { "cal-brand": "#C8511F" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className="rounded-[var(--radius)] overflow-hidden" style={{ minHeight: 560 }}>
      <Cal
        calLink={calLink}
        style={{ width: "100%", height: "560px", overflow: "scroll" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}

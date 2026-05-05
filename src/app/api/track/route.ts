import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * POST /api/track
 *
 * Called client-side by <VisitTracker> on every real page load.
 * Runs server-side so the Slack webhook URL stays secret.
 *
 * Flow:
 *   1. Reject known bots (no INSERT, no Slack noise)
 *   2. COUNT existing visits for this slug → detect revisit
 *   3. INSERT new row into `visits`
 *   4. POST to Slack (fire-and-forget — never blocks the response)
 */
export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json() as { slug: string };
    if (!slug) return NextResponse.json({ ok: false }, { status: 400 });

    const userAgent = req.headers.get("user-agent") ?? "";

    /* ── Ignore bots ───────────────────────────────────────────────── */
    if (/bot|crawl|spider|slurp|baidu|bytespider|GPTBot/i.test(userAgent)) {
      return NextResponse.json({ ok: true });
    }

    const supabase = getSupabase();

    /* ── Count previous visits for revisit detection ───────────────── */
    const { count } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true })
      .eq("slug", slug);

    const previousVisits = count ?? 0;
    const isRevisit      = previousVisits > 0;
    const visitNumber    = previousVisits + 1;

    /* ── Log the visit ──────────────────────────────────────────────── */
    await supabase.from("visits").insert({ slug, user_agent: userAgent });

    /* ── Slack notification (fire-and-forget) ───────────────────────── */
    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      const isMobile   = /mobile|android|iphone|ipad/i.test(userAgent);
      const emoji      = isRevisit ? "🔄" : "🔥";
      const visitLabel = isRevisit
        ? `Revisite #${visitNumber}`
        : "Première visite";
      const device = isMobile ? "📱 Mobile" : "🖥️ Desktop";
      const time   = new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit", minute: "2-digit",
        timeZone: "Europe/Paris",
      });

      /* Don't await — Slack latency must never slow down the tracker */
      fetch(slackUrl, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: [
                  `${emoji} *Lead actif — \`${slug}\`*`,
                  `🕐 ${time}  ·  ${visitLabel}  ·  ${device}`,
                ].join("\n"),
              },
            },
          ],
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    /* Tracking must never break the page — swallow all errors silently */
    return NextResponse.json({ ok: true });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * POST /api/track
 *
 * Logs every real visit directly into the `leads` row.
 * No separate table needed — visit_count, first_visited_at,
 * last_visited_at live alongside the lead's contact data.
 *
 * Flow:
 *   1. Reject bots
 *   2. SELECT current lead (name + visit_count + first_visited_at)
 *   3. UPDATE lead with incremented count + timestamps
 *   4. POST to Slack (fire-and-forget)
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

    /* ── Fetch current lead state ──────────────────────────────────── */
    const { data: lead } = await supabase
      .from("leads")
      .select("name, visit_count, first_visited_at")
      .eq("slug", slug)
      .single();

    if (!lead) return NextResponse.json({ ok: false }, { status: 404 });

    const isFirstVisit = !lead.first_visited_at;
    const newCount     = (lead.visit_count ?? 0) + 1;
    const now          = new Date().toISOString();

    /* ── Update lead ───────────────────────────────────────────────── */
    const { error: updateError } = await supabase
      .from("leads")
      .update({
        visit_count:      newCount,
        first_visited_at: isFirstVisit ? now : lead.first_visited_at,
        last_visited_at:  now,
      })
      .eq("slug", slug);

    /* ── Slack notification (fire-and-forget) ───────────────────────── */
    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      const isMobile   = /mobile|android|iphone|ipad/i.test(userAgent);
      const emoji      = isFirstVisit ? "🔥" : "🔄";
      const visitLabel = isFirstVisit ? "Première visite" : `Revisite #${newCount}`;
      const device     = isMobile ? "📱 Mobile" : "🖥️ Desktop";
      const time       = new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit", minute: "2-digit",
        timeZone: "Europe/Paris",
      });

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
                  `${emoji} *${lead.name}* est sur son site`,
                  `🕐 ${time}  ·  ${visitLabel}  ·  ${device}`,
                ].join("\n"),
              },
            },
          ],
        }),
      }).catch(() => {});
    }

    /* ── DEBUG — remove once tracking is confirmed working ─────────── */
    return NextResponse.json({
      ok:        true,
      hasSlack:  !!slackUrl,
      updateError: updateError ?? null,
      newCount,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, caught: String(e) });
  }
}

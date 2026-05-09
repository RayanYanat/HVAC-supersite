/**
 * mailer.js — Envoie des emails personnalisés depuis Supabase
 *
 * Usage:
 *   node scripts/mailer.js
 *
 * Envoie un email à chaque lead avec status='draft' et un email renseigné.
 * Met à jour le status → 'sent' + sent_at après envoi.
 *
 * Config SMTP dans .env.local :
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 *   SENDER_NAME, BASE_URL
 */

const fs   = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Load .env.local
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const [key, ...rest] = line.split("=");
      if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
    });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BASE_URL     = process.env.BASE_URL;        // ex: https://tonsite.netlify.app
const SENDER_NAME  = process.env.SENDER_NAME;     // ex: Rayan
const DELAY_MS     = parseInt(process.env.MAIL_DELAY_MS || "30000"); // 30s entre chaque email

if (!SUPABASE_URL || !SUPABASE_KEY || !BASE_URL || !SENDER_NAME) {
  console.error("❌  Variables manquantes dans .env.local :");
  console.error("    NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BASE_URL, SENDER_NAME");
  process.exit(1);
}

/* ── SMTP transporter ────────────────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ── Supabase helpers ────────────────────────────────────────────────────── */
const headers = {
  "Content-Type":  "application/json",
  "apikey":        SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
};

async function getLeads() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/leads?status=eq.draft&email=not.is.null&select=*`,
    { headers }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function markSent(slug) {
  await fetch(
    `${SUPABASE_URL}/rest/v1/leads?slug=eq.${encodeURIComponent(slug)}`,
    {
      method:  "PATCH",
      headers: { ...headers, "Prefer": "return=minimal" },
      body:    JSON.stringify({ status: "sent", sent_at: new Date().toISOString() }),
    }
  );
}

/* ── Template email ──────────────────────────────────────────────────────── */
function buildEmail(lead) {
  const url = `${BASE_URL}/${lead.slug}`;

  const subject = `Quick thought on ${lead.name}'s online presence`;

  const text = `Hi,

I came across ${lead.name} in ${lead.city} and put together a custom preview of what your online presence could look like.

Take a look here — it's built specifically for you:
${url}

No strings attached.

Best,
${SENDER_NAME}`;

  const html = `
<p>Hi,</p>
<p>I came across <strong>${lead.name}</strong> in ${lead.city} and put together a custom preview of what your online presence could look like.</p>
<p>Take a look — it's built specifically for you:<br>
<a href="${url}" style="color:#FF6B1A;font-weight:bold;">${url}</a></p>
<p>No strings attached.</p>
<p>Best,<br>${SENDER_NAME}</p>
`;

  return { subject, text, html };
}

/* ── Delay helper ────────────────────────────────────────────────────────── */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── Main ────────────────────────────────────────────────────────────────── */
async function run() {
  console.log("\n📬  Récupération des leads depuis Supabase...\n");

  const leads = await getLeads();

  if (!leads.length) {
    console.log("ℹ️   Aucun lead à contacter (status=draft + email renseigné).");
    return;
  }

  console.log(`📋  ${leads.length} lead(s) à contacter\n`);
  console.log(`⏱️   Délai entre chaque email : ${DELAY_MS / 1000}s\n`);
  console.log("─────────────────────────────────────");

  let ok = 0, err = 0;

  for (const lead of leads) {
    const { subject, text, html } = buildEmail(lead);

    try {
      await transporter.sendMail({
        from:    `"${SENDER_NAME}" <${process.env.SMTP_USER}>`,
        to:      lead.email,
        subject,
        text,
        html,
      });

      await markSent(lead.slug);
      console.log(`✅  ${lead.name.padEnd(40)} → ${lead.email}`);
      ok++;

      // Délai anti-spam entre chaque envoi
      if (ok < leads.length) {
        console.log(`⏳  Attente ${DELAY_MS / 1000}s...`);
        await delay(DELAY_MS);
      }
    } catch (e) {
      console.error(`❌  ${lead.name}: ${e.message}`);
      err++;
    }
  }

  console.log("─────────────────────────────────────");
  console.log(`✅  ${ok} envoyés   ❌ ${err} erreurs\n`);
}

run().catch(console.error);

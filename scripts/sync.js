/**
 * sync.js — NDJSON (Prospects Hunter) → Supabase
 *
 * Usage:
 *   node scripts/sync.js                     ← détecte le .ndjson le plus récent dans ~/Downloads
 *   node scripts/sync.js /chemin/export.ndjson ← fichier explicite
 *
 * Après un sync réussi, le fichier est supprimé automatiquement.
 */

const fs   = require("fs");
const path = require("path");
const os   = require("os");
const rl   = require("readline");

// ── Load .env.local ──────────────────────────────────────────────────────────
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8").split("\n").forEach((line) => {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌  NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local");
  process.exit(1);
}

// ── Auto-détection du fichier ────────────────────────────────────────────────
function findLatestNdjson(dir) {
  let files;
  try { files = fs.readdirSync(dir); }
  catch { return null; }

  const ndjsons = files
    .filter(f => f.endsWith(".ndjson") || f.endsWith(".jsonl"))
    .map(f => ({ name: f, mtime: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);

  return ndjsons.length ? path.join(dir, ndjsons[0].name) : null;
}

function resolveFile(arg) {
  if (arg) {
    const p = path.resolve(arg);
    if (!fs.existsSync(p)) { console.error(`❌  Fichier introuvable : ${p}`); process.exit(1); }
    return p;
  }

  const exportsDir = path.join(os.homedir(), "Library/Application Support/Prospects/exports");
  const found = findLatestNdjson(exportsDir);
  if (!found) {
    console.error("❌  Aucun fichier .ndjson trouvé dans ~/Library/Application Support/Prospects/exports");
    console.error("    Lance : node scripts/sync.js /chemin/vers/export.ndjson");
    process.exit(1);
  }
  return found;
}

// ── Email validation ─────────────────────────────────────────────────────────
function isRealEmail(email) {
  if (!email || typeof email !== "string") return false;
  // Format de base
  if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,6}$/i.test(email)) return false;
  const [local, domain] = email.toLowerCase().split("@");
  const parts = domain.split(".");
  const tld = parts[parts.length - 1];
  const sld = parts[parts.length - 2]; // ex: "gmail" dans gmail.com
  // Partie locale trop courte (élimine d@, m@, loc@, mut@…)
  if (local.length < 4) return false;
  // Domaine principal trop court (élimine @h.com, @or.format, @e.default…)
  if (sld.length < 3) return false;
  // TLD trop long = probablement du code (.useragent, .addednodes…)
  if (tld.length > 6) return false;
  return true;
}

// ── Slugify ──────────────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── Supabase upsert ──────────────────────────────────────────────────────────
async function upsert(lead) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?on_conflict=slug`, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Prefer":        "resolution=merge-duplicates",
      "apikey":        SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error(await res.text());
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function sync(filePath) {
  console.log(`\n📂  ${path.basename(filePath)}\n`);

  const stream = fs.createReadStream(filePath);
  const reader = rl.createInterface({ input: stream, crlfDelay: Infinity });
  let ok = 0, skip = 0, err = 0;

  for await (const line of reader) {
    if (!line.trim()) continue;

    let b;
    try { b = JSON.parse(line); }
    catch { console.warn("⚠️   Ligne ignorée (JSON invalide)"); skip++; continue; }

    const slug  = slugify(b.name);
    const emails = Array.isArray(b.emails) ? b.emails.filter(isRealEmail) : [];
    const email  = emails.length ? emails[0] : null;

    if (!b.phone && !email) {
      console.log(`⏭️   ${b.name} — pas de contact`);
      skip++;
      continue;
    }

    // ⚠️  Ne jamais inclure status/pitch/subject/sent_at/score/notes ici —
    //    ces champs sont gérés dans l'admin et ne doivent pas être écrasés au sync.
    //    status="draft" est posé par défaut au niveau de la colonne Supabase.
    const lead = {
      slug,
      name:          b.name,
      city:          b.city          || null,
      phone:         b.phone         || null,
      email,
      address:       b.address       || null,
      industry:      b.category      || null,
      website:       b.website       || null,
      rating:        b.rating        ?? null,
      review_count:  b.review_count  ?? b.reviewCount ?? null,
      specialty:     b.specialty     || null,
      opening_hours: b.opening_hours || b.openingHours || null,
      photo_url:     b.photo_url     || b.photoUrl     || null,
      description:   b.description   || null,
      place_id:      b.place_id      || b.placeId      || null,
      source:        b.source        || null,
    };

    try {
      await upsert(lead);
      console.log(`✅  ${b.name.padEnd(40)} → /${slug}`);
      ok++;
    } catch (e) {
      console.error(`❌  ${b.name}: ${e.message}`);
      err++;
    }
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`✅  ${ok} synced   ⏭️  ${skip} ignorés   ❌  ${err} erreurs`);
  console.log(`─────────────────────────────────────`);

  if (err === 0 && ok > 0) {
    fs.unlinkSync(filePath);
    console.log(`🗑️   ${path.basename(filePath)} supprimé\n`);
  } else if (err > 0) {
    console.log(`⚠️   Fichier conservé (${err} erreur(s))\n`);
  }
}

sync(resolveFile(process.argv[2]));

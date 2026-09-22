// Pull the existing article list straight out of index.html so the rebuilt
// homepage keeps every link that is there today.
import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8").replace(/\r\n/g, "\n");
const rows = [...html.matchAll(/<article class="row">([\s\S]*?)<\/article>/g)].map(m => m[1]);

const items = rows.map(r => {
  const kicker = (r.match(/<span class="kicker">(?:<svg[\s\S]*?<\/svg>)?([^<]+)<\/span>/) || [])[1] || "";
  const link = r.match(/<h3><a href="([^"]+)">([\s\S]*?)<\/a><\/h3>/);
  const dek = (r.match(/<p class="dek">([\s\S]*?)<\/p>/) || [])[1] || "";
  const meta = (r.match(/<p class="meta">([\s\S]*?)<\/p>/) || [])[1] || "";
  return { href: link ? link[1] : "", title: link ? link[2].trim() : "", kicker: kicker.trim(), dek: dek.trim(), meta: meta.trim() };
});

// the hero article is not in a .row
const heroHref = (html.match(/<h1><a href="([^"]+)"/) || [])[1];
const heroTitle = (html.match(/<h1><a href="[^"]+"[^>]*>([\s\S]*?)<\/a><\/h1>/) || [])[1];
const heroDek = (html.match(/<p class="dek">([\s\S]*?)<\/p>/) || [])[1];
const heroMeta = (html.match(/<p class="meta">([\s\S]*?)<\/p>/) || [])[1];

const all = [
  { href: heroHref, title: (heroTitle || "").trim(), kicker: "Saving", dek: (heroDek || "").trim(), meta: (heroMeta || "").trim() },
  ...items,
];

fs.writeFileSync("_articles.json", JSON.stringify(all, null, 2), "utf8");
console.log("extracted", all.length, "articles");
const byCat = {};
for (const a of all) (byCat[a.kicker] ||= []).push(a.href);
for (const [k, v] of Object.entries(byCat)) console.log(" ", k.padEnd(12), v.length);
const missing = all.filter(a => !fs.existsSync(a.href));
if (missing.length) console.log("broken links:", missing.map(m => m.href).join(", "));

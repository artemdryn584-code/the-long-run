// Whole-site checks: JSON-LD still parses, every internal link resolves, every
// illustration is labelled, and nothing references an external image or CDN.
import fs from "node:fs";

const files = fs.readdirSync(".").filter(f => f.endsWith(".html") && f !== "_preview.html");
let jsonldBlocks = 0, jsonldBad = [], brokenLinks = [], unlabelled = [], external = [];

for (const f of files) {
  const html = fs.readFileSync(f, "utf8");

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    jsonldBlocks++;
    try {
      JSON.parse(m[1]);
    } catch (e) {
      jsonldBad.push(`${f}: ${e.message.slice(0, 60)}`);
    }
  }

  // strip <script> bodies first: the site search builds href="' + p.u + '" at runtime
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
  for (const m of markup.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|#|data:|tel:)/.test(url)) continue;
    const clean = url.split("#")[0].split("?")[0].replace(/^\//, "");
    if (!clean) continue;
    if (!fs.existsSync(clean)) brokenLinks.push(`${f} -> ${url}`);
  }

  for (const m of html.matchAll(/<figure class="illus">([\s\S]*?)<\/figure>/g)) {
    if (!/role="img"/.test(m[1]) || !/aria-label="/.test(m[1])) unlabelled.push(f);
    if (!/<figcaption>/.test(m[1])) unlabelled.push(f + " (no caption)");
  }

  // images or scripts pulled from somewhere else (fonts are the one allowed exception)
  for (const m of html.matchAll(/<(?:img|script)[^>]*(?:src)="(https?:\/\/[^"]+)"/g)) external.push(`${f} -> ${m[1]}`);
}

const report = (name, list) => console.log(`${name}: ${list.length ? "\n  " + list.join("\n  ") : "clean"}`);
console.log(`pages checked: ${files.length}`);
console.log(`JSON-LD blocks parsed: ${jsonldBlocks}`);
report("invalid JSON-LD", jsonldBad);
report("broken internal links", [...new Set(brokenLinks)]);
report("illustrations missing role/aria-label/caption", [...new Set(unlabelled)]);
report("external img/script", [...new Set(external)]);

const counts = {
  figures: 0, callouts: 0, bars: 0, kickerIcons: 0, catBadges: 0,
};
for (const f of files) {
  const html = fs.readFileSync(f, "utf8");
  counts.figures += (html.match(/<figure class="illus">/g) || []).length;
  counts.callouts += (html.match(/class="callout callout-/g) || []).length;
  counts.bars += (html.match(/class="bar-chart"/g) || []).length;
  counts.kickerIcons += (html.match(/class="cat-icon"/g) || []).length;
  counts.catBadges += (html.match(/class="cat-badge"/g) || []).length;
}
console.log("totals:", counts);

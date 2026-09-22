// Puts the large category mark above the heading on each category page, and
// adds articles.html to the sitemap.
import fs from "node:fs";
import { bareIcon, CATEGORY_OF_ICON } from "./icons.mjs";

const PAGES = {
  "debt.html": "Debt",
  "saving.html": "Saving",
  "investing.html": "Investing",
  "retirement.html": "Retirement",
  "housing.html": "Housing",
  "family.html": "Family",
};

let done = 0;
for (const [file, cat] of Object.entries(PAGES)) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  if (s.includes("cat-badge")) continue;
  const anchor = '    <span class="kicker">';
  const i = s.indexOf(anchor);
  if (i < 0) throw new Error("no kicker in " + file);
  const badge = `    <span class="cat-badge">${bareIcon(CATEGORY_OF_ICON[cat], 48)}</span>\n`;
  s = s.slice(0, i) + badge + s.slice(i);
  fs.writeFileSync(file, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
  done++;
}
console.log("category badges added:", done);

// ---------- sitemap ----------
const raw = fs.readFileSync("sitemap.xml", "utf8");
const crlf = raw.includes("\r\n");
let xml = crlf ? raw.replace(/\r\n/g, "\n") : raw;
if (!xml.includes("articles.html")) {
  const sample = xml.match(/ {2}<url>[\s\S]*?<\/url>/);
  if (!sample) throw new Error("no <url> block to copy the shape from");
  const today = new Date().toISOString().slice(0, 10);
  const entry = `  <url>
    <loc>https://clearcoin.cc/articles.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  xml = xml.replace("</urlset>", `${entry}\n</urlset>`);
  fs.writeFileSync("sitemap.xml", crlf ? xml.replace(/\n/g, "\r\n") : xml, "utf8");
  console.log("sitemap: articles.html added");
} else {
  console.log("sitemap: articles.html already listed");
}
console.log("sitemap urls:", (xml.match(/<loc>/g) || []).length);

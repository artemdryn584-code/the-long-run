// Build the canonical article list from the article pages themselves, so
// articles.html covers everything — not just what the old homepage listed.
import fs from "node:fs";
import { SPECS } from "./specs.mjs";

const CATS = ["Debt", "Saving", "Investing", "Retirement", "Housing", "Family"];
const homeOrder = JSON.parse(fs.readFileSync("_articles.json", "utf8")).map(a => a.href);

const all = Object.keys(SPECS).map(href => {
  const html = fs.readFileSync(href, "utf8").replace(/\r\n/g, "\n");
  const title = (html.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1].replace(/<[^>]*>/g, "").trim();
  const kicker = (html.match(/<span class="kicker">(?:<svg[\s\S]*?<\/svg>)?\s*([A-Za-z ]+)<\/span>/) || [])[1].trim();
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  const meta = (html.match(/<p class="meta">([\s\S]*?)<\/p>/) || [])[1].replace(/<[^>]*>/g, "").trim();
  const dateMatch = meta.match(/([A-Z][a-z]+)\s+(\d+),\s*(\d{4})/);
  const date = dateMatch ? new Date(`${dateMatch[1]} ${dateMatch[2]}, ${dateMatch[3]}`) : new Date(0);
  return { href, title, kicker, dek: desc, meta, date: date.toISOString().slice(0, 10), homeIndex: homeOrder.indexOf(href) };
});

const bad = all.filter(a => !CATS.includes(a.kicker));
if (bad.length) console.log("unexpected category:", bad.map(b => `${b.href}=${b.kicker}`).join(", "));

fs.writeFileSync("_all-articles.json", JSON.stringify(all, null, 2), "utf8");
console.log("articles:", all.length);
for (const c of CATS) console.log(" ", c.padEnd(11), all.filter(a => a.kicker === c).length);
console.log("not on the old homepage:", all.filter(a => a.homeIndex === -1).map(a => a.href).join(", "));

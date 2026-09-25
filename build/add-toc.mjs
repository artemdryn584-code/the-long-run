// Adds an "On this page" table of contents to the content articles that lack
// one, matching the markup the other 25 articles already use:
//   <div class="side-box toc"><h2>On this page</h2><ul>…</ul></div>
// It only lists the article's own section headings — not Key takeaways,
// Related reading, About the author or the FAQ — and gives each an id to
// anchor to. Idempotent: an article that already has a TOC is skipped.
import fs from "node:fs";

const TARGETS = [
  "after-paying-off-credit-card.html",
  "article.html",
  "best-high-yield-savings-accounts.html",
  "budget-that-survives-real-life.html",
  "cost-of-living-by-state.html",
  "holiday-budget-guide.html",
  "robo-advisors-for-beginners.html",
  "robo-advisors-vs-diy.html",
  "tax-season-checklist.html",
];

// headings that mark the end of the body / are not content sections
const STOP = /^(Related reading|About the author|Frequently asked questions|On this page|Key takeaways|Topics|Site)$/;

const decode = s =>
  s.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const slugify = html => {
  const text = decode(html.replace(/<[^>]*>/g, ""));
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

let done = 0;
for (const file of TARGETS) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  if (s.includes('class="side-box toc"') || s.includes("On this page")) {
    console.log("skip (already has TOC):", file);
    continue;
  }

  const lines = s.split("\n");
  const artStart = lines.findIndex(l => l.includes('<article class="article"'));
  const artEnd = lines.findIndex((l, i) => i > artStart && l.includes("</article>"));
  if (artStart < 0 || artEnd < 0) { console.warn("no article in", file); continue; }

  // collect content h2s: two-space-indented <h2> lines that are not a stop section
  // and not already inside a side-box (those are deeper-indented)
  const items = [];
  let insertAt = -1;
  let insideSideBox = 0;
  for (let i = artStart; i < artEnd; i++) {
    const l = lines[i];
    if (/<div class="side-box/.test(l)) insideSideBox++;
    // a plain content <h2> sits at exactly 2-space indent
    const m = l.match(/^  <h2>(.+?)<\/h2>\s*$/);
    if (m && !STOP.test(decode(m[1].replace(/<[^>]*>/g, "")).trim())) {
      const id = slugify(m[1]);
      lines[i] = `  <h2 id="${id}">${m[1]}</h2>`;
      items.push({ id, label: m[1] });
      if (insertAt < 0) insertAt = i;
    }
  }

  if (items.length < 4) { console.log(`skip (${items.length} content h2):`, file); continue; }

  const toc = [
    '  <div class="side-box toc">',
    "    <h2>On this page</h2>",
    "    <ul>",
    ...items.map(it => `      <li><a href="#${it.id}">${it.label}</a></li>`),
    "    </ul>",
    "  </div>",
    "",
  ];
  // insert the TOC just before the first content heading (its index shifted by 0 since we edit in place)
  lines.splice(insertAt, 0, ...toc);

  s = lines.join("\n");
  fs.writeFileSync(file, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
  console.log(`${file}: TOC with ${items.length} items`);
  done++;
}
console.log("articles updated:", done);

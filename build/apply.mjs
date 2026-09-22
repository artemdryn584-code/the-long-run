// Inserts the category icons, the per-article illustration, the CSS bar charts
// and the callouts. Idempotent: running it twice changes nothing, because every
// insertion is guarded by a marker that is already in the file.
import fs from "node:fs";
import { SPECS } from "./specs.mjs";
import { inlineIcon, CATEGORY_OF_ICON } from "./icons.mjs";

const report = { icons: 0, illus: 0, bars: 0, callouts: 0, byType: {}, perArticle: {} };

// ---------- category icon inside the .kicker badge ----------
function addKickerIcons(html) {
  let n = 0;
  const out = html.replace(/<span class="kicker">([^<]+)<\/span>/g, (m, text) => {
    const key = CATEGORY_OF_ICON[text.trim()];
    if (!key) return m; // "Calculator", "Free tool", "Clearcoin Plus" etc. have no icon
    n++;
    return `<span class="kicker">${inlineIcon(key)}${text}</span>`;
  });
  report.icons += n;
  return out;
}

// ---------- callouts, built out of paragraphs already in the article ----------
const RULES = [
  {
    type: "warning",
    label: "⚠️ Watch out",
    // the sentences where getting it wrong costs money
    test: t =>
      /(backfires?|penalt\w+|permanently|forfeit\w*|irreversible|the most common (failure|mistake)|common failure mode|quietly|a trap|undoes|locking in|misleading|the catch|watch out|gives? up|no longer|can't be undone|easy to lose track|wipes? out|the risk|downside|be careful|isn't worth|rarely worth|costly)/i.test(
        t
      ),
  },
  {
    type: "example",
    label: "🧮 Example",
    // a worked number, not a general claim
    test: t =>
      (t.match(/\$[\d,]/g) || []).length >= 2 ||
      /\$[\d,]+[^.]*\b(a month|per month|a year|per year|each month|of that)\b/i.test(t) ||
      (/\b(for example|a quick example|say you|imagine|suppose|picture)\b/i.test(t) && /\d/.test(t)),
  },
  {
    type: "tip",
    label: "💡 Tip",
    test: t =>
      /(rule of thumb|the simplest|easiest|start with|a good (rule|first step|place to start)|worth doing|the trick|in practice|one habit|if you'?d rather|start by|begin by|one way to|the practical|a practical|makes next year easier|worth checking|worth confirming|is worth|the useful|keep it|the fix is|the move is)/i.test(
        t
      ),
  },
];

function wrapCallout(line, rule) {
  return `  <div class="callout callout-${rule.type}">
    <span class="callout-label">${rule.label}</span>
  ${line.trim()}
  </div>`;
}

// ---------- bar chart markup ----------
function barChart(spec) {
  const rows = spec.rows
    .map(
      r => `    <div class="bar">
      <span class="bar-label">${r.label}</span>
      <span class="bar-track"><span class="bar-fill${r.muted ? " is-muted" : ""}" style="width:${r.pct}%"></span></span>
      <span class="bar-value">${r.value}</span>
    </div>`
    )
    .join("\n");
  return `  <div class="bar-chart">
    <h3>${spec.title}</h3>
${rows}
${spec.note ? `    <p class="bar-note">${spec.note}</p>` : ""}
  </div>`;
}

// ---------- per-file work ----------
function processArticle(file) {
  const raw = fs.readFileSync(file, "utf8");
  // the repo checks out with CRLF on Windows; work in LF and put it back on write
  const crlf = raw.includes("\r\n");
  let html = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  const before = html;
  html = addKickerIcons(html);

  const spec = SPECS[file];
  const lines = html.split("\n");

  // body paragraphs: a <p> on its own line inside the article, not the byline
  const isBody = l => /^ {2}<p>.*<\/p>$/.test(l);
  const candidates = [];
  let inArticle = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<article class="article"')) inArticle = true;
    if (lines[i].includes("</article>")) inArticle = false;
    if (inArticle && isBody(lines[i])) candidates.push(i);
  }

  const inserts = []; // { at, text } — applied back to front

  if (spec && spec.illus && !html.includes('<figure class="illus">')) {
    const at = candidates[Math.min(1, candidates.length - 1)];
    if (at !== undefined) {
      inserts.push({ at, text: spec.illus.split("\n").map(l => "  " + l).join("\n") });
      report.illus++;
      const type = spec.illus.match(/aria-label/) ? (spec.illusType || "") : "";
    }
  }

  if (spec && spec.bars && !html.includes('class="bar-chart"')) {
    const at = candidates[Math.min(4, candidates.length - 1)];
    if (at !== undefined) {
      inserts.push({ at, text: barChart(spec.bars) });
      report.bars++;
    }
  }

  // callouts — at most one of each kind, and only from paragraphs we are not
  // already using as an insertion anchor
  let calloutCount = 0;
  if (!html.includes('class="callout')) {
    const used = new Set(inserts.map(i => i.at));
    const taken = new Set();

    // articles whose phrasing the rules below do not catch name their paragraphs
    // explicitly in specs.mjs
    for (const c of (spec && spec.callouts) || []) {
      const i = candidates.find(j => lines[j].includes(c.anchor));
      if (i === undefined) continue;
      const rule = RULES.find(r => r.type === c.type);
      lines[i] = wrapCallout(lines[i], rule);
      taken.add(rule.type);
      used.add(i);
      calloutCount++;
    }

    for (const i of candidates) {
      // a paragraph can be both a callout and the anchor a figure is inserted after:
      // the figure lands below the whole block, which still reads correctly
      if (i === candidates[0]) continue; // leave the opening hook alone
      const text = lines[i].replace(/<[^>]*>/g, "");
      if (text.length < 80) continue; // too short to stand alone in a box
      const rule = RULES.find(r => !taken.has(r.type) && r.test(text));
      if (!rule) continue;
      taken.add(rule.type);
      lines[i] = wrapCallout(lines[i], rule);
      calloutCount++;
      if (taken.size === RULES.length) break;
    }
  }
  report.callouts += calloutCount;

  for (const ins of inserts.sort((a, b) => b.at - a.at)) {
    lines.splice(ins.at + 1, 0, ins.text);
  }

  const result = lines.join("\n");
  if (result !== before) fs.writeFileSync(file, crlf ? result.replace(/\n/g, "\r\n") : result, "utf8");
  if (spec) report.perArticle[file] = { illus: !!spec.illus, bars: !!spec.bars, callouts: calloutCount };
  return result !== before;
}

// ---------- run ----------
const files = fs.readdirSync(".").filter(f => f.endsWith(".html") && f !== "_preview.html");
let changed = 0;
for (const f of files) if (processArticle(f)) changed++;

console.log(`files touched: ${changed}`);
console.log(`category icons inserted: ${report.icons}`);
console.log(`illustrations: ${report.illus}`);
console.log(`bar charts: ${report.bars}`);
console.log(`callouts: ${report.callouts}`);
const noCallout = Object.entries(report.perArticle).filter(([, v]) => v.callouts === 0).map(([k]) => k);
if (noCallout.length) console.log(`articles with no callout yet: ${noCallout.join(", ")}`);
const missing = Object.keys(SPECS).filter(f => !fs.existsSync(f));
if (missing.length) console.log(`spec points at a missing file: ${missing.join(", ")}`);

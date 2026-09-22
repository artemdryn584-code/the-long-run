// Dry run: for every article, show which paragraph each callout rule would pick.
// Lets the rules be tuned without touching the files.
import fs from "node:fs";
import { SPECS } from "./specs.mjs";

const RULES = [
  {
    type: "warning",
    test: t =>
      /(backfires?|penalt\w+|permanently|forfeit\w*|irreversible|the most common (failure|mistake)|common failure mode|quietly|a trap|undoes|locking in|misleading|the catch|watch out|gives? up|no longer|easy to lose track|wipes? out|the risk|downside|be careful|don't|doesn't|won't|isn't worth|rarely worth|costly)/i.test(
        t
      ),
  },
  {
    type: "example",
    test: t =>
      (t.match(/\$[\d,]/g) || []).length >= 2 ||
      /\$[\d,]+[^.]*\b(a month|per month|a year|per year|each month|of that)\b/i.test(t) ||
      (/\b(for example|a quick example|say you|imagine|suppose|picture)\b/i.test(t) && /\d/.test(t)),
  },
  {
    type: "tip",
    test: t =>
      /(rule of thumb|the simplest|easiest|start with|a good (rule|first step|place to start)|worth doing|the trick|in practice|one habit|if you'?d rather|start by|begin by|one way to|the practical|a practical|makes next year easier|worth checking|worth confirming|is worth|the useful|keep it|the fix is|the move is)/i.test(
        t
      ),
  },
];

let none = [];
let tally = { warning: 0, example: 0, tip: 0 };
for (const file of Object.keys(SPECS)) {
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const lines = raw.split("\n");
  let inArticle = false;
  const cands = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<article class="article"')) inArticle = true;
    if (lines[i].includes("</article>")) inArticle = false;
    if (inArticle && /^ {2}<p>.*<\/p>$/.test(lines[i])) cands.push(i);
  }
  const hits = [];
  const taken = new Set();
  for (const i of cands.slice(1)) {
    const text = lines[i].replace(/<[^>]*>/g, "");
    if (text.length < 80) continue;
    const rule = RULES.find(r => !taken.has(r.type) && r.test(text));
    if (!rule) continue;
    taken.add(rule.type);
    tally[rule.type]++;
    hits.push(`${rule.type}: ${text.slice(0, 58)}…`);
  }
  if (!hits.length) none.push(`${file} (${cands.length} paragraphs)`);
  else console.log(`\n${file}  [${hits.length}]`), hits.forEach(h => console.log("   " + h));
}
console.log("\n=== tally ===", tally, "total", tally.warning + tally.example + tally.tip);
console.log("no match:", none.length ? none.join("\n           ") : "none");

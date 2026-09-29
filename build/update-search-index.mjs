// Adds the new guide/article pages to the site-search index (CLEARCOIN_PAGES),
// which is a static array baked into every page's search script. Idempotent:
// an entry is only inserted if its URL isn't already in the array.
import fs from "node:fs";

const NEW = [
  ["How to Make a Budget (Step by Step)", "Saving", "how-to-make-a-budget.html"],
  ["How to Build Credit From Scratch", "Debt", "how-to-build-credit.html"],
  ["How to Start Investing With $100", "Investing", "how-to-start-investing.html"],
  ["Roth IRA vs. 401(k): Which Comes First?", "Retirement", "roth-ira-vs-401k.html"],
  ["HSA vs. FSA, Explained", "Family", "hsa-vs-fsa.html"],
  ["How to Save for a Down Payment", "Housing", "how-to-save-for-a-down-payment.html"],
  ["How to Negotiate a Raise", "Saving", "how-to-negotiate-a-raise.html"],
  ["Credit Score Ranges, Explained", "Debt", "credit-score-ranges-explained.html"],
  ["The 50/30/20 Budget Rule", "Saving", "50-30-20-budget-rule.html"],
  ["Why Warren Buffett Says Buy Index Funds", "Investing", "warren-buffett-index-funds.html"],
  ["5 Lessons From The Psychology of Money", "Saving", "psychology-of-money-lessons.html"],
  ["Dave Ramsey's Baby Steps & Debt Snowball", "Debt", "dave-ramsey-baby-steps.html"],
  ["The Simple Path to Wealth (JL Collins)", "Investing", "jl-collins-simple-path-to-wealth.html"],
  ["Ramit Sethi's Rich Life Approach", "Saving", "ramit-sethi-rich-life.html"],
  ["Benjamin Graham's Value Investing", "Investing", "benjamin-graham-value-investing.html"],
  ["Your Money or Your Life", "Saving", "your-money-or-your-life.html"],
  ["Peter Lynch: Invest in What You Know", "Investing", "peter-lynch-invest-in-what-you-know.html"]
];

const files = fs.readdirSync(".").filter(f => f.endsWith(".html"));
let done = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  if (s.indexOf("CLEARCOIN_PAGES") === -1) continue;

  const m = s.match(/(CLEARCOIN_PAGES\s*=\s*\[)([\s\S]*?)(\n\s*\];)/);
  if (!m) continue;
  let body = m[2];

  const toAdd = NEW.filter(([, , u]) => body.indexOf('"' + u + '"') === -1);
  if (toAdd.length === 0) continue;

  const add = toAdd
    .map(([t, k, u]) => `  { t: ${JSON.stringify(t)}, k: ${JSON.stringify(k)}, u: ${JSON.stringify(u)} }`)
    .join(",\n");

  const newBody = body.replace(/\s*$/, "") + ",\n" + add + "\n";
  s = s.slice(0, m.index) + m[1] + newBody + m[3] + s.slice(m.index + m[0].length);

  fs.writeFileSync(file, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
  done++;
}
console.log("search index updated on", done, "pages");

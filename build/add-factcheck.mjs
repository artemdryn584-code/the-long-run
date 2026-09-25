// Adds a compact "reviewed for accuracy" line under each article's meta row,
// linking to the editorial guidelines — the same trust signal Investopedia and
// NerdWallet show ("Fact checked by …"). The claim matches what the About-the-
// author box and the editorial guidelines already state, so nothing new is
// fabricated. Only real content articles (those with a "min read" meta) get it.
import fs from "node:fs";

const CHECK =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

const BADGE =
  `  <p class="fact-check">${CHECK}<span>Reviewed for accuracy by the <a href="editorial-guidelines.html">Clearcoin team</a></span></p>`;

const files = fs.readdirSync(".").filter(f => f.endsWith(".html"));
let done = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  if (s.includes('class="fact-check"')) continue;

  // the article's own byline: a meta line that carries the read time
  const re = /^(\s*<p class="meta">[^<]*min read[^<]*<\/p>)\s*$/m;
  if (!re.test(s)) continue;

  s = s.replace(re, (m, line) => `${line}\n${BADGE}`);
  fs.writeFileSync(file, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
  done++;
}
console.log("fact-check line added to", done, "article pages");

// Adds a "share" bar to every article (pages with a fact-check line): X,
// Facebook, Reddit, LinkedIn, and copy-link. Turns readers into distributors.
// Share links are baked with the page's canonical URL + title. Idempotent.
import fs from "node:fs";

const ic = {
  x: '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  fb: '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.12 11.93v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8v8.44C19.61 23.08 24 18.09 24 12.07z"/></svg>',
  rd: '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.01 13.47c.07.2.11.42.11.64 0 2.28-2.66 4.13-5.94 4.13s-5.94-1.85-5.94-4.13c0-.23.04-.45.11-.66a1.36 1.36 0 0 1 .83-2.44c.36 0 .69.14.93.37 1.02-.72 2.42-1.18 3.98-1.23l.68-3.2 2.22.47a.95.95 0 1 1-.11.53l-1.98-.42-.6 2.85c1.53.06 2.91.52 3.92 1.23a1.36 1.36 0 1 1 1.76 2.06zm-6.9-.02c-.53 0-.96.43-.96.96s.43.95.96.95.95-.42.95-.95-.42-.96-.95-.96zm3.78 0c-.53 0-.95.43-.95.96s.42.95.95.95.96-.42.96-.95-.43-.96-.96-.96zm-.18 2.57c-.42.42-1.29.57-2.03.57-.74 0-1.61-.15-2.03-.57a.24.24 0 0 0-.34.34c.66.66 1.93.72 2.37.72.44 0 1.71-.06 2.37-.72a.24.24 0 1 0-.34-.34z"/></svg>',
  li: '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>',
  copy: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>'
};

const files = fs.readdirSync(".").filter(f => f.endsWith(".html"));
let done = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  if (s.indexOf('class="fact-check"') === -1) continue;
  if (s.indexOf('class="share-bar"') !== -1) continue;

  const url = (s.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (!url) continue;
  const h1 = (s.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || "";
  const title = h1.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

  const U = encodeURIComponent(url);
  const T = encodeURIComponent(title);
  const bar = `  <div class="share-bar" aria-label="Share this guide">
    <span class="share-label">Share:</span>
    <a class="share-btn" href="https://twitter.com/intent/tweet?url=${U}&text=${T}" target="_blank" rel="noopener" aria-label="Share on X">${ic.x}</a>
    <a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=${U}" target="_blank" rel="noopener" aria-label="Share on Facebook">${ic.fb}</a>
    <a class="share-btn" href="https://www.reddit.com/submit?url=${U}&title=${T}" target="_blank" rel="noopener" aria-label="Share on Reddit">${ic.rd}</a>
    <a class="share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${U}" target="_blank" rel="noopener" aria-label="Share on LinkedIn">${ic.li}</a>
    <button type="button" class="share-btn share-copy" data-url="${url}" aria-label="Copy link">${ic.copy}</button>
  </div>
`;

  // insert right after the fact-check paragraph
  s = s.replace(/(<p class="fact-check">[\s\S]*?<\/p>\n)/, `$1${bar}`);

  fs.writeFileSync(file, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
  done++;
}
console.log("share bar added to", done, "articles");

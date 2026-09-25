// style.css is linked by a bare filename, so a browser holding an older copy
// keeps using it after a deploy — the page arrives new, the stylesheet does
// not, and the layout falls apart until the cache expires.
//
// Stamping the link with a hash of the file's contents gives every CSS change
// its own URL, so the pair can never go out of step. The hash only changes
// when style.css does.
import fs from "node:fs";
import crypto from "node:crypto";

const css = fs.readFileSync("style.css");
const hash = crypto.createHash("sha1").update(css).digest("hex").slice(0, 8);

const files = fs.readdirSync(".").filter(f => f.endsWith(".html"));
let touched = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  const before = s;

  s = s.replace(/href="style\.css(?:\?v=[a-f0-9]+)?"/g, `href="style.css?v=${hash}"`);

  if (s !== before) {
    fs.writeFileSync(file, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
    touched++;
  }
}

console.log(`style.css?v=${hash} — stamped on ${touched} pages`);

const missing = files.filter(f => {
  const s = fs.readFileSync(f, "utf8");
  return s.includes("style.css") && !s.includes(`style.css?v=${hash}`);
});
console.log("pages still pointing at an unversioned stylesheet:", missing.length ? missing.join(", ") : "none");

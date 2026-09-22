// Undo callouts on pages that are not guides: a glossary definition or the
// about page's mission paragraph should not be a tip box.
import fs from "node:fs";

for (const file of process.argv.slice(2)) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  const before = s;
  s = s.replace(
    /^ *<div class="callout callout-\w+">\n *<span class="callout-label">[^<]*<\/span>\n( *<p>[\s\S]*?<\/p>)\n *<\/div>$/gm,
    (m, p) => "  " + p.trim()
  );
  const removed = (before.match(/class="callout callout-/g) || []).length - (s.match(/class="callout callout-/g) || []).length;
  fs.writeFileSync(file, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
  console.log(file, "callouts removed:", removed, "| left:", (s.match(/class="callout callout-/g) || []).length);
}

// Wraps the brand name "Clearcoin" in a <span translate="no"> so Google
// Translate leaves it untranslated (otherwise it becomes "Прозрачный монета"
// etc.). Only touches visible text in the <body>: script/style blocks are
// stashed out first, the <head> is left alone, and text inside tags/attributes
// is never matched (we only rewrite text between ">" and "<"). Idempotent.
import fs from "node:fs";

const SPAN = '<span translate="no" class="notranslate">Clearcoin</span>';
const files = fs.readdirSync(".").filter(f => f.endsWith(".html"));
let done = 0;

for (const f of files) {
  const raw = fs.readFileSync(f, "utf8");
  const crlf = raw.includes("\r\n");
  let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;

  const headEnd = s.indexOf("</head>");
  if (headEnd < 0) continue;
  let head = s.slice(0, headEnd);
  let body = s.slice(headEnd);

  // protect <script> and <style> blocks (JSON-LD, JS, CSS) from any rewriting
  const stash = [];
  body = body.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, (m) => {
    stash.push(m);
    return "\u0000" + (stash.length - 1) + "\u0000";
  });

  // rewrite only text nodes (between ">" and "<"); skip ones already wrapped
  body = body.replace(/>([^<]+)</g, (m, txt) => {
    if (txt.indexOf("Clearcoin") === -1) return m;
    return ">" + txt.replace(/Clearcoin/g, SPAN) + "<";
  });

  // restore scripts/styles
  body = body.replace(/\u0000(\d+)\u0000/g, (m, i) => stash[+i]);

  let out = head + body;
  if (out !== s) {
    fs.writeFileSync(f, crlf ? out.replace(/\n/g, "\r\n") : out, "utf8");
    done++;
  }
}
console.log("brand protected on", done, "pages");

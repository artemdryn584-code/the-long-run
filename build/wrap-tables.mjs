// Comparison tables are wider than a phone screen. Wrapping each one in a
// scroll container keeps the table readable by swiping it, instead of the
// whole page scrolling sideways.
import fs from "node:fs";

const files = fs.readdirSync(".").filter(f => f.endsWith(".html"));
let wrapped = 0, touched = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  const before = s;

  s = s.replace(/([ \t]*)(<table class="compare-table">[\s\S]*?<\/table>)/g, (m, indent, table) => {
    if (m.includes("table-scroll")) return m;
    wrapped++;
    return `${indent}<div class="table-scroll">\n${table
      .split("\n")
      .map(l => (l.trim() ? "  " + indent + l.replace(/^[ \t]*/, "") : l))
      .join("\n")}\n${indent}</div>`;
  });

  if (s !== before) {
    fs.writeFileSync(file, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
    touched++;
  }
}

console.log(`tables wrapped: ${wrapped} across ${touched} pages`);

// nothing left unwrapped?
let loose = 0;
for (const file of files) {
  const s = fs.readFileSync(file, "utf8");
  for (const m of s.matchAll(/<table class="compare-table">/g)) {
    const head = s.slice(Math.max(0, m.index - 220), m.index);
    if (!head.includes("table-scroll")) loose++;
  }
}
console.log("tables still not in a scroll container:", loose);

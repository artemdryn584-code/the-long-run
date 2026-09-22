// Every inline SVG gets explicit width/height attributes taken from its own
// viewBox. CSS still wins (figures stay width:100%), but without this an SVG
// that has only a viewBox has no intrinsic size — so if style.css is stale in
// someone's cache, or fails to load, the icon expands to fill the container.
import fs from "node:fs";

const files = fs.readdirSync(".").filter(f => f.endsWith(".html"));
let fixed = 0, touched = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  const before = s;

  s = s.replace(/<svg\b([^>]*)>/g, (tag, attrs) => {
    // a leading space is required: \bwidth= would also match stroke-width=
    if (/\swidth=/.test(attrs) || /\sheight=/.test(attrs)) return tag;
    const vb = attrs.match(/viewBox="([\d.\s-]+)"/);
    if (!vb) return tag;
    const parts = vb[1].trim().split(/\s+/).map(Number);
    if (parts.length !== 4) return tag;
    const [, , w, h] = parts;
    fixed++;
    return `<svg${attrs} width="${w}" height="${h}">`;
  });

  if (s !== before) {
    fs.writeFileSync(file, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
    touched++;
  }
}
console.log(`svgs given explicit dimensions: ${fixed} across ${touched} files`);

// any left without a size?
let remaining = 0;
for (const file of files) {
  for (const m of fs.readFileSync(file, "utf8").matchAll(/<svg\b([^>]*)>/g)) {
    if (!/\swidth=/.test(m[1])) remaining++;
  }
}
console.log("svgs still without a width attribute:", remaining);

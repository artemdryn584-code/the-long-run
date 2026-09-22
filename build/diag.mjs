import fs from "node:fs";
import { SPECS } from "./specs.mjs";

for (const file of Object.keys(SPECS)) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  let inArticle = false;
  const cands = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<article class="article"')) inArticle = true;
    if (lines[i].includes("</article>")) inArticle = false;
    if (inArticle && /^ {2}<p>.*<\/p>$/.test(lines[i])) cands.push(i);
  }
  if (cands.length < 5) {
    console.log(file.padEnd(40), "candidates:", cands.length);
    // show what the paragraphs actually look like
    const sample = lines.filter(l => l.trimStart().startsWith("<p>")).slice(0, 3);
    for (const s of sample) console.log("      |" + s.slice(0, 70).replace(/\n/g, ""));
  }
}

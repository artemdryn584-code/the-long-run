import fs from "node:fs";
const files = process.argv.slice(2);
for (const file of files) {
  const lines = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n").split("\n");
  let inArticle = false;
  console.log("\n########", file);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<article class="article"')) inArticle = true;
    if (lines[i].includes("</article>")) inArticle = false;
    if (inArticle && /^ {2}<p>.*<\/p>$/.test(lines[i])) {
      console.log("  -", lines[i].replace(/<[^>]*>/g, "").slice(0, 155));
    }
  }
}

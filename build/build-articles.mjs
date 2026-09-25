// Rebuilds articles.html as a filterable card grid grouped by category.
// The filter is plain JS over data-category attributes — no reload, no library.
import fs from "node:fs";
import { bareIcon, CATEGORY_OF_ICON } from "./icons.mjs";
import { SPECS } from "./specs.mjs";

const CATS = ["Debt", "Saving", "Investing", "Retirement", "Housing", "Family"];

const all = Object.keys(SPECS).map(href => {
  const html = fs.readFileSync(href, "utf8").replace(/\r\n/g, "\n");
  const title = (html.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1].replace(/<[^>]*>/g, "").trim();
  const kicker = (html.match(/<span class="kicker">(?:<svg[\s\S]*?<\/svg>)?\s*([A-Za-z ]+)<\/span>/) || [])[1].trim();
  const dek = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  const meta = (html.match(/<p class="meta">([\s\S]*?)<\/p>/) || [])[1].replace(/<[^>]*>/g, "").trim();
  const d = meta.match(/([A-Z][a-z]+)\s+(\d+),\s*(\d{4})/);
  return {
    href, title, kicker, dek, meta,
    date: d ? new Date(`${d[1]} ${d[2]}, ${d[3]}`).toISOString().slice(0, 10) : "",
  };
});

const smallIcon = name => bareIcon(CATEGORY_OF_ICON[name], 15).replace("<svg ", '<svg class="cat-icon" ');

const card = a => `        <article class="card" data-category="${a.kicker}">
          <span class="kicker">${smallIcon(a.kicker)}${a.kicker}</span>
          <h3><a href="${a.href}">${a.title}</a></h3>
          <p class="dek">${a.dek}</p>
          <p class="meta">${a.meta}</p>
        </article>`;

const blocks = CATS.map(cat => {
  const list = all.filter(a => a.kicker === cat).sort((x, y) => (x.date < y.date ? 1 : -1));
  return `    <section class="cat-block" data-block="${cat}">
      <div class="cat-block-head">
        ${bareIcon(CATEGORY_OF_ICON[cat], 22)}
        <h2 id="${cat.toLowerCase()}">${cat}</h2>
        <span class="count">${list.length} guides</span>
      </div>
      <div class="articles-grid">
${list.map(card).join("\n")}
      </div>
    </section>`;
}).join("\n\n");

const chips = ["All", ...CATS]
  .map(
    (c, i) =>
      `      <button type="button" class="chip" data-filter="${c}" aria-pressed="${i === 0 ? "true" : "false"}">${
        c === "All" ? "" : smallIcon(c).replace('class="cat-icon" ', "")
      }${c}</button>`
  )
  .join("\n");

const BODY = `<article class="article article-index" id="main">
    <span class="kicker">Index</span>
    <h1>All guides</h1>
    <p class="meta">${all.length} guides across ${CATS.length} topics</p>

    <p>Everything published on Clearcoin, grouped by topic. Each one walks through a single decision in plain English.</p>

    <div class="filter-chips" role="group" aria-label="Filter guides by topic">
${chips}
    </div>
    <p class="articles-empty" id="articles-empty" hidden>Nothing in that topic yet.</p>

${blocks}
  </article>`;

const SCRIPT = `<script>
/* Category filter for the articles index — shows and hides whole blocks. */
(function () {
  var chips = [].slice.call(document.querySelectorAll('.chip[data-filter]'));
  var blocks = [].slice.call(document.querySelectorAll('.cat-block'));
  var empty = document.getElementById('articles-empty');
  if (!chips.length || !blocks.length) return;

  function apply(filter) {
    var shown = 0;
    blocks.forEach(function (b) {
      var match = filter === 'All' || b.getAttribute('data-block') === filter;
      b.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.hidden = shown > 0;
    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === filter));
    });
    try {
      var url = new URL(window.location.href);
      if (filter === 'All') url.searchParams.delete('topic');
      else url.searchParams.set('topic', filter);
      history.replaceState(null, '', url);
    } catch (e) {}
  }

  chips.forEach(function (c) {
    c.addEventListener('click', function () { apply(c.getAttribute('data-filter')); });
  });

  /* deep links like articles.html?topic=Debt */
  try {
    var wanted = new URL(window.location.href).searchParams.get('topic');
    if (wanted && chips.some(function (c) { return c.getAttribute('data-filter') === wanted; })) apply(wanted);
  } catch (e) {}
})();
</script>`;

const file = "articles.html";
const raw = fs.readFileSync(file, "utf8");
const crlf = raw.includes("\r\n");
let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;

const a = s.indexOf('<article class="article');
const b = s.lastIndexOf("</article>");
if (a < 0 || b < 0) throw new Error("article element not found in articles.html");
s = s.slice(0, a) + BODY + s.slice(b + "</article>".length);

if (!s.includes("Category filter for the articles index")) {
  s = s.replace("</body>", `${SCRIPT}\n</body>`);
}

fs.writeFileSync(file, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
console.log("articles.html rebuilt:", all.length, "cards,", CATS.length, "blocks,", chips.split("\n").length, "chips");

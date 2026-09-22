// Rebuilds index.html as a set of sections and creates articles.html.
// The head, masthead, sidebar boxes, footer and scripts are lifted verbatim out
// of the existing page so nothing (analytics, JSON-LD, nav, cookie banner) is lost.
import fs from "node:fs";
import { bareIcon, CATEGORY_OF_ICON } from "./icons.mjs";

const CATS = [
  { name: "Debt", href: "debt.html", blurb: "Payoff order, consolidation, student loans." },
  { name: "Saving", href: "saving.html", blurb: "Emergency funds, sinking funds, where to keep cash." },
  { name: "Investing", href: "investing.html", blurb: "Index funds, risk, robo-advisors." },
  { name: "Retirement", href: "retirement.html", blurb: "401(k) matches, rollovers, catching up." },
  { name: "Housing", href: "housing.html", blurb: "Renting vs. buying, affordability, refinancing." },
  { name: "Family", href: "family.html", blurb: "Budgets, kids, insurance, splitting money." },
];

const all = JSON.parse(fs.readFileSync("_all-articles.json", "utf8"));
const src = fs.readFileSync("index.html", "utf8").replace(/\r\n/g, "\n");

const slice = (from, to) => {
  const a = src.indexOf(from);
  const b = src.indexOf(to, a);
  if (a < 0 || b < 0) throw new Error(`could not find ${from} .. ${to}`);
  return src.slice(a, b + to.length);
};

const head = slice("<!DOCTYPE html>", "</head>");
const masthead = slice('<header class="masthead">', "</header>");
const aside = slice("    <aside>", "    </aside>");
const tail = src.slice(src.indexOf("<footer>"));

// ---------- hero artwork ----------
const heroArt = `<svg viewBox="0 0 420 320" role="img" aria-label="A stylised coin with a rising line behind it.">
        <circle cx="300" cy="86" r="70" class="illus-tint"/>
        <path d="M40 250 L120 196 L190 226 L268 140 L340 96" class="illus-stroke-accent" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="40" cy="250" r="9" class="illus-accent"/>
        <circle cx="120" cy="196" r="9" class="illus-accent"/>
        <circle cx="190" cy="226" r="9" class="illus-accent"/>
        <circle cx="268" cy="140" r="9" class="illus-accent"/>
        <circle cx="152" cy="118" r="64" class="illus-accent"/>
        <circle cx="152" cy="118" r="49" class="illus-paper"/>
        <text x="152" y="134" text-anchor="middle" class="illus-accent" font-size="52" font-weight="800" font-family="Inter, sans-serif">$</text>
        <rect x="36" y="284" width="348" height="12" rx="6" class="illus-tint"/>
      </svg>`;

const featuredArt = `<svg viewBox="0 0 320 200" role="img" aria-label="Four rising steps, standing for the four stages of an emergency fund.">
          ${[0, 1, 2, 3]
            .map(i => {
              const h = 34 + i * 34;
              const x = 24 + i * 72;
              return `<rect x="${x}" y="${170 - h}" width="56" height="${h}" rx="8" class="${i === 3 ? "illus-accent" : "illus-tint"}"/>`;
            })
            .join("\n          ")}
          <line x1="16" y1="176" x2="304" y2="176" class="illus-line" stroke-width="2"/>
        </svg>`;

// ---------- small tool icons ----------
const TOOL_ICON = {
  shield: `<path d="M12 3 4.5 6.2v5.1c0 4.4 3.1 8.4 7.5 9.6 4.4-1.2 7.5-5.2 7.5-9.6V6.2Z"/><path d="M9 12.2l2.1 2.1L15.4 10"/>`,
  down: `<polyline points="3 7 9.5 13.5 13.5 9.5 21 17"/><polyline points="21 11 21 17 15 17"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.4 2"/>`,
  curve: `<path d="M3 19c6 0 8-3 10-7s4-7 8-7"/><path d="M3 19h18"/>`,
  quiz: `<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.4v.4"/><circle cx="12" cy="16.8" r=".9" fill="currentColor" stroke="none"/>`,
};
// width/height are spelled out so the icon still has a size if style.css is
// stale in a cache or fails to load; the CSS rule overrides them anyway
const toolIcon = k =>
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TOOL_ICON[k]}</svg>`;

const TOOLS = [
  { href: "emergency-fund-calculator.html", icon: "shield", name: "Emergency fund", note: "How big should yours be?" },
  { href: "debt-payoff-calculator.html", icon: "down", name: "Debt payoff", note: "See your payoff date" },
  { href: "401k-calculator.html", icon: "clock", name: "401(k) growth", note: "Project the balance" },
  { href: "compound-interest-calculator.html", icon: "curve", name: "Compound interest", note: "Watch it compound" },
  { href: "money-personality-quiz.html", icon: "quiz", name: "Money personality", note: "A 2-minute quiz" },
];

// ---------- sections ----------
const counts = Object.fromEntries(CATS.map(c => [c.name, all.filter(a => a.kicker === c.name).length]));

const topicGrid = CATS.map(
  c => `      <a class="topic-card" href="${c.href}">
        <span class="topic-icon">${bareIcon(CATEGORY_OF_ICON[c.name])}</span>
        <h3>${c.name}</h3>
        <p>${c.blurb}</p>
        <span class="topic-count">${counts[c.name]} guides →</span>
      </a>`
).join("\n");

const toolRow = TOOLS.map(
  t => `      <a class="tool-card" href="${t.href}">
        ${toolIcon(t.icon)}
        <strong>${t.name}</strong>
        <span>${t.note}</span>
      </a>`
).join("\n");

const featured = all.find(a => a.href === "article.html");

// latest = newest first, then whatever order the old homepage used
const latest = [...all]
  .sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : (a.homeIndex < 0 ? 99 : a.homeIndex) - (b.homeIndex < 0 ? 99 : b.homeIndex)))
  .filter(a => a.href !== featured.href)
  .slice(0, 10);

const card = a => `        <article class="card">
          <span class="kicker">${bareIcon(CATEGORY_OF_ICON[a.kicker], 15).replace("<svg ", '<svg class="cat-icon" ')}${a.kicker}</span>
          <h3><a href="${a.href}">${a.title}</a></h3>
          <p class="dek">${a.dek}</p>
          <p class="meta">${a.meta}</p>
        </article>`;

const body = `<body>
<a href="#main" class="skip-link">Skip to main content</a>

<div class="reading-progress" id="reading-progress"></div>

${masthead}

<section class="home-hero">
  <div class="wrap">
    <div>
      <span class="kicker">Money advice, minus the noise</span>
      <h1>Money advice that actually makes sense</h1>
      <p class="dek">Plain-English guides on debt, saving, investing and the rest — written for people who have better things to do than obsess over a spreadsheet.</p>
      <div class="hero-actions">
        <a href="start-here.html" class="btn">Start here</a>
        <a href="calculators.html" class="btn-outline">Try a calculator</a>
      </div>
    </div>
    <div class="hero-art">
      ${heroArt}
    </div>
  </div>
</section>

<div class="wrap">

  <section class="home-section">
    <div class="home-section-head">
      <h2>Browse by topic</h2>
      <a class="see-all" href="articles.html">All ${all.length} guides →</a>
    </div>
    <div class="topic-grid">
${topicGrid}
    </div>
  </section>

  <section class="home-section">
    <div class="home-section-head">
      <h2>Free tools</h2>
      <p>No sign-up, nothing stored — the maths runs in your browser.</p>
    </div>
    <div class="tool-row">
${toolRow}
    </div>
  </section>

  <section class="home-section">
    <div class="home-section-head">
      <h2>Start with this one</h2>
    </div>
    <div class="featured">
      <div>
        <span class="kicker">${bareIcon("saving", 15).replace("<svg ", '<svg class="cat-icon" ')}${featured.kicker}</span>
        <h3><a href="${featured.href}">${featured.title}</a></h3>
        <p>${featured.dek}</p>
        <a class="btn" href="${featured.href}">Read the plan</a>
      </div>
      <div class="featured-art">
        ${featuredArt}
      </div>
    </div>
  </section>

  <section class="home-section">
    <div class="home-section-head">
      <h2>Latest guides</h2>
      <a class="see-all" href="articles.html">Browse all articles →</a>
    </div>
    <div class="layout">
      <main id="main">
        <div class="card-grid">
${latest.map(card).join("\n")}
        </div>

        <div class="ad-slot">Ad placeholder — insert your AdSense unit here (e.g. in-article or display ad)</div>

        <p style="margin-top:18px"><a class="see-all" href="articles.html">Browse all ${all.length} articles →</a></p>
      </main>

${aside}

    </div>
  </section>

</div>

${tail}`;

fs.writeFileSync("index.html", `${head}\n${body}`.replace(/\n/g, "\r\n"), "utf8");
console.log("index.html rebuilt:", latest.length, "cards,", CATS.length, "topics,", TOOLS.length, "tools");

// ---------- articles.html ----------
const groups = CATS.map(c => {
  const list = all
    .filter(a => a.kicker === c.name)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(
      a => `        <li><a href="${a.href}">${a.title}</a><span>${a.dek}</span></li>`
    )
    .join("\n");
  return `      <h2 id="${c.name.toLowerCase()}">${bareIcon(CATEGORY_OF_ICON[c.name], 22)}${c.name} <span style="font-weight:400;color:var(--ink-soft);font-size:15px">${counts[c.name]} guides</span></h2>
      <ul>
${list}
      </ul>`;
}).join("\n\n");

const articlesHead = head
  .replace(/<title>[^<]*<\/title>/, "<title>All guides — Clearcoin</title>")
  .replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="Every Clearcoin guide in one place, grouped by topic: debt, saving, investing, retirement, housing and family money.">'
  )
  .replace(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="https://clearcoin.cc/articles.html">')
  .replace(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="https://clearcoin.cc/articles.html">')
  .replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="All guides — Clearcoin">')
  .replace(/<meta name="twitter:title" content="[^"]*">/, '<meta name="twitter:title" content="All guides — Clearcoin">');

const articlesHtml = `${articlesHead}
<body>
<a href="#main" class="skip-link">Skip to main content</a>

${masthead}

<div class="wrap">
  <article class="article article-index" id="main">
    <span class="kicker">Index</span>
    <h1>All guides</h1>
    <p class="meta">${all.length} guides across ${CATS.length} topics</p>

    <p>Everything published on Clearcoin, grouped by topic. Each one is a plain-English walkthrough of a single decision.</p>

${groups}

  </article>
</div>

${tail}`;

fs.writeFileSync("articles.html", articlesHtml.replace(/\n/g, "\r\n"), "utf8");
console.log("articles.html written with", all.length, "links");

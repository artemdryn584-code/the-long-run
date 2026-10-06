// Batch 5: real, publicly-documented principles from famous investors & money
// classics. Honest summaries of public ideas — no invented authorship, no
// copied text, with primary sources and fair caveats.
import fs from "node:fs";

const BASE_FILE = "sinking-fund-method.html";
const BASE_TITLE = "The Sinking Fund Method: How to Stop Dreading Car Repairs and Holidays";
const BASE_DESC = "Sinking funds turn 'surprise' expenses like car repairs, holidays, and annual bills into costs you already planned for.";
const BASE_SLUG = "sinking-fund-method.html";

const base = fs.readFileSync(BASE_FILE, "utf8");
const crlf = base.includes("\r\n");
const baseN = crlf ? base.replace(/\r\n/g, "\n") : base;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function jsonld(g) {
  const faq = g.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }));
  const blocks = [
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq },
    { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.desc, author: { "@type": "Organization", name: "Clearcoin" }, publisher: { "@type": "Organization", name: "Clearcoin" }, mainEntityOfPage: "https://clearcoin.cc/" + g.slug },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Guides", item: "https://clearcoin.cc/" },
      { "@type": "ListItem", position: 2, name: g.crumb, item: "https://clearcoin.cc/" + g.slug }
    ] }
  ];
  return blocks.map(b => `<script type="application/ld+json">\n${JSON.stringify(b, null, 2)}\n</script>`).join("\n");
}

function articleHTML(g) {
  const secs = g.sections.map(([h, ps]) => `    <h2>${h}</h2>\n` + ps.map(p => `    <p>${p}</p>`).join("\n")).join("\n\n");
  const faq = g.faq.map(([q, a]) => `    <div class="faq-item">\n      <h3>${q}</h3>\n      <p>${a}</p>\n    </div>`).join("\n");
  const related = g.related.map(([t, h]) => `      <li><a href="${h}">${t}</a></li>`).join("\n");
  const sources = g.sources.map(([t, u]) => `      <li><a href="${u}" target="_blank" rel="noopener">${t}</a></li>`).join("\n");
  return `<article class="article" id="main">
    <span class="kicker">${g.kicker}</span>
    <h1>${g.h1}</h1>
    <p class="meta">${g.read} min read</p>
    <p class="fact-check"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>Reviewed for accuracy by the <a href="editorial-guidelines.html">Clearcoin team</a></span></p>

    <p class="lead">${g.lead}</p>

${secs}

    <div class="sources">
      <h2>Official resources</h2>
      <p class="src-note">Primary sources so you can check the details yourself:</p>
      <ul>
${sources}
      </ul>
    </div>

    <div class="faq">
      <h2>Frequently asked questions</h2>
${faq}
    </div>

    <div class="side-box related">
      <h2>Related reading</h2>
      <ul>
${related}
      </ul>
    </div>
  </article>`;
}

const ARTICLES = [
  {
    slug: "jack-bogle-common-sense-investing.html", kicker: "Investing", crumb: "Jack Bogle's Common Sense", read: 6,
    title: "Jack Bogle's Common Sense Investing, in Plain English",
    ogtitle: "Jack Bogle's Common Sense Investing",
    desc: "Jack Bogle founded Vanguard and created the first index fund for everyday investors. Here are his core ideas: cut costs, own the whole market, and stay the course.",
    h1: "Jack Bogle's Common Sense Investing",
    lead: "John C. \"Jack\" Bogle founded Vanguard and launched the first index mutual fund available to ordinary investors in 1976. His message was simple and a little rebellious: you can't control the market, but you can control your costs — and that makes all the difference.",
    sections: [
      ["Who was Jack Bogle", ["Bogle built Vanguard into one of the world's largest investment firms and spent decades arguing that most active fund managers fail to beat the market once you subtract their fees. His solution was the low-cost index fund — a fund that simply tracks the whole market instead of trying to out-guess it."]],
      ["Costs are the enemy", ["Bogle's most famous line captures it: in investing, <em>you get what you don't pay for</em>. Fees look small — 1% here, 2% there — but they compound against you year after year, quietly eating a huge share of your returns over a lifetime. A low-cost index fund keeps that money working for you instead."]],
      ["Own the whole market", ["Rather than hunt for the next winning stock, Bogle said to own all of them through a broad index fund. You capture the market's overall return and spread your risk across hundreds or thousands of companies, so no single failure can sink you."]],
      ["Stay the course", ["His other core rule was behavioral: don't panic-sell in downturns or chase hot performance. Markets rise and fall, but the investors who quietly keep buying and holding through the noise tend to come out ahead of those who jump in and out."]],
      ["The honest caveat", ["Index investing doesn't protect you from market drops — it captures them at low cost along with the gains. It's a long-term approach that rewards patience, not a way to avoid risk or get rich quickly. Bogle's point was that it's the most reliable path for most people, not a guarantee."]]
    ],
    faq: [
      ["What is Jack Bogle's investing philosophy?", "Keep costs low, own the entire market through a broad index fund, and stay invested through ups and downs. He argued this beats most active strategies over the long run."],
      ["What did Jack Bogle invent?", "He launched the first index mutual fund available to everyday investors, in 1976, and built Vanguard around low-cost, long-term investing."],
      ["Is index investing still good advice?", "It remains one of the most widely recommended approaches for ordinary investors because it's cheap, diversified, and simple — though, like any investing, it still carries market risk."]
    ],
    sources: [["Bogleheads — investing philosophy", "https://www.bogleheads.org/"], ["Vanguard", "https://www.vanguard.com/"]],
    related: [["Why Warren Buffett Says Buy Index Funds", "warren-buffett-index-funds.html"], ["Index Funds, Explained", "index-funds-explained.html"], ["The Simple Path to Wealth (JL Collins)", "jl-collins-simple-path-to-wealth.html"]]
  },
  {
    slug: "charlie-munger-mental-models.html", kicker: "Investing", crumb: "Charlie Munger's Approach", read: 6,
    title: "Charlie Munger's Approach: Avoid Mistakes, Think in Models",
    ogtitle: "Charlie Munger's Investing Approach",
    desc: "Charlie Munger, Warren Buffett's longtime partner, focused on avoiding stupidity, thinking in mental models, and waiting patiently for rare great opportunities.",
    h1: "Charlie Munger's Approach to Money and Decisions",
    lead: "Charlie Munger was Warren Buffett's partner at Berkshire Hathaway for decades. His edge wasn't complicated math — it was clear thinking, patience, and a near-obsession with avoiding dumb mistakes.",
    sections: [
      ["Who was Charlie Munger", ["Munger served as vice chairman of Berkshire Hathaway and was Buffett's closest business partner and sounding board. He was known for blunt, witty wisdom about decision-making that reached far beyond the stock market."]],
      ["\"Invert, always invert\"", ["One of Munger's favorite thinking tools was to turn a problem upside down. Instead of only asking \"how do I get rich?\", ask \"what would guarantee I stay broke?\" — then avoid those things. Solving problems backwards often reveals traps you'd otherwise walk into."]],
      ["Avoid stupidity over seeking brilliance", ["Munger argued that a lot of long-term success comes simply from <em>consistently not being stupid</em>, rather than from being brilliant. Dodging big, permanent mistakes — overpaying, over-borrowing, chasing fads — matters more than hitting occasional home runs."]],
      ["Patience and a few big bets", ["He believed great opportunities are rare, so you wait, stay disciplined, and act decisively when one finally appears. Most of the time the right move is to do nothing — which is much harder than it sounds."]],
      ["Mental models and lifelong learning", ["Munger pushed the idea of collecting big ideas from many fields — psychology, math, biology — and using them as a latticework to judge decisions. The honest caveat: this is a thinking discipline, not a stock tip, and it rewards reading and reflection over quick action."]]
    ],
    faq: [
      ["What is Charlie Munger known for?", "Being Warren Buffett's partner at Berkshire Hathaway and for his emphasis on rational thinking, patience, avoiding mistakes, and using mental models from many disciplines."],
      ["What does \"invert, always invert\" mean?", "Solve a problem by looking at it backwards — identify what would cause failure and avoid that, instead of only focusing on what causes success."],
      ["What was Munger's main money advice?", "Avoid big mistakes, keep learning, be patient, and act decisively only when a genuinely good opportunity appears. Mindset mattered to him more than any single tactic."]
    ],
    sources: [["Berkshire Hathaway", "https://www.berkshirehathaway.com/"], ["Investor.gov (U.S. SEC)", "https://www.investor.gov/"]],
    related: [["Why Warren Buffett Says Buy Index Funds", "warren-buffett-index-funds.html"], ["Benjamin Graham's Value Investing", "benjamin-graham-value-investing.html"], ["5 Lessons From The Psychology of Money", "psychology-of-money-lessons.html"]]
  },
  {
    slug: "ray-dalio-principles.html", kicker: "Investing", crumb: "Ray Dalio's Principles", read: 6,
    title: "Ray Dalio's Principles and the Case for Diversification",
    ogtitle: "Ray Dalio's Principles",
    desc: "Ray Dalio built Bridgewater and wrote 'Principles.' Here are his big ideas for regular people: diversify broadly, plan for every environment, and learn from mistakes.",
    h1: "Ray Dalio's Principles, for Regular People",
    lead: "Ray Dalio founded Bridgewater Associates, one of the world's largest hedge funds, and shared his decision-making rules in his book <em>Principles</em>. Most of us won't run a hedge fund — but a few of his ideas translate surprisingly well to ordinary money.",
    sections: [
      ["Who is Ray Dalio", ["Dalio built Bridgewater over decades and became known for writing down the principles he used to make decisions, both in investing and in running a company. The aim was to turn hard-won lessons into repeatable rules anyone on his team could follow."]],
      ["Diversification: the closest thing to a free lunch", ["Dalio has long argued that holding several investments whose returns don't move together is the most powerful tool in investing: it can lower your overall risk without giving up much return. Spreading your money across different types of assets is more reliable than betting it all on one."]],
      ["Plan for environments you can't predict", ["His well-known \"all weather\" thinking is about building a mix that can hold up whether growth or inflation is rising or falling — because no one forecasts the economy reliably. The humility to admit you can't predict the future shapes a sturdier plan."]],
      ["Turn mistakes into rules", ["A central theme of <em>Principles</em> is that pain plus reflection equals progress. When something goes wrong, write down what you learned as a rule so you don't repeat it. Over time you build a personal playbook that keeps improving."]],
      ["The honest caveat", ["Dalio's professional strategies use sophisticated tools that regular investors don't need and can't easily copy. For most people the takeaway is simpler: diversify broadly, keep costs low, don't bet everything on a single outcome, and learn from your own missteps."]]
    ],
    faq: [
      ["What is Ray Dalio's main principle?", "That you can reduce risk through diversification — holding investments that don't all move together — and that reflecting on mistakes to form rules drives long-term progress."],
      ["What is the \"all weather\" idea?", "Building a portfolio designed to hold up across different economic conditions (rising or falling growth and inflation), because no one can reliably predict which will come next."],
      ["What can regular investors learn from Dalio?", "Diversify broadly, don't concentrate everything in one bet, keep costs reasonable, and treat mistakes as lessons to write down and avoid repeating."]
    ],
    sources: [["Principles by Ray Dalio (official)", "https://www.principles.com/"], ["Investor.gov (U.S. SEC)", "https://www.investor.gov/"]],
    related: [["Index Funds, Explained", "index-funds-explained.html"], ["What Is an ETF?", "what-is-an-etf.html"], ["Dollar-Cost Averaging, Explained", "dollar-cost-averaging.html"]]
  },
  {
    slug: "the-richest-man-in-babylon.html", kicker: "Saving", crumb: "Richest Man in Babylon", read: 5,
    title: "The Richest Man in Babylon: Pay Yourself First",
    ogtitle: "The Richest Man in Babylon",
    desc: "A 1926 classic that still holds up. Its core rule: pay yourself first by saving at least a tenth of everything you earn — before anything else.",
    h1: "The Richest Man in Babylon, in Plain English",
    lead: "Written by George S. Clason in 1926 as a series of parables set in ancient Babylon, this short book delivers money rules that still work almost a century later. Strip away the old-fashioned language and the advice is strikingly modern.",
    sections: [
      ["The one rule: pay yourself first", ["The book's most famous idea is that <strong>a part of all you earn is yours to keep</strong>. Save at least a tenth of everything you make and set it aside <em>before</em> paying your other expenses — not whatever happens to be left over at the end of the month."]],
      ["Live on less than you earn", ["Clason warned that what we call \"necessary expenses\" will always grow to match our income unless we consciously set limits. Control your spending on purpose, and the gap between earning and spending becomes the money that builds wealth."]],
      ["Make your savings work", ["Saved money shouldn't sit idle — it should earn more money. In modern terms, that means investing your savings so they compound over time, rather than letting inflation slowly erode cash."]],
      ["Guard against loss", ["The book urges caution: invest in things you understand, seek advice from people who are competent in handling money, and be deeply skeptical of get-rich-quick schemes. Protecting your capital comes before chasing big returns."]],
      ["Why it still works", ["The Richest Man in Babylon is now in the public domain and nearly 100 years old, yet \"save at least 10%, spend less than you earn, and invest wisely\" is still the backbone of modern personal finance. The setting is ancient; the math is timeless."]]
    ],
    faq: [
      ["What is the main lesson of The Richest Man in Babylon?", "Pay yourself first — save at least a tenth of everything you earn before spending on anything else — then invest those savings so they grow over time."],
      ["What does \"pay yourself first\" mean?", "Set aside your savings as the first thing you do when money comes in, rather than saving whatever is left at the end of the month (which is often nothing)."],
      ["Is The Richest Man in Babylon still relevant?", "Yes. Though written in 1926, its core rules — save consistently, live below your means, and invest in what you understand — remain standard personal-finance advice today."]
    ],
    sources: [["The Richest Man in Babylon — Project Gutenberg", "https://www.gutenberg.org/"], ["MyMoney.gov — federal financial literacy", "https://www.mymoney.gov/"]],
    related: [["How Much of Your Paycheck Should Go to Savings", "how-much-to-save.html"], ["The 50/30/20 Budget Rule", "50-30-20-budget-rule.html"], ["Your Money or Your Life", "your-money-or-your-life.html"]]
  },
  {
    slug: "the-millionaire-next-door.html", kicker: "Saving", crumb: "The Millionaire Next Door", read: 5,
    title: "The Millionaire Next Door: What Wealth Really Looks Like",
    ogtitle: "The Millionaire Next Door",
    desc: "Most real millionaires don't look rich. This classic study found that wealth usually comes from frugality and steady saving, not big salaries and flashy spending.",
    h1: "The Millionaire Next Door: What Wealth Really Looks Like",
    lead: "Based on research by Thomas J. Stanley and William D. Danko, this book shattered the Hollywood image of the millionaire. The typical millionaire, they found, lives in an ordinary house, drives an ordinary car, and quietly builds wealth by spending far less than they could.",
    sections: [
      ["The big surprise", ["The authors found that many people who <em>look</em> rich aren't, and many genuine millionaires look completely ordinary. Income and wealth are not the same thing: a big paycheck that's entirely spent builds nothing."]],
      ["Frugality is the common thread", ["The millionaires they studied generally lived below their means — they budgeted, avoided lifestyle inflation, and didn't try to signal wealth through spending. Modest habits, repeated for decades, did the heavy lifting."]],
      ["Wealth is what you keep", ["The book popularized the idea of comparing your net worth to what someone your age and income \"should\" have accumulated. The standout savers — people who build far more wealth than their income alone would predict — got there by keeping and investing money, not earning record salaries."]],
      ["Beware \"big hat, no cattle\"", ["High spending to look wealthy often hides little real wealth underneath. The expensive car and big house can be signs of debt, not riches. Real financial strength is usually quiet."]],
      ["The takeaway for today", ["You don't need an enormous income to build wealth. You need to consistently spend less than you earn, avoid lifestyle inflation as your pay rises, and invest the difference steadily over time."]]
    ],
    faq: [
      ["What is the main idea of The Millionaire Next Door?", "That most real millionaires build wealth through frugality and steady saving rather than high incomes or flashy spending — and that wealth is what you keep, not what you earn."],
      ["Do most millionaires look rich?", "According to the book's research, often not. Many live in ordinary homes and drive ordinary cars, while many people who look wealthy are actually heavily in debt."],
      ["How do millionaires build wealth according to the book?", "By living below their means, budgeting, avoiding lifestyle inflation, and consistently saving and investing the difference over many years."]
    ],
    sources: [["Consumer Financial Protection Bureau", "https://www.consumerfinance.gov/"], ["MyMoney.gov — federal financial literacy", "https://www.mymoney.gov/"]],
    related: [["How to Become a Millionaire on an Average Salary", "how-to-become-a-millionaire.html"], ["What Is Net Worth and How to Calculate It", "what-is-net-worth.html"], ["How Much of Your Paycheck Should Go to Savings", "how-much-to-save.html"]]
  },
  {
    slug: "rich-dad-poor-dad-explained.html", kicker: "Investing", crumb: "Rich Dad Poor Dad", read: 6,
    title: "Rich Dad Poor Dad: Assets vs. Liabilities (Honest Summary)",
    ogtitle: "Rich Dad Poor Dad, Explained",
    desc: "Robert Kiyosaki's bestseller pushed one big idea: buy assets that put money in your pocket. Here's the genuinely useful core — and the honest caveats.",
    h1: "Rich Dad Poor Dad: The Useful Core, and the Caveats",
    lead: "Robert Kiyosaki's <em>Rich Dad Poor Dad</em> is one of the best-selling personal-finance books ever written. It's also one of the most debated. Here's the genuinely useful idea at its center — and where readers should be careful.",
    sections: [
      ["The central idea: assets vs. liabilities", ["Kiyosaki's simplest and most useful framing is this: an <strong>asset</strong> puts money in your pocket, and a <strong>liability</strong> takes money out. The path to wealth, he argues, is steadily acquiring income-producing assets rather than accumulating things that only cost you money."]],
      ["Financial education matters", ["The book's push to actually learn how money, taxes, and investing work — instead of just working for a paycheck and hoping — is a fair and valuable message. Understanding the game changes how you play it."]],
      ["Make money work for you", ["A recurring theme is building streams of income from investments or businesses, so you're not trading hours for dollars forever. The goal is to own things that earn while you sleep."]],
      ["The honest caveats", ["This is where balance matters. The book is light on concrete, step-by-step detail, some of its stories have been questioned, and it leans heavily toward real estate and entrepreneurship — both of which carry real risk. It's best read as motivation and mindset, not as a precise instruction manual."]],
      ["What to actually do", ["The dependable version of its message is well-supported by mainstream finance: spend less than you earn, avoid high-interest \"bad\" debt, build an emergency fund, and steadily invest in diversified, low-cost assets like index funds. Keep the inspiration; skip the hype."]]
    ],
    faq: [
      ["What is the main lesson of Rich Dad Poor Dad?", "Build wealth by acquiring assets that put money in your pocket, and learn how money works rather than only working for a paycheck."],
      ["What's the difference between an asset and a liability?", "In the book's framing, an asset puts money into your pocket (like an investment that pays you), while a liability takes money out (like debt or something with ongoing costs)."],
      ["Is Rich Dad Poor Dad good advice?", "Its core mindset — buy income-producing assets and get financially educated — is useful, but it's short on specifics and leans toward riskier paths. Treat it as motivation, and build on dependable basics like low-cost, diversified investing."]
    ],
    sources: [["Investor.gov (U.S. SEC)", "https://www.investor.gov/"], ["Consumer Financial Protection Bureau", "https://www.consumerfinance.gov/"]],
    related: [["What Is Net Worth and How to Calculate It", "what-is-net-worth.html"], ["Index Funds, Explained", "index-funds-explained.html"], ["How to Start Investing With $100", "how-to-start-investing.html"]]
  }
];

const TOPIC = { Debt: "debt.html", Saving: "saving.html", Investing: "investing.html", Retirement: "retirement.html", Housing: "housing.html", Family: "family.html" };
const trunc = (t) => (t.length > 46 ? t.slice(0, 45).trimEnd() + "…" : t);

let done = 0;
for (const g of ARTICLES) {
  let s = baseN;
  s = s.replace(`<title>${BASE_TITLE} — Clearcoin</title>`, `<title>${esc(g.title)} — Clearcoin</title>`);
  s = s.split(BASE_TITLE).join(esc(g.ogtitle));
  s = s.split(BASE_DESC).join(esc(g.desc));
  s = s.replace(`<meta property="og:url" content="https://clearcoin.cc/${BASE_SLUG}">`, `<meta property="og:url" content="https://clearcoin.cc/${g.slug}">`);
  s = s.replace(`<link rel="canonical" href="https://clearcoin.cc/${BASE_SLUG}">`, `<link rel="canonical" href="https://clearcoin.cc/${g.slug}">`);
  s = s.replace(/<script type="application\/ld\+json">[\s\S]*<\/head>/, jsonld(g) + "\n</head>");
  s = s.replace(/<div class="breadcrumbs">[\s\S]*?<\/div>/, `<div class="breadcrumbs"><a href="index.html">Home</a> / <a href="${TOPIC[g.kicker]}">${g.kicker}</a> / ${esc(trunc(g.ogtitle))}</div>`);
  s = s.replace(/<article class="article" id="main">[\s\S]*?<\/article>/, articleHTML(g));
  fs.writeFileSync(g.slug, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
  done++;
  console.log("wrote", g.slug);
}
console.log("generated", done, "articles");

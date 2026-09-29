// Generates original articles ABOUT well-known investors' publicly documented
// money principles — written by Clearcoin, attributed and linked to primary
// sources. These are our own summaries of public ideas, NOT the person's own
// text and NOT published under their name (no impersonation, no copied text).
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
  const secs = g.sections.map(([h, ps]) =>
    `    <h2>${h}</h2>\n` + ps.map(p => `    <p>${p}</p>`).join("\n")
  ).join("\n\n");
  const faq = g.faq.map(([q, a]) =>
    `    <div class="faq-item">\n      <h3>${q}</h3>\n      <p>${a}</p>\n    </div>`
  ).join("\n");
  const related = g.related.map(([t, h]) => `      <li><a href="${h}">${t}</a></li>`).join("\n");
  const sources = g.sources.map(([t, u]) => `      <li><a href="${u}" target="_blank" rel="noopener">${t}</a></li>`).join("\n");
  return `<article class="article" id="main">
    <span class="kicker">${g.kicker}</span>
    <h1>${g.h1}</h1>
    <p class="meta">${g.read} min read</p>
    <p class="fact-check"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>Reviewed for accuracy by the <a href="editorial-guidelines.html">Clearcoin team</a></span></p>

    <p class="lead">${g.lead}</p>

${secs}

    <p class="src-note" style="font-size:13.5px;">This is Clearcoin's own summary of ${g.who}'s publicly shared ideas, with links to primary sources below. It is not written by them and is for education only — not personal financial advice.</p>

    <div class="sources">
      <h2>Sources &amp; further reading</h2>
      <p class="src-note">Go straight to the primary sources:</p>
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
    slug: "warren-buffett-index-funds.html",
    title: "Why Warren Buffett Says Most People Should Buy Index Funds",
    ogtitle: "Why Warren Buffett Says Most People Should Buy Index Funds",
    desc: "Warren Buffett, one of history's greatest investors, repeatedly tells ordinary people to buy low-cost index funds. Here's what he means and why.",
    crumb: "Warren Buffett on Index Funds",
    who: "Warren Buffett",
    kicker: "Investing",
    h1: "Why Warren Buffett Says Most People Should Buy Index Funds",
    read: 6,
    lead: "Warren Buffett built one of the greatest track records in investing history as chairman of Berkshire Hathaway. Yet the advice he gives ordinary people is strikingly simple: for most, a low-cost index fund beats trying to pick winners.",
    sections: [
      ["Who Warren Buffett is", ["Buffett has run Berkshire Hathaway for decades and is widely regarded as one of the most successful investors ever. That is what makes his advice for everyone else so notable — the ultimate stock-picker tells most people not to pick stocks."]],
      ["His core message: buy a low-cost index fund", ["In his shareholder letters, Buffett has said that most investors — including large institutions — will do better in a low-cost fund that simply tracks the whole market than by paying professionals to beat it. He has even instructed that a large share of his own estate be invested in a low-cost S&amp;P 500 index fund for his family's benefit.", "The logic: an index fund owns a slice of hundreds of companies, so no single failure sinks you, and its fees are tiny compared with actively managed funds."]],
      ["The bet that proved the point", ["Buffett once made a public, decade-long wager that a simple S&amp;P 500 index fund would outperform a basket of hand-picked hedge funds after fees. The index fund won comfortably — a real-world illustration that high fees and clever trading usually lose to a cheap, patient index."]],
      ["Why fees and patience matter", ["Buffett's advice rests on two ideas ordinary savers can copy: keep costs low, because fees compound against you over decades, and stay invested, because trying to jump in and out usually backfires. As he has put it, the market rewards patience, not activity."]],
      ["What this means for you", ["You do not need to be Warren Buffett to use Buffett's advice. Pick a low-cost, broad index fund inside a tax-advantaged account, automate your contributions, and leave it alone through the ups and downs. Simple and boring is, for most people, the point."]]
    ],
    faq: [
      ["What index fund does Warren Buffett recommend?", "He has repeatedly pointed ordinary investors toward a low-cost fund that tracks a broad market index such as the S&P 500, rather than actively managed funds with higher fees."],
      ["Does Buffett really tell people not to pick stocks?", "For most people, yes. Despite being a famous stock-picker himself, he argues the average investor does better in a cheap index fund than trying to beat the market."],
      ["Is this financial advice?", "No. This is an educational summary of Buffett's public statements. Your own choices depend on your situation; consider a qualified professional for personal advice."]
    ],
    sources: [
      ["Berkshire Hathaway — shareholder letters", "https://www.berkshirehathaway.com/"],
      ["Investor.gov (U.S. SEC) — index funds", "https://www.investor.gov/"]
    ],
    related: [
      ["Index Funds, Explained", "index-funds-explained.html"],
      ["How to Start Investing With $100", "how-to-start-investing.html"],
      ["How Much Risk Should You Take, By Age", "risk-by-age.html"]
    ]
  },
  {
    slug: "psychology-of-money-lessons.html",
    title: "5 Money Lessons From 'The Psychology of Money'",
    ogtitle: "5 Money Lessons From 'The Psychology of Money'",
    desc: "Morgan Housel's bestseller argues that doing well with money is about behavior, not intelligence. Here are five of its most useful ideas.",
    crumb: "The Psychology of Money",
    who: "Morgan Housel",
    kicker: "Saving",
    h1: "5 Money Lessons From 'The Psychology of Money'",
    read: 6,
    lead: "Morgan Housel's book <em>The Psychology of Money</em> became a bestseller by making a simple argument: how you behave matters more than how smart you are. Here are five of its most practical takeaways, in our own words.",
    sections: [
      ["1. Wealth is what you don't see", ["Housel points out that real wealth is money not spent — the car not bought, the upgrade skipped. Spending signals income, but wealth is the savings and options you build by holding back. It is invisible, which is exactly why it is easy to undervalue."]],
      ["2. Your saving rate beats your returns", ["You can't control the market, but you can control how much you save. Housel argues that a high saving rate — driven by humility and a lower ego about spending — does more for most people than chasing higher investment returns."]],
      ["3. Room for error is a feature, not a weakness", ["Because the future is uncertain, Housel favors a margin of safety: an emergency fund, conservative assumptions, and not stretching to the edge. The goal is to survive long enough for compounding to work, even when things go wrong."]],
      ["4. Enough is a superpower", ["A recurring theme is knowing when you have enough. Constantly moving the goalposts — always needing more — is how people with plenty still feel poor and take reckless risks. Defining 'enough' protects you from that trap."]],
      ["5. Time is the real engine", ["Housel emphasizes that compounding needs time, not brilliance. Ordinary returns earned patiently over decades beat spectacular returns you can't sustain. The most powerful move is often simply to keep going."]]
    ],
    faq: [
      ["Who wrote The Psychology of Money?", "Morgan Housel, a writer and former financial columnist. The book collects short lessons on how behavior and psychology shape financial outcomes."],
      ["What is the main idea of the book?", "That doing well with money is more about behavior — patience, humility, saving, and avoiding big mistakes — than about intelligence or fancy strategies."],
      ["Is this a summary of the book?", "It is our own short summary of a few public ideas from the book, for education. For the full argument and examples, read the book itself."]
    ],
    sources: [
      ["Investor.gov (U.S. SEC)", "https://www.investor.gov/"],
      ["MyMoney.gov — federal financial literacy", "https://www.mymoney.gov/"]
    ],
    related: [
      ["How Much of Your Paycheck Should Go to Savings", "how-much-to-save.html"],
      ["Building a Budget That Survives Real Life", "budget-that-survives-real-life.html"],
      ["How to Start Investing With $100", "how-to-start-investing.html"]
    ]
  },
  {
    slug: "dave-ramsey-baby-steps.html",
    title: "Dave Ramsey's Baby Steps and Debt Snowball, Explained",
    ogtitle: "Dave Ramsey's Baby Steps and Debt Snowball, Explained",
    desc: "Dave Ramsey's Baby Steps and debt snowball have helped millions get out of debt. Here's how the method works — and the trade-offs.",
    crumb: "Dave Ramsey's Baby Steps",
    who: "Dave Ramsey",
    kicker: "Debt",
    h1: "Dave Ramsey's Baby Steps and Debt Snowball, Explained",
    read: 6,
    lead: "Dave Ramsey is one of the best-known voices in personal finance, and his step-by-step system has helped millions of people get out of debt. Here is how his approach works, explained plainly — including where the math and the motivation pull in different directions.",
    sections: [
      ["The Baby Steps in brief", ["Ramsey's plan is a fixed order of moves. Roughly: save a small starter emergency fund, then aggressively pay off all non-mortgage debt, then build a fuller emergency fund of several months of expenses, then invest for retirement, and so on. The power is in doing them one at a time instead of everything at once."]],
      ["The debt snowball", ["The signature idea is the debt snowball: list your debts from smallest balance to largest, ignore interest rates, and attack the smallest first while paying minimums on the rest. Each debt you clear frees up its payment to roll onto the next — the 'snowball' grows."]],
      ["Why it works: motivation over math", ["Paying the smallest balance first is not the mathematically cheapest route — that would be the highest interest rate first (the 'avalanche'). Ramsey's argument is behavioral: quick wins keep people going, and finishing what you start beats optimizing a plan you quit. For many, motivation is the scarce resource, not arithmetic."]],
      ["The trade-off to know", ["If your highest-interest debt also has a large balance, the snowball can cost you more in interest than the avalanche. The honest answer is that the best method is the one you'll actually finish. If small wins keep you motivated, the snowball's slightly higher cost can be worth it."]],
      ["What you can take from it", ["Even if you don't follow every Baby Step, two ideas travel well: build a small buffer before you attack debt, and pick one payoff order and commit to it. Momentum, not perfection, gets people to debt-free."]]
    ],
    faq: [
      ["What is the debt snowball?", "Paying debts from smallest balance to largest, regardless of interest rate, so quick wins build momentum. It is the centerpiece of Dave Ramsey's method."],
      ["Is the snowball or avalanche better?", "The avalanche (highest interest first) saves the most money; the snowball (smallest balance first) keeps more people motivated. The best one is the one you'll stick with."],
      ["What are the Baby Steps?", "A fixed sequence: a small starter emergency fund, then pay off debt, then a full emergency fund, then invest — done one step at a time."]
    ],
    sources: [
      ["Ramsey Solutions", "https://www.ramseysolutions.com/"],
      ["Consumer Financial Protection Bureau", "https://www.consumerfinance.gov/"]
    ],
    related: [
      ["Debt Avalanche vs. Snowball", "debt-avalanche-vs-snowball.html"],
      ["Is Debt Consolidation Worth It?", "debt-consolidation.html"],
      ["How to Make a Budget (Step by Step)", "how-to-make-a-budget.html"]
    ]
  },
  {
    slug: "jl-collins-simple-path-to-wealth.html",
    title: "The Simple Path to Wealth: JL Collins' Core Idea",
    ogtitle: "The Simple Path to Wealth: JL Collins' Core Idea",
    desc: "JL Collins' 'The Simple Path to Wealth' boils investing down to a few durable rules. Here's the core idea and why it resonates with the FIRE crowd.",
    crumb: "The Simple Path to Wealth",
    who: "JL Collins",
    kicker: "Investing",
    h1: "The Simple Path to Wealth: JL Collins' Core Idea",
    read: 6,
    lead: "JL Collins turned a series of letters to his daughter into <em>The Simple Path to Wealth</em>, a book beloved in the financial-independence community. Its message is refreshingly short: avoid debt, spend less than you earn, and put the rest in low-cost index funds.",
    sections: [
      ["The whole idea in one breath", ["Collins argues that building wealth doesn't require complexity. Live below your means, steer clear of debt, and invest the surplus in a broad, low-cost stock index fund — then keep doing it for years. Complexity, he says, mostly benefits the people selling it."]],
      ["'F-you money' and freedom", ["A memorable Collins idea is building enough savings to have real choices — the freedom to walk away from a bad job or situation. The point of the simple path isn't just a bigger number; it's options and control over your time."]],
      ["Stay the course through crashes", ["Collins is blunt that markets will crash, sometimes hard, and that the biggest danger is not the crash but panicking and selling at the bottom. His advice is to expect the drops, keep investing through them, and let time do the work."]],
      ["Why the FIRE community embraced it", ["People pursuing financial independence liked the book because it is simple enough to actually follow: a high saving rate plus a boring index fund, repeated. No stock-picking, no timing, no guru required."]],
      ["What you can borrow from it", ["You don't have to chase early retirement to use the simple path. Avoiding high-interest debt, automating a low-cost index fund, and refusing to panic in downturns are habits almost anyone can adopt."]]
    ],
    faq: [
      ["What is The Simple Path to Wealth about?", "JL Collins' book argues that avoiding debt, living below your means, and investing the difference in low-cost index funds is a durable way to build wealth."],
      ["What is 'F-you money'?", "Collins' term for having enough savings to give you real freedom and choices — the ability to say no to situations you don't want."],
      ["Is index investing really that simple?", "The strategy is simple; the hard part is behavior — saving consistently and not selling in a crash. That is where most people struggle."]
    ],
    sources: [
      ["jlcollinsnh.com — the Stock Series", "https://jlcollinsnh.com/"],
      ["Investor.gov (U.S. SEC)", "https://www.investor.gov/"]
    ],
    related: [
      ["Index Funds, Explained", "index-funds-explained.html"],
      ["How to Start Investing With $100", "how-to-start-investing.html"],
      ["Robo-Advisors vs. DIY Investing", "robo-advisors-vs-diy.html"]
    ]
  },
  {
    slug: "ramit-sethi-rich-life.html",
    title: "Ramit Sethi's 'Rich Life' Approach to Money",
    ogtitle: "Ramit Sethi's 'Rich Life' Approach to Money",
    desc: "Ramit Sethi's system is about automation and conscious spending — cut costs on what you don't care about so you can spend freely on what you do.",
    crumb: "Ramit Sethi's Rich Life",
    who: "Ramit Sethi",
    kicker: "Saving",
    h1: "Ramit Sethi's 'Rich Life' Approach to Money",
    read: 6,
    lead: "Ramit Sethi, author of <em>I Will Teach You to Be Rich</em>, pushes back on typical budgeting guilt. His pitch: automate the boring stuff, cut costs hard on what you don't care about, and spend freely on the few things you love.",
    sections: [
      ["Define your own 'Rich Life'", ["Sethi's central idea is that a 'Rich Life' is personal. Instead of copying someone else's goals, you decide what you genuinely value — travel, eating out, time with family — and design your money around that, not around generic rules."]],
      ["Conscious spending, not guilt", ["Rather than cutting every latte, Sethi advocates conscious spending: spend extravagantly on the handful of things you love, and cut mercilessly on the things you don't. Guilt-driven, cut-everything budgets, he argues, rarely last."]],
      ["Automate your money", ["A core Sethi tactic is automation: set up your paycheck to flow automatically into savings, investments, and bills before you can spend it. Good decisions made once, on autopilot, beat willpower you have to summon every month."]],
      ["Focus on the big wins", ["Sethi tells people to stop obsessing over tiny expenses and focus on the big levers — earning more, automating investing, negotiating major bills. Getting a few large things right matters far more than micromanaging small ones."]],
      ["What you can apply today", ["You don't need his whole program to benefit: pick your handful of 'spend freely' categories, automate one transfer to savings or investing, and stop feeling guilty about the rest. Design the system once and let it run."]]
    ],
    faq: [
      ["What is a 'Rich Life' according to Ramit Sethi?", "A life designed around what you personally value, funded by spending freely on those things and cutting hard on what you don't care about."],
      ["What is conscious spending?", "Deliberately spending a lot on the few things you love while ruthlessly cutting the rest, instead of feeling guilty about every purchase."],
      ["Does he really say don't budget?", "He favors an automated 'conscious spending plan' over restrictive line-item budgeting, so the system runs without constant willpower."]
    ],
    sources: [
      ["I Will Teach You To Be Rich", "https://www.iwillteachyoutoberich.com/"],
      ["Consumer Financial Protection Bureau", "https://www.consumerfinance.gov/"]
    ],
    related: [
      ["How to Make a Budget (Step by Step)", "how-to-make-a-budget.html"],
      ["Budgeting Apps Compared", "budgeting-apps-compared.html"],
      ["How Much of Your Paycheck Should Go to Savings", "how-much-to-save.html"]
    ]
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

// Second batch of genuine articles (how-to guides + summaries of well-known
// investors' public principles). Built from an existing article so shell,
// scripts and metadata stay identical. Expert pieces carry an explicit
// "our summary, not their words" note; how-to pieces don't.
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
  const note = g.who
    ? `\n    <p class="src-note" style="font-size:13.5px;">This is Clearcoin's own summary of ${g.who}'s publicly shared ideas, with links to primary sources below. It is not written by them and is for education only — not personal financial advice.</p>\n`
    : "";
  const srcHead = g.who ? "Sources &amp; further reading" : "Official resources";
  return `<article class="article" id="main">
    <span class="kicker">${g.kicker}</span>
    <h1>${g.h1}</h1>
    <p class="meta">${g.read} min read</p>
    <p class="fact-check"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>Reviewed for accuracy by the <a href="editorial-guidelines.html">Clearcoin team</a></span></p>

    <p class="lead">${g.lead}</p>

${secs}
${note}
    <div class="sources">
      <h2>${srcHead}</h2>
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
    slug: "how-to-negotiate-a-raise.html", kicker: "Saving", crumb: "How to Negotiate a Raise", read: 6,
    title: "How to Negotiate a Raise (Without Dreading It)",
    ogtitle: "How to Negotiate a Raise (Without Dreading It)",
    desc: "A calm, practical way to ask for a raise: research your market rate, document your wins, time the ask, and name a specific number.",
    h1: "How to Negotiate a Raise (Without Dreading It)",
    lead: "Asking for a raise feels uncomfortable, but it's one of the highest-value money moves you can make — a bigger salary compounds into every future raise, bonus and retirement contribution. Here's how to do it calmly and prepared.",
    sections: [
      ["Know your market rate", ["Before you ask, find out what your role actually pays. Look at public salary data, job postings for similar roles, and industry surveys. Walking in with a researched range turns the conversation from a favor into a fact-based discussion."]],
      ["Document your wins", ["Keep a running list of what you've delivered — projects shipped, money saved or earned, problems solved. Concrete results are far more persuasive than 'I've worked hard.' Tie your work to outcomes your manager cares about."]],
      ["Time the ask well", ["The best moments are after a clear win, at a performance review, or when you've taken on more responsibility. Avoid asking during a bad quarter or a stressful crunch. Give your manager a heads-up so it isn't a surprise."]],
      ["Name a specific number", ["Vague requests get vague answers. Ask for a specific figure or range based on your research, and lead with your value, not your needs. Then stop talking and let them respond — silence is fine."]],
      ["Handle the answer", ["If it's yes, get it in writing. If it's 'not now,' ask what specifically would earn the raise and by when, then follow up. If the door stays shut and you're underpaid, that information is valuable for your next move."]]
    ],
    faq: [
      ["How much of a raise should I ask for?", "Base it on market data for your role and location, plus the value you've added. A researched range is more credible than a round guess."],
      ["When is the best time to ask?", "After a clear win, at a review, or when your responsibilities have grown — and not during a company downturn or crisis."],
      ["What if they say no?", "Ask exactly what would justify a raise and by when, get it in writing, and use the answer to plan — either to hit those goals or to look elsewhere."]
    ],
    sources: [["U.S. Bureau of Labor Statistics — wage data", "https://www.bls.gov/"], ["MyMoney.gov — federal financial literacy", "https://www.mymoney.gov/"]],
    related: [["How Much of Your Paycheck Should Go to Savings", "how-much-to-save.html"], ["Cost of Living Differences by State", "cost-of-living-by-state.html"], ["How to Make a Budget (Step by Step)", "how-to-make-a-budget.html"]]
  },
  {
    slug: "credit-score-ranges-explained.html", kicker: "Debt", crumb: "Credit Score Ranges", read: 5,
    title: "Credit Score Ranges, Explained",
    ogtitle: "Credit Score Ranges, Explained",
    desc: "What credit score ranges mean (poor to excellent), what moves your score between them, and why the range you land in changes what you pay.",
    h1: "Credit Score Ranges, Explained",
    lead: "Credit scores usually run from 300 to 850, grouped into bands from poor to excellent. Knowing which band you're in — and what moves you up — tells you a lot about the rates and approvals you'll get.",
    sections: [
      ["What the ranges mean", ["Most scoring models sort scores into bands: roughly poor, fair, good, very good, and excellent. The exact cutoffs vary by model, but generally the mid-600s and up is 'good,' and 740 or above is 'very good' to 'excellent.' Lenders use these bands to decide approvals and interest rates."]],
      ["What moves your score", ["The biggest factors are paying on time and how much of your available credit you use (your utilization). Length of history, credit mix, and recent applications matter less. Small, consistent habits move you between bands over time."]],
      ["Why the band matters", ["The difference between 'fair' and 'excellent' can be thousands of dollars over the life of a loan, because a lower score usually means a higher interest rate. Moving up even one band can meaningfully lower what you pay to borrow."]],
      ["How to move up a band", ["Automate on-time payments, keep balances well below your limits, avoid opening lots of new accounts at once, and let your accounts age. There's no legitimate overnight fix — it's steady behavior over months."]],
      ["Check your score and reports", ["You can get your credit reports free from the major bureaus and check them for errors that unfairly drag you down. Many banks and cards also show your score for free so you can track your band."]]
    ],
    faq: [
      ["What is a good credit score?", "It varies by model, but generally the mid-600s and up is 'good,' and 740+ is 'very good' to 'excellent.' Higher bands unlock better rates."],
      ["What's the highest credit score?", "Most common models top out at 850. You don't need a perfect score — once you're in the top band, the benefits are nearly the same."],
      ["How fast can I change my band?", "There's no instant fix. On-time payments and low balances move your score over months, not days."]
    ],
    sources: [["Consumer Financial Protection Bureau — credit scores", "https://www.consumerfinance.gov/"], ["AnnualCreditReport.com — official free reports", "https://www.annualcreditreport.com/"]],
    related: [["How to Build Credit From Scratch", "how-to-build-credit.html"], ["The Day After You Pay Off Your Last Credit Card", "after-paying-off-credit-card.html"], ["Financial Glossary", "glossary.html"]]
  },
  {
    slug: "50-30-20-budget-rule.html", kicker: "Saving", crumb: "The 50/30/20 Rule", read: 5,
    title: "The 50/30/20 Budget Rule, Explained",
    ogtitle: "The 50/30/20 Budget Rule, Explained",
    desc: "The 50/30/20 rule splits your take-home pay into needs, wants, and savings. Here's how it works, when it fits, and how to adjust it.",
    h1: "The 50/30/20 Budget Rule, Explained",
    lead: "The 50/30/20 rule is one of the simplest budgets around: split your after-tax income into 50% needs, 30% wants, and 20% savings and debt payoff. It's a starting framework, not a straitjacket.",
    sections: [
      ["What the rule is", ["Take your take-home pay and divide it three ways: half to needs, just under a third to wants, and a fifth to savings and extra debt payoff. The appeal is that you don't track dozens of categories — just three buckets."]],
      ["The three buckets", ["<strong>Needs (50%)</strong> are essentials you can't skip: housing, utilities, groceries, minimum debt payments, insurance. <strong>Wants (30%)</strong> are the nice-to-haves: dining out, subscriptions, hobbies. <strong>Savings (20%)</strong> covers your emergency fund, investing, and paying debt down faster."]],
      ["When it works — and when it doesn't", ["It's great for beginners who want structure without spreadsheets. But in high-cost cities, 'needs' can easily exceed 50%, which means the other buckets shrink. That's fine — the percentages are a target to aim at, not a law."]],
      ["How to adjust it", ["If your needs are 60%, start there and trim wants rather than skipping savings entirely. As your income grows, resist letting 'wants' balloon — send raises toward the 20% bucket to build wealth faster."]],
      ["A quick example", ["On $3,000 take-home a month, 50/30/20 means about $1,500 for needs, $900 for wants, and $600 for savings and extra debt payoff. Automate that $600 on payday so it happens before you can spend it."]]
    ],
    faq: [
      ["What is the 50/30/20 rule?", "A budget that splits after-tax income into 50% needs, 30% wants, and 20% savings and debt payoff — a simple framework you adjust to your situation."],
      ["Does the 50/30/20 rule still work with high rent?", "Yes, as a target. If needs exceed 50%, trim wants first and protect at least some savings rather than abandoning the plan."],
      ["Is 20% enough to save?", "It's a solid baseline. If you can save more — especially by directing raises to savings — you'll build wealth and hit goals faster."]
    ],
    sources: [["Consumer Financial Protection Bureau — budgeting", "https://www.consumerfinance.gov/"], ["MyMoney.gov — federal financial literacy", "https://www.mymoney.gov/"]],
    related: [["How to Make a Budget (Step by Step)", "how-to-make-a-budget.html"], ["Building a Budget That Survives Real Life", "budget-that-survives-real-life.html"], ["How Much of Your Paycheck Should Go to Savings", "how-much-to-save.html"]]
  },
  {
    slug: "benjamin-graham-value-investing.html", kicker: "Investing", crumb: "Benjamin Graham", who: "Benjamin Graham", read: 6,
    title: "Benjamin Graham's Value Investing, Explained",
    ogtitle: "Benjamin Graham's Value Investing, Explained",
    desc: "Benjamin Graham — Warren Buffett's mentor and the father of value investing — gave us Mr. Market and the margin of safety. Here's what they mean.",
    h1: "Benjamin Graham's Value Investing, Explained",
    lead: "Benjamin Graham is often called the father of value investing and was Warren Buffett's teacher. His classic book <em>The Intelligent Investor</em> gave ordinary people two ideas that still hold up: treat the market as moody, and always leave a margin of safety.",
    sections: [
      ["Who Benjamin Graham was", ["Graham was an investor and professor whose ideas shaped generations, including Warren Buffett, who studied under him. His focus wasn't hot tips — it was a disciplined, unemotional way to value what you buy."]],
      ["Mr. Market", ["Graham's famous parable imagines the market as a business partner, 'Mr. Market,' who shows up every day offering to buy or sell at wildly different prices depending on his mood. The lesson: his mood is not the true value of your investment. You're free to ignore him, or to take advantage when he panics."]],
      ["Margin of safety", ["Graham's core principle is the margin of safety: only buy when the price is comfortably below your estimate of true worth, so you're protected if you're wrong. It's the investing version of building in room for error."]],
      ["Investor vs. speculator", ["Graham drew a sharp line between investing — buying based on analysis with safety of principal — and speculating, which is really gambling on price moves. Knowing which one you're doing is half the battle."]],
      ["What ordinary people can take from it", ["Most people won't analyze individual companies like Graham did, and that's fine — he also endorsed the idea that defensive investors do well with a simple, diversified approach. The durable lessons: don't let market mood drive your decisions, and never overpay."]]
    ],
    faq: [
      ["What is the margin of safety?", "Graham's idea of only buying when the price is well below your estimate of true value, so you're protected if your estimate is wrong."],
      ["Who is Mr. Market?", "Graham's parable for the market's mood swings — a partner offering wild prices daily. The point is that his mood isn't the real value of what you own."],
      ["Is value investing right for beginners?", "The mindset is useful for everyone, but most beginners are better served by a simple, diversified index approach — something Graham himself endorsed for defensive investors."]
    ],
    sources: [["Investor.gov (U.S. SEC)", "https://www.investor.gov/"], ["MyMoney.gov — federal financial literacy", "https://www.mymoney.gov/"]],
    related: [["Why Warren Buffett Says Buy Index Funds", "warren-buffett-index-funds.html"], ["Index Funds, Explained", "index-funds-explained.html"], ["How to Start Investing With $100", "how-to-start-investing.html"]]
  },
  {
    slug: "your-money-or-your-life.html", kicker: "Saving", crumb: "Your Money or Your Life", who: "Vicki Robin and Joe Dominguez", read: 6,
    title: "'Your Money or Your Life': Money as Life Energy",
    ogtitle: "'Your Money or Your Life': Money as Life Energy",
    desc: "Vicki Robin and Joe Dominguez's classic reframes money as 'life energy' — the hours of your life you trade for it. Here's the core idea.",
    h1: "'Your Money or Your Life': Money as Life Energy",
    lead: "<em>Your Money or Your Life</em>, by Vicki Robin and Joe Dominguez, is a foundational book for the financial-independence movement. Its big reframe: money is 'life energy' — the hours of your life you trade to earn it.",
    sections: [
      ["The book and its authors", ["First published decades ago and later updated, the book helped launch the modern FIRE (financial independence) movement. Its aim isn't just a bigger bank balance — it's a more intentional relationship with money and time."]],
      ["Money is life energy", ["The central idea: when you spend money, you're really spending the hours of life you worked to earn it. Calculating your true hourly wage — after commuting, work clothes, and stress — makes every purchase a question of 'is this worth that much of my life?'"]],
      ["Track every dollar", ["The book asks you to track all money in and out, without shame, to see where your life energy actually goes. Awareness alone tends to change behavior, steering spending toward what genuinely brings fulfillment."]],
      ["The crossover point", ["A famous concept is the 'crossover point' — when income from your savings and investments covers your expenses. Past that point, work becomes optional. It's the original blueprint for financial independence."]],
      ["What you can apply today", ["You don't have to chase early retirement to benefit. Ask 'how many hours of my life does this cost?' before big purchases, track your spending honestly for a month, and aim to widen the gap between what you earn and what you spend."]]
    ],
    faq: [
      ["What does 'money is life energy' mean?", "That money represents the hours of your life you traded to earn it, so spending is really spending your life energy — a lens that changes how you value purchases."],
      ["What is the crossover point?", "The moment when income from your investments covers your living expenses, making paid work optional. It's a core financial-independence milestone."],
      ["Is this book only for early retirement?", "No. Its habits — tracking spending and valuing time — help anyone spend more intentionally, whether or not they pursue early retirement."]
    ],
    sources: [["Investor.gov (U.S. SEC)", "https://www.investor.gov/"], ["MyMoney.gov — federal financial literacy", "https://www.mymoney.gov/"]],
    related: [["How Much of Your Paycheck Should Go to Savings", "how-much-to-save.html"], ["5 Money Lessons From The Psychology of Money", "psychology-of-money-lessons.html"], ["The Simple Path to Wealth: JL Collins' Core Idea", "jl-collins-simple-path-to-wealth.html"]]
  },
  {
    slug: "peter-lynch-invest-in-what-you-know.html", kicker: "Investing", crumb: "Peter Lynch", who: "Peter Lynch", read: 6,
    title: "Peter Lynch: 'Invest in What You Know'",
    ogtitle: "Peter Lynch: 'Invest in What You Know'",
    desc: "Peter Lynch ran one of history's best-performing funds. His famous advice — invest in what you know — is often misread. Here's what he really meant.",
    h1: "Peter Lynch: 'Invest in What You Know'",
    lead: "Peter Lynch ran the Fidelity Magellan fund to one of the best track records in mutual-fund history. His best-known advice — 'invest in what you know' — is often misunderstood. Here's the fuller idea.",
    sections: [
      ["Who Peter Lynch is", ["As manager of the Magellan fund, Lynch delivered exceptional returns over more than a decade. He then wrote popular books arguing that everyday people have real advantages if they use them wisely."]],
      ["'Invest in what you know'", ["Lynch noticed that ordinary people often spot great products and trends — in stores, at work, in daily life — before Wall Street does. His point was to pay attention to what you understand, not to buy a stock just because you like the brand."]],
      ["The part people skip: do your homework", ["Lynch was clear that noticing a good product is only step one. You still have to study the company's actual business and finances. 'Know what you own and why you own it' is as much his message as the famous slogan."]],
      ["Patience beats prediction", ["Lynch stressed holding good companies for the long term and not trying to time the market's swings. He argued that more money is lost preparing for or reacting to downturns than in the downturns themselves."]],
      ["What most people should actually do", ["Lynch's own advice for people who won't do the research was blunt: a simple index fund is the sensible choice. Picking individual stocks well takes real work — so either do the homework, or index and stay patient."]]
    ],
    faq: [
      ["What did Peter Lynch mean by 'invest in what you know'?", "Use the everyday knowledge you already have to spot promising companies — then research them properly before investing. It's not 'buy brands you like.'"],
      ["Did Lynch recommend stock-picking for everyone?", "No. He said people who won't do the research are better off in a simple index fund. Stock-picking well takes genuine effort."],
      ["What's his view on market timing?", "He argued against it, noting that trying to dodge downturns usually costs more than the downturns themselves. Patience wins."]
    ],
    sources: [["Investor.gov (U.S. SEC)", "https://www.investor.gov/"], ["U.S. Securities and Exchange Commission", "https://www.sec.gov/"]],
    related: [["Why Warren Buffett Says Buy Index Funds", "warren-buffett-index-funds.html"], ["Index Funds, Explained", "index-funds-explained.html"], ["Robo-Advisors vs. DIY Investing", "robo-advisors-vs-diy.html"]]
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

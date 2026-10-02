// Batch 3: articles targeting high-volume, highly-shareable ("viral") money
// searches. Honest and useful — realistic math with stated assumptions, no
// clickbait or false promises. Built from an existing article for a consistent
// shell/metadata.
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
    slug: "how-much-should-i-have-saved-by-30.html", kicker: "Saving", crumb: "How Much to Save by 30/40/50", read: 7,
    title: "How Much Should You Have Saved by 30, 40, and 50?",
    ogtitle: "How Much Should You Have Saved by 30, 40, and 50?",
    desc: "Common savings benchmarks by age — and why they're rough guides, not rules. How to use them without panicking if you're behind.",
    h1: "How Much Should You Have Saved by 30, 40, and 50?",
    lead: "It's the question behind a lot of late-night money anxiety: am I behind? There are well-known benchmarks by age — but they're rough guides, not a scoreboard. Here's what they say and how to use them sanely.",
    sections: [
      ["The common rule of thumb", ["A widely cited guideline suggests aiming for roughly <strong>1× your annual salary saved by 30, 3× by 40, and 6× by 50</strong> (climbing toward about 10× by retirement). These come from retirement-planning research and assume you keep investing along the way."]],
      ["Why these are guides, not rules", ["Everyone's situation is different — when you started working, student debt, cost of living, income swings. Someone who paid off big loans in their 20s may look 'behind' but be in great shape. Treat the benchmarks as a direction, not a verdict."]],
      ["If you're behind (most people feel they are)", ["Don't panic or give up — that's the worst response. The two levers that matter most are your saving rate and time. Increasing contributions even a few percent, and capturing any employer 401(k) match, closes gaps faster than you'd expect because of compounding."]],
      ["The number that matters more than age", ["Your <strong>saving rate</strong> — the share of income you save — predicts your future far better than hitting an age milestone. Someone saving 20% consistently will almost always overtake someone who saved little but started with more."]],
      ["How to catch up", ["Automate contributions so they happen before you can spend, direct raises and windfalls toward savings, and make sure you're getting the full employer match. If you're over 50, tax-advantaged accounts allow extra 'catch-up' contributions."]]
    ],
    faq: [
      ["How much should I have saved by 30?", "A common guideline is about 1× your annual salary, but it's a rough benchmark. Your saving rate and whether you're investing matter more than hitting an exact number."],
      ["What if I have nothing saved at 40?", "Start now and prioritise your saving rate and any employer match. Time is shorter but compounding still works, and catch-up contributions help after 50."],
      ["Is the 1x/3x/6x rule accurate?", "It's a reasonable planning guide based on retirement research, not a precise target. Use it for direction, not to judge yourself."]
    ],
    sources: [["Investor.gov (U.S. SEC) — saving & investing", "https://www.investor.gov/"], ["U.S. Department of Labor — retirement", "https://www.dol.gov/general/topic/retirement"]],
    related: [["How Much of Your Paycheck Should Go to Savings", "how-much-to-save.html"], ["Catching Up on Retirement Savings", "catching-up-retirement.html"], ["How to Start Investing With $100", "how-to-start-investing.html"]]
  },
  {
    slug: "how-to-become-a-millionaire.html", kicker: "Investing", crumb: "How to Become a Millionaire", read: 7,
    title: "How to Become a Millionaire on an Average Salary",
    ogtitle: "How to Become a Millionaire on an Average Salary",
    desc: "You don't need a huge income to reach $1M — you need time, a steady saving rate, and compound growth. Here's the honest math.",
    h1: "How to Become a Millionaire on an Average Salary",
    lead: "Becoming a millionaire sounds like it needs a big salary or a lucky break. The less exciting truth: for most people it's the result of an ordinary saving rate plus a lot of time and compounding. Here's the honest math.",
    sections: [
      ["The engine: compound growth", ["Money invested earns returns, and those returns earn returns too. Over decades this snowballs. The three inputs you control are how much you invest, how long it grows, and keeping costs low — time is the most powerful of the three."]],
      ["The honest math (with assumptions)", ["Assuming a long-run average return of about 7% a year after inflation — which is <em>not</em> guaranteed and varies year to year — investing roughly $500 a month for about 35 years lands near the $1,000,000 mark. Start earlier and the monthly amount needed drops sharply; start later and it rises."]],
      ["Why starting early beats earning more", ["Because of compounding, a dollar invested in your 20s can be worth several times a dollar invested in your 40s. Someone who invests modestly but early often ends up ahead of a higher earner who starts late. Time in the market is the cheat code."]],
      ["The practical steps", ["Capture any employer 401(k) match first (free money), invest consistently in low-cost, broad index funds, automate it so it's not a monthly decision, and leave it alone through market dips. Boring and automatic beats clever and sporadic."]],
      ["The honest caveats", ["Returns aren't guaranteed, inflation erodes value, and life happens. A million dollars decades from now won't buy what it does today. This isn't a get-rich scheme — it's a slow, boring, reliable-ish process, and that's exactly why it works for ordinary incomes."]]
    ],
    faq: [
      ["Can you become a millionaire on an average salary?", "For many people, yes — through a steady saving rate, low-cost investing, and decades of compounding. It's slow, not a scheme, and returns are never guaranteed."],
      ["How much do I need to invest to reach $1M?", "It depends on time and returns. Roughly $500/month for ~35 years at a ~7% average real return gets near $1M, but starting earlier lowers the amount needed a lot."],
      ["Is a 7% return guaranteed?", "No. 7% is a long-run average after inflation used for planning; real returns vary widely year to year and can be negative. Never treat it as guaranteed."]
    ],
    sources: [["Investor.gov — compound interest calculator", "https://www.investor.gov/"], ["MyMoney.gov — federal financial literacy", "https://www.mymoney.gov/"]],
    related: [["Index Funds, Explained", "index-funds-explained.html"], ["Why Warren Buffett Says Buy Index Funds", "warren-buffett-index-funds.html"], ["Free Compound Interest Calculator", "compound-interest-calculator.html"]]
  },
  {
    slug: "how-to-save-10000-in-a-year.html", kicker: "Saving", crumb: "Save $10,000 in a Year", read: 6,
    title: "How to Save $10,000 in a Year",
    ogtitle: "How to Save $10,000 in a Year",
    desc: "Saving $10k in a year comes down to about $833 a month. Here's a realistic plan to find it — automate it, cut the big costs, and boost income.",
    h1: "How to Save $10,000 in a Year",
    lead: "$10,000 in a year sounds huge. Break it down and it's about $833 a month, or $192 a week. Still a stretch for most, but a concrete target you can plan for. Here's a realistic way to get there.",
    sections: [
      ["Break the number down", ["$10,000 ÷ 12 = about $833/month, or roughly $192/week. Seeing the weekly number makes it feel less abstract and easier to attack. Not everyone can hit the full amount — scale the plan to what's realistic and aim for progress."]],
      ["Automate it first", ["Set up an automatic transfer to a separate high-yield savings account on payday, before you can spend it. Paying yourself first is the single biggest predictor of actually saving. Even starting below $833 builds the habit and the balance."]],
      ["Attack the big three, not the lattes", ["The largest savings come from your biggest costs — housing, transport, and food — not small treats. Refinancing, a cheaper car, a roommate, or cutting a few hundred in groceries beats obsessing over coffee. Fix the big levers once and the savings repeat every month."]],
      ["Cut recurring leaks", ["Audit subscriptions and recurring bills — streaming, apps, insurance, phone plans. Cancelling or renegotiating a handful of these can free up real money with a single afternoon of effort."]],
      ["Boost the income side", ["Saving has a floor; income doesn't. A raise, a side gig, selling unused stuff, or a seasonal hustle can fast-track the goal. Send that extra money straight to savings before it blends into spending."]]
    ],
    faq: [
      ["How much is $10,000 a year per month?", "About $833 per month, or roughly $192 per week. Breaking it down makes the goal feel manageable."],
      ["Where should I keep the money?", "A separate high-yield savings account — it earns interest and keeps the cash out of sight so you're less tempted to spend it."],
      ["What if I can't save the full $10k?", "Scale the plan. Automate what you can, aim for steady progress, and increase it as income grows. A partial win still builds the habit and a real cushion."]
    ],
    sources: [["Consumer Financial Protection Bureau — saving", "https://www.consumerfinance.gov/"], ["FDIC — deposit insurance", "https://www.fdic.gov/"]],
    related: [["How to Make a Budget (Step by Step)", "how-to-make-a-budget.html"], ["High-Yield Savings Accounts, Explained", "high-yield-savings-explained.html"], ["The Sinking Fund Method", "sinking-fund-method.html"]]
  },
  {
    slug: "stop-living-paycheck-to-paycheck.html", kicker: "Saving", crumb: "Stop Living Paycheck to Paycheck", read: 7,
    title: "How to Stop Living Paycheck to Paycheck",
    ogtitle: "How to Stop Living Paycheck to Paycheck",
    desc: "Breaking the paycheck-to-paycheck cycle isn't about willpower — it's about a small buffer, a simple plan, and automating the gap. Here's how.",
    h1: "How to Stop Living Paycheck to Paycheck",
    lead: "Living paycheck to paycheck is exhausting — one surprise and everything wobbles. Getting out isn't about trying harder; it's about building a small buffer and changing the order you do things. Here's a realistic way out.",
    sections: [
      ["See where the money actually goes", ["You can't fix what you can't see. Pull the last two or three months of transactions and sort them into needs, wants, and bills. Almost everyone finds surprises — subscriptions they forgot, or a category that's bigger than they thought."]],
      ["Build a tiny buffer first", ["Even $500 set aside changes everything, because it absorbs the small emergencies that otherwise go on a credit card and restart the cycle. Start with a small, reachable starter fund before anything else — it's the foundation."]],
      ["Automate the gap", ["Set up an automatic transfer to savings on payday, even if it's small. When saving happens first and automatically, you adjust spending to what's left instead of saving 'whatever remains' — which is usually nothing."]],
      ["Attack the biggest fixed costs", ["If the math genuinely doesn't work, the fix is usually in the big costs — rent, car, debt payments — not tiny cutbacks. A roommate, a cheaper car, or consolidating high-interest debt can free up breathing room that small savings can't."]],
      ["Raise the income ceiling", ["Cutting costs has a limit; earning more doesn't. A raise, a side income, or better-paid work can break the cycle for good. Direct any new income straight to the buffer and debt before lifestyle creep absorbs it."]]
    ],
    faq: [
      ["Why am I living paycheck to paycheck?", "Usually because expenses match or exceed income and there's no buffer, so every surprise restarts the cycle. Seeing your spending and building a small cushion breaks it."],
      ["What should I do first?", "Build a small starter emergency fund (even $500) and automate a transfer to savings on payday. The buffer stops small emergencies from resetting your progress."],
      ["Is it about budgeting or earning more?", "Both. Fix big fixed costs and automate saving, but if the math truly doesn't work, raising income is the durable fix."]
    ],
    sources: [["Consumer Financial Protection Bureau", "https://www.consumerfinance.gov/"], ["MyMoney.gov — federal financial literacy", "https://www.mymoney.gov/"]],
    related: [["How to Make a Budget (Step by Step)", "how-to-make-a-budget.html"], ["The 6-Month Emergency Fund Plan", "article.html"], ["Building a Budget That Survives Real Life", "budget-that-survives-real-life.html"]]
  },
  {
    slug: "what-is-the-fire-movement.html", kicker: "Investing", crumb: "The FIRE Movement", read: 7,
    title: "What Is the FIRE Movement? (Financial Independence, Retire Early)",
    ogtitle: "What Is the FIRE Movement?",
    desc: "FIRE means Financial Independence, Retire Early — saving aggressively to make work optional. Here's how it works, the math, and the trade-offs.",
    h1: "What Is the FIRE Movement?",
    lead: "FIRE stands for <strong>Financial Independence, Retire Early</strong>. It's a movement built on one idea: save and invest aggressively so that, one day, work becomes optional. Here's how it actually works — and the honest trade-offs.",
    sections: [
      ["The core idea", ["FIRE means building enough invested savings that the returns can cover your living costs, so you no longer <em>have</em> to work for money. 'Retire early' can mean quitting entirely, or just having the freedom to choose how you spend your time."]],
      ["The math: the 25x rule", ["A common FIRE rule of thumb is to save about <strong>25 times your annual expenses</strong>. That's tied to the idea of withdrawing roughly 4% a year. If you spend $40,000 a year, the target is around $1,000,000. The 4% figure is a guideline from research, not a guarantee."]],
      ["Saving rate is everything", ["What makes FIRE fast isn't a huge income — it's a high saving rate. Saving 50%+ of your income shortens the timeline dramatically, because you're both building savings faster and needing less to live on."]],
      ["The flavours of FIRE", ["<strong>Lean FIRE</strong> means a frugal lifestyle on a smaller number. <strong>Fat FIRE</strong> means a bigger cushion and more comfortable spending. <strong>Barista or Coast FIRE</strong> means saving enough early that you can ease off and let compounding finish the job."]],
      ["The honest trade-offs", ["FIRE requires real sacrifice now for freedom later, and the math depends on market returns that aren't guaranteed. Healthcare, inflation, and a long retirement add risk. It's not for everyone — but even 'slow FIRE' habits (high saving rate, low-cost investing) help anyone."]]
    ],
    faq: [
      ["What does FIRE stand for?", "Financial Independence, Retire Early — saving and investing aggressively so that work becomes optional."],
      ["What is the 25x rule?", "Aim to save about 25 times your annual expenses, linked to withdrawing roughly 4% a year. It's a planning guideline, not a guarantee."],
      ["Do you need a high income for FIRE?", "It helps, but the bigger driver is your saving rate. A high saving rate shortens the timeline more than a high income with high spending."]
    ],
    sources: [["Investor.gov (U.S. SEC)", "https://www.investor.gov/"], ["MyMoney.gov — federal financial literacy", "https://www.mymoney.gov/"]],
    related: [["The Simple Path to Wealth: JL Collins' Core Idea", "jl-collins-simple-path-to-wealth.html"], ["Your Money or Your Life", "your-money-or-your-life.html"], ["How to Become a Millionaire on an Average Salary", "how-to-become-a-millionaire.html"]]
  },
  {
    slug: "money-mistakes-in-your-20s.html", kicker: "Saving", crumb: "Money Mistakes in Your 20s", read: 6,
    title: "9 Money Mistakes to Avoid in Your 20s",
    ogtitle: "9 Money Mistakes to Avoid in Your 20s",
    desc: "The money habits you build in your 20s compound for decades. Here are nine common mistakes — and the simple fixes.",
    h1: "9 Money Mistakes to Avoid in Your 20s",
    lead: "Your 20s are the most powerful decade for money — not because you earn the most, but because time is on your side. Avoiding a few common mistakes now pays off for decades. Here are nine, with the fix for each.",
    sections: [
      ["1. Not starting to invest early", ["The biggest one. Thanks to compounding, money invested in your 20s can outgrow much larger amounts invested later. Even small automatic contributions now beat big ones in your 40s. Fix: start, even tiny."]],
      ["2. Skipping the employer 401(k) match", ["Not contributing enough to get a full employer match is leaving free money on the table — an instant return you can't get anywhere else. Fix: contribute at least up to the match."]],
      ["3. Carrying high-interest credit card debt", ["Credit card interest compounds against you, often above 20%. Paying only the minimum keeps you stuck for years. Fix: attack high-interest debt before investing beyond the match."]],
      ["4. No emergency fund", ["Without a buffer, every surprise goes on a card and restarts the debt cycle. Fix: build a small starter fund, then grow it to a few months of expenses."]],
      ["5. Lifestyle creep", ["Letting spending rise with every raise means you never get ahead. Fix: bank a chunk of each raise automatically before you adjust to it."]],
      ["6. Not having any budget", ["'Where did my money go?' is a monthly mystery without a plan. Fix: a simple framework like 50/30/20 is enough to start."]],
      ["7. Ignoring your credit score", ["A weak score means higher rates on future loans — costing thousands later. Fix: pay on time, keep balances low, check your reports."]],
      ["8. Trying to time the market or chase hype", ["Jumping between hot stocks or crypto usually loses to a boring index fund held patiently. Fix: invest steadily, ignore the noise."]],
      ["9. Not insuring against the big stuff", ["One accident or gap can wipe out years of progress. Fix: make sure you have health coverage and understand what you're protected against."]]
    ],
    faq: [
      ["What is the biggest money mistake in your 20s?", "Not investing early. Compounding means money invested in your 20s can outgrow much larger amounts invested later, so starting — even small — matters most."],
      ["Should I pay off debt or invest in my 20s?", "Capture any employer 401(k) match first, then clear high-interest debt (like credit cards), then invest more broadly."],
      ["How do I start building credit in my 20s?", "Pay every bill on time, keep credit-card balances low relative to your limit, and check your credit reports for errors."]
    ],
    sources: [["Consumer Financial Protection Bureau", "https://www.consumerfinance.gov/"], ["Investor.gov (U.S. SEC)", "https://www.investor.gov/"]],
    related: [["How to Start Investing With $100", "how-to-start-investing.html"], ["How to Build Credit From Scratch", "how-to-build-credit.html"], ["The 401(k) Match Most People Leave on the Table", "401k-match.html"]]
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

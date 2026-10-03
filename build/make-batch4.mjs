// Batch 4: more high-demand evergreen money searches. Honest, sourced, useful.
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
    slug: "what-is-an-etf.html", kicker: "Investing", crumb: "What Is an ETF?", read: 6,
    title: "What Is an ETF? (And How It Differs From a Mutual Fund)",
    ogtitle: "What Is an ETF?",
    desc: "An ETF lets you buy a whole basket of investments in one trade. Here's what ETFs are, how they differ from mutual funds, and how to buy one.",
    h1: "What Is an ETF?",
    lead: "ETF stands for <strong>exchange-traded fund</strong>. In plain English, it's a basket of investments — often hundreds of stocks or bonds — that you can buy and sell in a single trade, like a stock. Here's how they work and why so many people use them.",
    sections: [
      ["The basic idea", ["Instead of buying one company's stock, an ETF lets you own a slice of many at once. A single share of a broad index ETF can give you a piece of hundreds of companies, which spreads your risk — one company failing barely moves the whole basket."]],
      ["ETF vs. mutual fund", ["Both are baskets of investments, but an ETF trades on an exchange throughout the day like a stock, while a mutual fund is priced once per day after markets close. ETFs often have very low fees and no minimum beyond the price of one share, which makes them easy to start with."]],
      ["Index ETFs — the popular choice", ["Most beginners use <em>index</em> ETFs that simply track a market index (like the S&amp;P 500) rather than trying to beat it. They're cheap, diversified, and have a strong long-term track record — the same reasoning behind index funds generally."]],
      ["How to buy one", ["You buy ETFs through a brokerage account, often inside a tax-advantaged account like an IRA or 401(k). Look for a low expense ratio, decide how much to invest, and consider automating regular purchases so you invest consistently."]],
      ["What to watch for", ["Not all ETFs are cheap, broad index funds — some are narrow, leveraged, or expensive. Check the expense ratio and what the ETF actually holds before buying. For most people, a low-cost, broad-market ETF is the simplest choice."]]
    ],
    faq: [
      ["What is an ETF in simple terms?", "A basket of many investments you can buy in one trade on a stock exchange. It spreads your money across lots of companies at once, usually at low cost."],
      ["Is an ETF better than a mutual fund?", "Neither is universally better. ETFs trade throughout the day and often have lower fees and no minimum; mutual funds price once daily. For index investing, both work well."],
      ["Are ETFs good for beginners?", "Low-cost, broad-market index ETFs are a common, simple starting point because they're diversified and cheap. Narrow or leveraged ETFs are riskier and not beginner material."]
    ],
    sources: [["Investor.gov (U.S. SEC) — ETFs", "https://www.investor.gov/"], ["U.S. Securities and Exchange Commission", "https://www.sec.gov/"]],
    related: [["Index Funds, Explained", "index-funds-explained.html"], ["How to Start Investing With $100", "how-to-start-investing.html"], ["Robo-Advisors vs. DIY Investing", "robo-advisors-vs-diy.html"]]
  },
  {
    slug: "how-much-do-i-need-to-retire.html", kicker: "Retirement", crumb: "How Much to Retire", read: 7,
    title: "How Much Money Do You Need to Retire?",
    ogtitle: "How Much Money Do You Need to Retire?",
    desc: "A plain-English way to estimate your retirement number — the 25x rule, the 4% guideline, and the factors that change it.",
    h1: "How Much Money Do You Need to Retire?",
    lead: "There's no single magic number, but there's a simple way to get a realistic estimate. It starts with one question: how much do you expect to spend each year in retirement?",
    sections: [
      ["Start with your annual spending", ["Your retirement number is driven by your <em>expenses</em>, not your income. Estimate what you'll spend per year in retirement — housing, food, healthcare, fun. That annual figure is the foundation of every estimate below."]],
      ["The 25x rule", ["A common rule of thumb: aim for about <strong>25 times your expected annual expenses</strong>. If you'll spend $50,000 a year, that's roughly $1.25M. It's a planning guideline, not a guarantee, and your real number depends on other income and how long you'll be retired."]],
      ["The 4% guideline", ["The 25x rule comes from the idea of withdrawing about 4% of your savings in the first year, then adjusting for inflation. Research suggests this has historically lasted around 30 years in many cases — but it's a guideline, not a promise, and markets can differ from the past."]],
      ["What lowers the number", ["Social Security, a pension, part-time work, or a paid-off home all reduce how much you need to save, because they cover part of your spending. Factor these in — many people need less from their own savings than the raw 25x figure suggests."]],
      ["What raises it", ["Early retirement (more years to fund), high healthcare costs, inflation, and a more expensive lifestyle all push the number up. When in doubt, aim a bit higher and revisit the estimate every few years."]]
    ],
    faq: [
      ["How much do I need to retire?", "A rough estimate is about 25 times your expected annual expenses, adjusted down for Social Security or pensions. It depends on your spending, other income, and how long you'll be retired."],
      ["What is the 4% rule?", "A guideline for withdrawing about 4% of your savings the first year, then adjusting for inflation. It's linked to the 25x target and is a planning rule, not a guarantee."],
      ["Does Social Security count?", "Yes — it covers part of your spending, which lowers how much you need to save yourself. Estimate your benefit and subtract it from your annual needs."]
    ],
    sources: [["Investor.gov (U.S. SEC)", "https://www.investor.gov/"], ["Social Security Administration", "https://www.ssa.gov/"]],
    related: [["What Is the FIRE Movement?", "what-is-the-fire-movement.html"], ["Catching Up on Retirement Savings", "catching-up-retirement.html"], ["The 401(k) Match Most People Leave on the Table", "401k-match.html"]]
  },
  {
    slug: "how-to-pay-off-student-loans-faster.html", kicker: "Debt", crumb: "Pay Off Student Loans Faster", read: 6,
    title: "How to Pay Off Student Loans Faster",
    ogtitle: "How to Pay Off Student Loans Faster",
    desc: "Practical ways to clear student loans sooner — extra payments toward the highest rate, autopay discounts, refinancing trade-offs, and when not to rush.",
    h1: "How to Pay Off Student Loans Faster",
    lead: "Student loans can hang around for a decade or more on the standard plan. A few deliberate moves can shave years — and a lot of interest — off the timeline. Here's how, plus when rushing isn't the right call.",
    sections: [
      ["Know what you owe", ["List every loan with its balance, interest rate, and whether it's federal or private. Federal loans have protections and flexible repayment options that private loans usually don't — which affects how aggressively you should pay them off."]],
      ["Target the highest interest rate first", ["Extra payments do the most good on your highest-rate loan (the avalanche method). Make sure your servicer applies extra money to the <em>principal</em> of that specific loan, not just forward to next month's payment."]],
      ["Use the autopay discount", ["Many lenders knock 0.25% off your rate just for enabling automatic payments. It's small but free, and it also guarantees you never miss a due date."]],
      ["Consider refinancing — carefully", ["Refinancing can lower your rate if you have good credit and stable income, which speeds payoff. But refinancing <strong>federal</strong> loans into a private loan permanently gives up federal protections like income-driven plans and forgiveness options — weigh that carefully."]],
      ["When not to rush", ["If your loans are low-interest and you have no emergency fund, or you're missing an employer 401(k) match, those usually come first. Paying extra on a 4% loan while carrying 24% credit card debt is the wrong order."]]
    ],
    faq: [
      ["What's the fastest way to pay off student loans?", "Pay extra toward your highest-interest loan's principal, enable autopay for the rate discount, and put windfalls toward the balance — while keeping a small emergency fund."],
      ["Should I refinance my student loans?", "It can lower your rate with good credit, but refinancing federal loans into private ones gives up federal protections and forgiveness. Weigh that before refinancing federal debt."],
      ["Should I pay off loans or invest?", "Capture any employer 401(k) match first, clear high-interest debt, keep a small emergency fund — then decide between extra loan payments and investing based on the interest rate."]
    ],
    sources: [["Federal Student Aid (studentaid.gov)", "https://studentaid.gov/"], ["Consumer Financial Protection Bureau", "https://www.consumerfinance.gov/"]],
    related: [["Student Loan Repayment in 2026", "student-loan-repayment.html"], ["Debt Avalanche vs. Snowball", "debt-avalanche-vs-snowball.html"], ["Is Debt Consolidation Worth It?", "debt-consolidation.html"]]
  },
  {
    slug: "what-is-net-worth.html", kicker: "Saving", crumb: "What Is Net Worth", read: 5,
    title: "What Is Net Worth and How to Calculate It",
    ogtitle: "What Is Net Worth and How to Calculate It",
    desc: "Net worth is what you own minus what you owe. Here's how to calculate it, why it matters more than income, and how to grow it.",
    h1: "What Is Net Worth and How to Calculate It",
    lead: "Net worth is the single best snapshot of your financial health — better than your salary. It's simply what you own minus what you owe. Here's how to work it out and why it's worth tracking.",
    sections: [
      ["The simple formula", ["Net worth = <strong>assets − liabilities</strong>. Assets are things of value you own (cash, savings, investments, home, car). Liabilities are what you owe (mortgage, car loan, student loans, credit card balances). Subtract one from the other and you have your number."]],
      ["How to calculate yours", ["Add up everything you own at its current value, then add up every debt. The difference is your net worth. It can be negative — common early on, especially with student loans — and that's just a starting point, not a failure."]],
      ["Why it beats income", ["A high salary doesn't mean wealth if it all goes out again. Net worth captures what you actually keep. Two people earning the same can have wildly different net worths depending on how much they save and owe."]],
      ["How to grow it", ["Two levers: increase assets (save and invest more) and decrease liabilities (pay down debt). Every dollar you save or every dollar of debt you clear moves your net worth up. Tracking it every few months turns progress into something you can see."]]
    ],
    faq: [
      ["What is net worth?", "What you own minus what you owe — your assets (cash, investments, property) minus your liabilities (loans and debts). It's a snapshot of your financial health."],
      ["Can net worth be negative?", "Yes, and it's common early on — for example with student loans and little savings. It's a starting point to build from, not a sign of failure."],
      ["Why does net worth matter more than income?", "Income is what you earn; net worth is what you keep. A big salary doesn't build wealth if it's all spent — net worth shows what actually stays with you."]
    ],
    sources: [["Consumer Financial Protection Bureau", "https://www.consumerfinance.gov/"], ["MyMoney.gov — federal financial literacy", "https://www.mymoney.gov/"]],
    related: [["How to Become a Millionaire on an Average Salary", "how-to-become-a-millionaire.html"], ["How Much of Your Paycheck Should Go to Savings", "how-much-to-save.html"], ["Building a Budget That Survives Real Life", "budget-that-survives-real-life.html"]]
  },
  {
    slug: "how-much-should-i-spend-on-rent.html", kicker: "Housing", crumb: "How Much to Spend on Rent", read: 5,
    title: "How Much Should You Spend on Rent?",
    ogtitle: "How Much Should You Spend on Rent?",
    desc: "The 30% rule is a starting point, not a law. Here's how to decide what you can actually afford in rent without squeezing everything else.",
    h1: "How Much Should You Spend on Rent?",
    lead: "The classic answer is \"about 30% of your income.\" It's a decent starting point — but in expensive cities it breaks, and the real question is what rent leaves room for everything else in your life.",
    sections: [
      ["The 30% rule of thumb", ["A common guideline is to keep rent at or below <strong>30% of your gross (pre-tax) monthly income</strong>. On a $4,000/month income, that's about $1,200. It's a starting benchmark lenders and budgets often use — not a hard limit."]],
      ["Why it breaks in big cities", ["In high-cost areas, 30% can be impossible, and many people spend 40% or more. That's not automatically wrong, but the higher your rent, the less is left for savings, debt payoff, and emergencies — so go in with eyes open."]],
      ["Base it on take-home pay", ["A more realistic approach is to look at your <em>after-tax</em> income and make sure rent plus other essentials still leaves room to save. If rent crowds out your emergency fund entirely, it's too high for your situation."]],
      ["Ways to make it work", ["A roommate, a slightly longer commute, or a smaller place can free up hundreds a month. If you're stretched, cutting rent is one of the most powerful money moves because it's a large, recurring cost."]]
    ],
    faq: [
      ["How much of my income should go to rent?", "A common guideline is up to 30% of gross income, but it's a starting point. In expensive areas many spend more — just make sure rent still leaves room to save."],
      ["Is spending 40% on rent too much?", "It's higher than the rule of thumb and leaves less for savings and emergencies. It can be workable in high-cost cities, but it raises your financial risk."],
      ["Should rent be based on gross or net income?", "The 30% rule uses gross income, but checking it against your take-home pay gives a more realistic picture of what you can actually afford."]
    ],
    sources: [["HUD — rental help", "https://www.hud.gov/"], ["Consumer Financial Protection Bureau", "https://www.consumerfinance.gov/"]],
    related: [["How Much House Can You Actually Afford", "how-much-house-can-you-afford.html"], ["Renting vs. Buying in 2026", "renting-vs-buying.html"], ["The 50/30/20 Budget Rule", "50-30-20-budget-rule.html"]]
  },
  {
    slug: "dollar-cost-averaging.html", kicker: "Investing", crumb: "Dollar-Cost Averaging", read: 5,
    title: "Dollar-Cost Averaging, Explained",
    ogtitle: "Dollar-Cost Averaging, Explained",
    desc: "Dollar-cost averaging means investing a fixed amount on a schedule, no matter the price. Here's how it works and when it helps.",
    h1: "Dollar-Cost Averaging, Explained",
    lead: "Dollar-cost averaging (DCA) is a fancy name for a simple habit: invest a fixed amount on a regular schedule, regardless of what the market is doing. It's how most people already invest through a 401(k) — here's why it works.",
    sections: [
      ["What it is", ["Instead of trying to pick the perfect moment to invest, you put in the same amount every week or month. When prices are low you automatically buy more shares; when they're high you buy fewer. Over time this smooths out your average purchase price."]],
      ["Why it helps", ["DCA removes the pressure of timing the market — something even professionals rarely do well. It also builds a consistent habit and keeps emotion out of the decision: you invest on schedule whether the headlines are scary or euphoric."]],
      ["The honest nuance: lump sum vs. DCA", ["If you have a large amount to invest all at once, research suggests investing it as a <em>lump sum</em> has often beaten spreading it out, simply because markets rise more often than they fall. DCA's real advantage is for money you earn over time, and for reducing the regret and risk of going all-in right before a dip."]],
      ["How to do it", ["Automate it. Set a fixed amount to invest in a low-cost index fund on payday, and let it run. That's dollar-cost averaging — no spreadsheet, no market-watching, no willpower required."]]
    ],
    faq: [
      ["What is dollar-cost averaging?", "Investing a fixed amount on a regular schedule regardless of price. You buy more shares when prices are low and fewer when high, smoothing your average cost."],
      ["Is dollar-cost averaging better than lump-sum investing?", "For money you earn over time, DCA is the natural fit. For a large sum you already have, investing it at once has historically beaten spreading it out — but DCA reduces timing risk and regret."],
      ["How do I start dollar-cost averaging?", "Automate a fixed regular investment into a low-cost index fund — for example through your 401(k) or a recurring brokerage transfer."]
    ],
    sources: [["Investor.gov (U.S. SEC)", "https://www.investor.gov/"], ["U.S. Securities and Exchange Commission", "https://www.sec.gov/"]],
    related: [["How to Start Investing With $100", "how-to-start-investing.html"], ["Index Funds, Explained", "index-funds-explained.html"], ["What Is an ETF?", "what-is-an-etf.html"]]
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

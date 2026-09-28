// Generates new, genuine guide pages targeting common personal-finance
// searches. Each page is built from an existing article so the shell, scripts,
// theme and metadata stay identical; only head fields, JSON-LD and the article
// body are swapped. Real content only — no keyword stuffing / doorway pages.
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

    <div class="sources">
      <h2>Official resources</h2>
      <p class="src-note">Primary sources so you can check the current rules and numbers yourself:</p>
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

const GUIDES = [
  {
    slug: "how-to-make-a-budget.html",
    title: "How to Make a Budget (Step by Step)",
    ogtitle: "How to Make a Budget: A Simple Step-by-Step Guide",
    desc: "A plain-English, step-by-step way to build a budget that actually sticks — track income, list expenses, pick a method, and adjust.",
    crumb: "How to Make a Budget",
    kicker: "Saving",
    h1: "How to Make a Budget (Step by Step)",
    read: 7,
    lead: "A budget is just a plan for the money you already have. It is not about restriction — it is about deciding where your money goes before the month spends it for you. Here is how to build one in an afternoon.",
    sections: [
      ["Step 1: Add up your real monthly income", ["Start with what actually lands in your account after taxes — your take-home pay, not your salary on paper. If your income changes month to month, use the average of your last three months, or budget from your lowest recent month to stay safe.", "Include everything: paychecks, side income, and any regular support. This number is the ceiling for the whole plan."]],
      ["Step 2: List your fixed and variable expenses", ["Fixed costs stay roughly the same each month — rent or mortgage, insurance, loan payments, subscriptions. Variable costs move — groceries, gas, eating out, shopping. Pull your last two or three months of bank and card statements so you are working from real numbers, not guesses. Most people underestimate the variable side by a lot.", "Don't forget expenses that hit once or twice a year, like car registration or holidays. Divide them by 12 and set that amount aside monthly — this is the sinking-fund idea."]],
      ["Step 3: Pick a budgeting method", ["The best method is the one you will actually keep up. A common starting point is <strong>50/30/20</strong>: 50% of take-home pay to needs, 30% to wants, 20% to savings and debt payoff. If your rent is high, those percentages will shift — that is fine, the point is to have targets.", "If you want tighter control, try zero-based budgeting, where every dollar gets a job until income minus expenses equals zero."]],
      ["Step 4: Give savings a line, not the leftovers", ["Treat savings like a bill you pay yourself first, ideally automatically on payday. If you wait to save whatever is left at the end of the month, there usually isn't any. Even a small automatic transfer builds the habit and your emergency fund at the same time."]],
      ["Step 5: Track and adjust", ["A budget is a living plan, not a one-time document. Check in weekly for the first month or two — it takes a couple of cycles to get the numbers right. When a category is always over, the budget is wrong, not you; adjust it. The goal is a plan that matches your real life."]]
    ],
    faq: [
      ["What is the 50/30/20 rule?", "It splits your after-tax income into 50% needs, 30% wants, and 20% savings and debt payoff. It is a simple starting framework you can adjust to your situation."],
      ["How do I budget with an irregular income?", "Budget from your lowest recent month, cover your essentials first, and treat higher-earning months as a chance to build a buffer that smooths out the lean ones."],
      ["What is the best budgeting app?", "The best app is the one you will keep opening. Many people do fine with a simple spreadsheet; others prefer an app that syncs with their accounts. Try one for a month before committing."]
    ],
    sources: [
      ["Consumer Financial Protection Bureau — budgeting", "https://www.consumerfinance.gov/"],
      ["MyMoney.gov — federal financial literacy", "https://www.mymoney.gov/"]
    ],
    related: [
      ["Building a Budget That Survives Real Life", "budget-that-survives-real-life.html"],
      ["The Sinking Fund Method", "sinking-fund-method.html"],
      ["Free Budget Template", "budget-template.html"]
    ]
  },
  {
    slug: "how-to-build-credit.html",
    title: "How to Build Credit From Scratch",
    ogtitle: "How to Build Credit From Scratch",
    desc: "No credit history yet? Here's how to build a credit score from zero — secured cards, on-time payments, low utilization, and patience.",
    crumb: "How to Build Credit",
    kicker: "Debt",
    h1: "How to Build Credit From Scratch",
    read: 6,
    lead: "A credit score is a number lenders use to judge how likely you are to repay borrowed money. If you have never borrowed, you simply have no history yet — not a bad one. Here is how to start from zero the safe way.",
    sections: [
      ["What actually goes into your score", ["The two biggest factors are <strong>payment history</strong> (do you pay on time?) and <strong>credit utilization</strong> (how much of your available credit you use). Together they drive most of your score. Length of history, credit mix, and new applications matter less but still count."]],
      ["Start with a secured card or credit-builder loan", ["A secured credit card requires a refundable deposit that becomes your credit limit — it is the most common way to start. A credit-builder loan works in reverse: you make payments first and receive the money at the end, while the payments are reported to the credit bureaus. Both are designed for people with no history."]],
      ["Pay on time, every time", ["One missed payment can undo months of progress, so automate at least the minimum payment. On-time payments are the single most important habit for building and keeping a good score."]],
      ["Keep your utilization low", ["Try to use less than 30% of your limit, and under 10% is even better. If your limit is $500, keeping the balance under $50–150 helps your score. Paying the balance in full each month means you also pay no interest."]],
      ["Be patient and check your reports", ["Credit is built over years, not weeks — there is no legitimate shortcut. You can get your credit reports free from the three bureaus and check them for errors, which can drag your score down unfairly."]]
    ],
    faq: [
      ["How long does it take to build credit?", "You can generate a score in about six months of activity, but a strong score takes a few years of on-time payments and low balances."],
      ["Does checking my own credit hurt my score?", "No. Checking your own report is a 'soft' inquiry and never affects your score. Only lender 'hard' inquiries can, and only slightly."],
      ["What is a good credit score?", "Ranges vary by model, but generally the mid-600s and up is considered good, and 740+ is very good to excellent."]
    ],
    sources: [
      ["Consumer Financial Protection Bureau — credit scores", "https://www.consumerfinance.gov/"],
      ["AnnualCreditReport.com — official free reports", "https://www.annualcreditreport.com/"]
    ],
    related: [
      ["The Day After You Pay Off Your Last Credit Card", "after-paying-off-credit-card.html"],
      ["Is Debt Consolidation Worth It?", "debt-consolidation.html"],
      ["Financial Glossary", "glossary.html"]
    ]
  },
  {
    slug: "how-to-start-investing.html",
    title: "How to Start Investing With $100",
    ogtitle: "How to Start Investing With $100",
    desc: "You don't need thousands to begin. Here's how to start investing with $100 using index funds, retirement accounts, and automatic contributions.",
    crumb: "How to Start Investing",
    kicker: "Investing",
    h1: "How to Start Investing With $100",
    read: 6,
    lead: "You do not need to be rich to start investing — you need to start. Small, regular contributions and time do most of the work. Here is a beginner-friendly path that works even with $100.",
    sections: [
      ["First, cover the basics", ["Before investing, make sure you have a small emergency fund and no high-interest debt. Paying off a credit card charging 24% is a guaranteed return that beats almost any investment. Investing money you might need next month is risky, because markets fall as well as rise."]],
      ["Use a retirement account if you can", ["If your employer offers a 401(k) match, that is the best first stop — it is free money. Otherwise, an IRA (Roth or traditional) lets your investments grow with tax advantages. These accounts are wrappers; you still choose what to buy inside them."]],
      ["Buy a broad index fund", ["For most beginners, a low-cost index fund that holds the whole market is the simplest, most proven choice. Instead of betting on one company, you own a tiny slice of hundreds or thousands. Fees matter a lot over decades, so look for funds with very low expense ratios."]],
      ["Automate and ignore", ["Set up an automatic transfer — even $25 a month — so investing happens without willpower. Then leave it alone. The biggest mistake new investors make is panic-selling when the market dips. Time in the market beats timing the market."]]
    ],
    faq: [
      ["Is $100 really enough to start investing?", "Yes. Many brokerages have no minimum and allow fractional shares, so you can buy a piece of a fund with a small amount and add to it regularly."],
      ["What is an index fund?", "A fund that tracks a market index, giving you instant diversification across many companies at very low cost, instead of picking individual stocks."],
      ["Should I pay off debt or invest first?", "Generally, capture any employer 401(k) match first, then pay off high-interest debt, then invest more broadly."]
    ],
    sources: [
      ["Investor.gov (U.S. SEC)", "https://www.investor.gov/"],
      ["MyMoney.gov — federal financial literacy", "https://www.mymoney.gov/"]
    ],
    related: [
      ["Index Funds, Explained", "index-funds-explained.html"],
      ["How Much Risk Should You Take, By Age", "risk-by-age.html"],
      ["Robo-Advisors for Beginners", "robo-advisors-for-beginners.html"]
    ]
  },
  {
    slug: "roth-ira-vs-401k.html",
    title: "Roth IRA vs. 401(k): Which Comes First?",
    ogtitle: "Roth IRA vs. 401(k): Which Comes First?",
    desc: "How to decide between a Roth IRA and a 401(k) — the employer match, contribution limits, taxes now vs. later, and a simple order to fund them.",
    crumb: "Roth IRA vs. 401(k)",
    kicker: "Retirement",
    h1: "Roth IRA vs. 401(k): Which Comes First?",
    read: 6,
    lead: "A Roth IRA and a 401(k) are both retirement accounts with tax advantages, but they work differently. You do not always have to choose — but if money is limited, the order you fund them in matters.",
    sections: [
      ["The key difference: taxes now or later", ["A traditional 401(k) is funded with pre-tax money — you get a tax break today and pay tax when you withdraw in retirement. A Roth IRA is funded with after-tax money — no break today, but qualified withdrawals in retirement are tax-free. Which is better depends partly on whether you expect to be in a higher or lower tax bracket later."]],
      ["Start with the employer match", ["If your 401(k) has an employer match, contribute at least enough to get the full match before anything else. A 50% or 100% match is an immediate, guaranteed return you cannot get anywhere else. Leaving it on the table is leaving free money behind."]],
      ["Then consider a Roth IRA", ["After the match, a Roth IRA is often the next stop because it offers tax-free growth and more investment choices than most workplace plans. There are income limits on who can contribute directly, and annual contribution limits set by the IRS."]],
      ["A simple funding order", ["A widely used order: (1) 401(k) up to the full match, (2) max a Roth IRA if eligible, (3) go back and contribute more to the 401(k). Adjust to your situation, but this captures free money first and tax-free growth second."]]
    ],
    faq: [
      ["Can I have both a Roth IRA and a 401(k)?", "Yes. Many people contribute to both, and they have separate contribution limits set by the IRS."],
      ["Is a Roth or traditional 401(k) better?", "If you expect a higher tax rate in retirement, Roth (pay tax now) can win; if you expect a lower rate, traditional (defer tax) can. Many people split the difference."],
      ["What are the contribution limits?", "They change yearly and are set by the IRS. Check the current-year limits before you max out, as they are adjusted for inflation."]
    ],
    sources: [
      ["IRS — retirement plans", "https://www.irs.gov/"],
      ["U.S. Department of Labor — retirement", "https://www.dol.gov/general/topic/retirement"]
    ],
    related: [
      ["Roth vs. Traditional 401(k)", "roth-vs-traditional-401k.html"],
      ["The 401(k) Match Most People Leave on the Table", "401k-match.html"],
      ["Catching Up on Retirement Savings", "catching-up-retirement.html"]
    ]
  },
  {
    slug: "hsa-vs-fsa.html",
    title: "HSA vs. FSA, Explained",
    ogtitle: "HSA vs. FSA: What's the Difference?",
    desc: "HSAs and FSAs both save you tax on health costs, but they work very differently. Here's how to tell them apart and which one fits you.",
    crumb: "HSA vs. FSA",
    kicker: "Family",
    h1: "HSA vs. FSA, Explained",
    read: 5,
    lead: "Health savings accounts (HSAs) and flexible spending accounts (FSAs) both let you pay for medical costs with pre-tax money. They sound similar, but the rules — especially about keeping your money — are very different.",
    sections: [
      ["What they have in common", ["Both let you set aside pre-tax dollars for qualified medical expenses like copays, prescriptions, and dental care. That lowers your taxable income, so you effectively get a discount on health costs you were going to have anyway."]],
      ["The big difference: 'use it or lose it'", ["An FSA is generally 'use it or lose it' — money left at the end of the plan year is usually forfeited, though some plans allow a small carryover or grace period. An HSA is yours forever: unused money rolls over every year and stays with you even if you change jobs."]],
      ["Who can use each", ["An HSA is only available if you have a qualifying high-deductible health plan (HDHP). An FSA is typically offered through an employer regardless of your plan type. If you have an HDHP, the HSA is often the more powerful account."]],
      ["Why an HSA is also a stealth retirement account", ["Because HSA money rolls over and can be invested, many people use it as a long-term account: contributions are pre-tax, growth is tax-free, and withdrawals for medical costs are tax-free. That triple tax advantage is rare — but only pay from it for medical expenses to keep it tax-free."]]
    ],
    faq: [
      ["Can I have both an HSA and an FSA?", "Usually not at the same time, with a narrow exception for a 'limited-purpose' FSA covering dental and vision. Check your plan's rules."],
      ["What happens to my FSA money if I don't use it?", "It is typically forfeited at year-end, though some plans allow a limited carryover or grace period. Plan your contributions to match expenses you know are coming."],
      ["Do I lose my HSA if I change jobs?", "No. An HSA belongs to you, not your employer, and the balance goes with you."]
    ],
    sources: [
      ["IRS — health savings accounts", "https://www.irs.gov/"],
      ["HealthCare.gov", "https://www.healthcare.gov/"]
    ],
    related: [
      ["Open Enrollment Health Insurance Guide", "open-enrollment-guide.html"],
      ["Life Insurance Basics for Parents", "life-insurance-for-parents.html"],
      ["Financial Glossary", "glossary.html"]
    ]
  },
  {
    slug: "how-to-save-for-a-down-payment.html",
    title: "How to Save for a Down Payment",
    ogtitle: "How to Save for a House Down Payment",
    desc: "How much you really need for a down payment, where to keep the money, and a realistic plan to save for a house without derailing the rest of your finances.",
    crumb: "Saving for a Down Payment",
    kicker: "Housing",
    h1: "How to Save for a Down Payment",
    read: 7,
    lead: "The down payment is the biggest hurdle for most first-time buyers. The good news: you often need less than you think, and a clear plan makes a large number feel manageable.",
    sections: [
      ["How much do you actually need?", ["The old '20% down' rule avoids private mortgage insurance (PMI), but it is not required. Many loans allow far less down, and there are first-time buyer programs with low or no down payment. Putting less down means a bigger loan and usually PMI, so weigh buying sooner against paying more over time."]],
      ["Don't forget closing costs", ["Beyond the down payment, closing costs typically add several percent of the purchase price — appraisal, title, taxes, and lender fees. Budget for these separately so they do not catch you off guard at the finish line."]],
      ["Where to keep the money", ["A down payment you plan to use within a few years does not belong in the stock market — a bad year could wipe out part of it right when you need it. Keep it somewhere safe and liquid, like a high-yield savings account, where it earns interest without risk."]],
      ["Build a realistic monthly plan", ["Work backward: take your target, subtract what you have, and divide by your timeline to get a monthly savings number. Automate that transfer on payday. If the monthly number is impossible, extend the timeline or lower the target price — do not skip the emergency fund to get there faster."]],
      ["Look into first-time buyer help", ["Many state and federal programs offer down-payment assistance, grants, or favorable loans for first-time buyers. These can dramatically shorten your timeline, so check what you qualify for before assuming you need the full amount yourself."]]
    ],
    faq: [
      ["Do I really need 20% down?", "No. 20% avoids PMI, but many loans allow much less. It is a trade-off between buying sooner and paying more over the life of the loan."],
      ["Where should I keep my down-payment savings?", "In a safe, liquid account like a high-yield savings account — not investments — if you plan to buy within a few years."],
      ["What are closing costs?", "One-time fees to finalize the purchase — appraisal, title, taxes, and lender charges — usually a few percent of the price, paid on top of the down payment."]
    ],
    sources: [
      ["HUD — homebuyer programs", "https://www.hud.gov/"],
      ["Consumer Financial Protection Bureau — mortgages", "https://www.consumerfinance.gov/"]
    ],
    related: [
      ["First-Time Homebuyer Programs", "first-time-homebuyer-programs.html"],
      ["How Much House Can You Actually Afford", "how-much-house-can-you-afford.html"],
      ["High-Yield Savings Accounts, Explained", "high-yield-savings-explained.html"]
    ]
  }
];

const TOPIC = { Debt: "debt.html", Saving: "saving.html", Investing: "investing.html", Retirement: "retirement.html", Housing: "housing.html", Family: "family.html" };
const trunc = (t) => (t.length > 46 ? t.slice(0, 45).trimEnd() + "…" : t);

let done = 0;
for (const g of GUIDES) {
  let s = baseN;
  s = s.replace(`<title>${BASE_TITLE} — Clearcoin</title>`, `<title>${esc(g.title)} — Clearcoin</title>`);
  s = s.split(BASE_TITLE).join(esc(g.ogtitle));
  s = s.split(BASE_DESC).join(esc(g.desc));
  // only the canonical + og:url point at this page; other slug mentions (search
  // index, related links) legitimately point at the original article
  s = s.replace(`<meta property="og:url" content="https://clearcoin.cc/${BASE_SLUG}">`, `<meta property="og:url" content="https://clearcoin.cc/${g.slug}">`);
  s = s.replace(`<link rel="canonical" href="https://clearcoin.cc/${BASE_SLUG}">`, `<link rel="canonical" href="https://clearcoin.cc/${g.slug}">`);
  // replace all head JSON-LD (from first ld+json block to </head>)
  s = s.replace(/<script type="application\/ld\+json">[\s\S]*<\/head>/, jsonld(g) + "\n</head>");
  // fix the visible breadcrumb (category + this article's title)
  s = s.replace(/<div class="breadcrumbs">[\s\S]*?<\/div>/, `<div class="breadcrumbs"><a href="index.html">Home</a> / <a href="${TOPIC[g.kicker]}">${g.kicker}</a> / ${esc(trunc(g.ogtitle))}</div>`);
  // replace the article body
  s = s.replace(/<article class="article" id="main">[\s\S]*?<\/article>/, articleHTML(g));
  fs.writeFileSync(g.slug, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
  done++;
  console.log("wrote", g.slug);
}
console.log("generated", done, "guides");

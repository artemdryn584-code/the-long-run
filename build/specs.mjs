// One entry per article: which diagram it gets, and (where the article already
// quotes real numbers) a CSS bar chart. Illustration types are spread so that no
// two neighbouring articles look alike — see the tally printed by apply.mjs.
import * as I from "./illus.mjs";

export const SPECS = {
  // ---------------- Saving ----------------
  "article.html": {
    callouts: [
      { type: "tip", anchor: "Each stage is a real, visible finish line" },
    ],
    illus: I.stageLadder({
      label: "Four stages of building an emergency fund: a starter fund of $500 to $1,000, then one month, three months and finally six months of essential expenses.",
      caption: "Four finish lines instead of one. Each stage is small enough to reach before the next one starts.",
      stages: [
        { name: "Starter", value: "$500–$1,000", note: "small emergencies" },
        { name: "One month", value: "1 month", note: "essentials only" },
        { name: "Three months", value: "3 months", note: "windfalls help here" },
        { name: "Six months", value: "6 months", note: "the finish line" },
      ],
    }),
  },

  "how-much-to-save.html": {
    illus: I.waterfallOrder({
      label: "The order money should flow: employer 401(k) match, a $500 to $1,000 starter emergency fund, debt minimums plus extra on the highest rate, then the rest of the emergency fund, then long-term investing.",
      caption: "The order matters more than the percentage. Each step only starts once the one above it is handled.",
      steps: [
        "Employer 401(k) match — the only guaranteed return here",
        "A $500–$1,000 starter emergency fund",
        "Debt minimums, plus extra on the highest rate",
        "Finish the emergency fund",
        "Long-term investing",
      ],
    }),
    bars: {
      title: "A savings rate that flexes with your situation",
      rows: [
        { label: "Still paying high-interest debt", pct: 5, value: "Minimums + extra to debt" },
        { label: "Building the cushion", pct: 55, value: "15–20% of what is left" },
        { label: "Retirement on track", pct: 80, value: "Push higher" },
      ],
      note: "Percentages apply to what is left after fixed costs, not to your gross salary.",
    },
  },

  "high-yield-savings-explained.html": {
    callouts: [
      { type: "tip", anchor: "An <a href=\"article.html\">emergency fund</a> needs to be safe" },
      { type: "warning", anchor: "Rates on savings accounts move with broader interest rate conditions" },
    ],
    illus: I.checklistGrid({
      label: "A checklist of four things to confirm before opening a high-yield savings account: FDIC or NCUA insurance, no monthly fees, no minimum balance, and one to two business day transfers.",
      caption: "Four things worth confirming before the rate is even worth comparing.",
      heading: "Before you open one, confirm",
      items: [
        "FDIC or NCUA insured",
        "No monthly maintenance fee",
        "No minimum balance to earn the rate",
        "Transfers back in 1–2 business days",
        "Rate is not a short promo",
        "A different bank than your checking",
      ],
    }),
  },

  "best-high-yield-savings-accounts.html": {
    callouts: [
      { type: "tip", anchor: "Once you've checked all of the above" },
    ],
    illus: I.flowSteps({
      label: "Four steps for comparing any high-yield savings account: confirm insurance, check whether the rate is permanent or promotional, look for fees and minimums, then check transfer speed.",
      caption: "Compare by method rather than by name — the names on any best-of list age faster than the method does.",
      steps: [
        { title: "1. Insurance", body: "FDIC or NCUA|up to $250,000" },
        { title: "2. The rate", body: "Permanent or|promotional?" },
        { title: "3. The catches", body: "Fees, minimums,|transfer caps" },
        { title: "4. Getting out", body: "1–3 business days|back to checking" },
      ],
    }),
  },

  "holiday-budget-guide.html": {
    callouts: [
      { type: "tip", anchor: "financially if the first credit card statement of the new year" },
    ],
    illus: I.segmentedBar({
      label: "One holiday total split across four categories — gifts, travel, food and decorations — instead of four separate budgets.",
      caption: "Each category looks reasonable on its own. Splitting one total is what catches the overshoot.",
      total: "One holiday total, split before the shopping starts",
      segments: [
        { pct: 45, name: "Gifts" },
        { pct: 25, name: "Travel" },
        { pct: 20, name: "Food and hosting" },
        { pct: 10, name: "Decorations and cards" },
      ],
    }),
  },

  "sinking-fund-method.html": {
    callouts: [
      { type: "tip", anchor: "A sinking fund is a small savings account" },
    ],
    illus: I.buckets({
      label: "Four labelled sinking funds — car repairs, holidays, vet bills and insurance — each filling at its own monthly rate.",
      caption: "One account, separate labels. Each irregular cost fills at its own monthly rate instead of arriving all at once.",
      items: [
        { name: "Car repairs", value: "yearly ÷ 12", pct: 72 },
        { name: "Holidays", value: "yearly ÷ 12", pct: 48 },
        { name: "Vet bills", value: "yearly ÷ 12", pct: 30 },
        { name: "Insurance", value: "yearly ÷ 12", pct: 86 },
      ],
    }),
  },

  "no-income-tax-states.html": {
    callouts: [
      { type: "warning", anchor: "Housing costs, insurance, healthcare" },
      { type: "tip", anchor: "Tax rates and which specific states charge what change over time" },
    ],
    illus: I.tileMap({
      label: "The nine states with no income tax, each annotated with where the revenue comes from instead.",
      caption: "No income tax does not mean low tax. The money is collected somewhere else.",
      heading: "No income tax — and what replaces it",
      tiles: [
        { name: "Texas", note: "property tax", strong: true },
        { name: "Florida", note: "sales tax, insurance" },
        { name: "Nevada", note: "sales tax, tourism" },
        { name: "Washington", note: "sales tax" },
        { name: "Tennessee", note: "sales tax" },
        { name: "Wyoming", note: "resource revenue" },
        { name: "South Dakota", note: "sales tax" },
        { name: "Alaska", note: "resource revenue" },
      ],
    }),
  },

  "budgeting-apps-compared.html": {
    illus: I.tileMap({
      label: "The four categories of budgeting app: envelope or zero-based, automatic tracking, spreadsheet templates, and goal or debt payoff focused.",
      caption: "Pick the category that matches how you already think about money; the app inside it matters far less.",
      heading: "Four categories, not one ranking",
      tiles: [
        { name: "Envelope", note: "you assign every dollar", strong: true },
        { name: "Auto-tracking", note: "it sorts, you review" },
        { name: "Spreadsheet", note: "full control, manual" },
        { name: "Goal-focused", note: "one target at a time" },
      ],
    }),
  },

  // ---------------- Debt ----------------
  "debt-avalanche-vs-snowball.html": {
    illus: I.twoColumnCompare({
      label: "Two payoff orders compared: avalanche tackles the highest interest rate first, snowball tackles the smallest balance first.",
      caption: "Same debts, two orders. Avalanche costs less in interest; snowball closes an account sooner.",
      left: {
        title: "Avalanche — highest rate first",
        items: ["Card A — highest APR", "Card B — next highest", "Car loan", "Student loan — lowest APR"],
      },
      right: {
        title: "Snowball — smallest balance first",
        items: ["Store card — smallest", "Card B", "Card A", "Car loan — largest"],
      },
    }),
  },

  "debt-consolidation.html": {
    illus: I.balanceScale({
      label: "A balance scale weighing when consolidation helps against how it commonly fails.",
      caption: "Consolidation is a rate-and-behaviour question, not a paperwork one.",
      left: {
        title: "It genuinely helps when",
        items: ["The new rate is clearly lower", "You can clear a 0% card in time", "The cards stay unused"],
        tilt: 12,
      },
      right: {
        title: "It backfires when",
        items: ["Fees erase the rate gap", "The 0% window runs out", "The old cards fill again"],
        tilt: -12,
      },
      verdict: "The failure mode is behavioural, not mathematical",
    }),
  },

  "after-paying-off-credit-card.html": {
    callouts: [
      { type: "example", anchor: "The statement comes back showing a zero balance" },
    ],
    illus: I.timeline({
      label: "A timeline of what to do after the final credit card payment clears: keep the card open, redirect the payment, rebuild the cushion, then check your credit report.",
      caption: "The freed-up payment disappears into everyday spending unless it is redirected on purpose.",
      events: [
        { when: "Day 1", what: "Balance hits $0" },
        { when: "Same week", what: "Redirect the payment" },
        { when: "Next months", what: "Finish the cushion" },
        { when: "Keep going", what: "Card stays open" },
      ],
    }),
  },

  "student-loan-repayment.html": {
    illus: I.twoColumnCompare({
      label: "Standard ten-year repayment compared with income-driven repayment, including what each one costs and what it protects.",
      caption: "Cheapest overall and most affordable each month are rarely the same plan.",
      left: {
        title: "Standard, 10 years",
        items: ["Highest monthly payment", "Lowest total interest", "Done in a decade", "No forgiveness needed"],
      },
      right: {
        title: "Income-driven",
        items: ["Payment tied to income", "More interest overall", "Longer timeline", "Keeps PSLF on the table"],
      },
    }),
  },

  "tax-season-checklist.html": {
    illus: I.checklistGrid({
      label: "A checklist of documents to gather before filing: W-2s, 1099s, mortgage interest statements, student loan interest statements, childcare provider details and last year's return.",
      caption: "Gathering first turns filing into data entry instead of a scavenger hunt.",
      heading: "Gather before you sit down to file",
      items: [
        "W-2 from every employer",
        "1099s for other income",
        "Mortgage interest statement",
        "Student loan interest statement",
        "Childcare provider's tax ID",
        "Charitable donation receipts",
        "Social Security numbers",
        "Last year's return",
      ],
    }),
  },

  // ---------------- Investing ----------------
  "index-funds-explained.html": {
    callouts: [
      { type: "warning", anchor: "Index funds still go down when the overall market goes down" },
      { type: "example", anchor: "Part of the reason is the fee itself" },
      { type: "tip", anchor: "For most people building long-term retirement savings" },
    ],
    illus: I.growthCurve({
      label: "A line rising over thirty years, showing that the later gains come mostly from growth on previous growth rather than from new contributions.",
      caption: "The shape is the point: the later years do most of the work, which is why low fees compound so heavily.",
      points: [100, 116, 138, 168, 208, 262, 335],
      xLabels: ["Year 0", "5", "10", "15", "20", "25", "30"],
      startLabel: "What you put in",
      endLabel: "Growth on the growth",
    }),
    bars: {
      title: "Annual fee, index fund vs. many active funds",
      rows: [
        { label: "Index fund", pct: 7, value: "0.03–0.10%" },
        { label: "Many active funds", pct: 100, value: "0.5–1.5%+", muted: true },
      ],
      note: "Bars are drawn to the figures quoted above. Over twenty to thirty years that gap compounds.",
    },
  },

  "recession-and-retirement.html": {
    illus: I.growthCurve({
      label: "A market line that dips during a downturn and then recovers above its previous level, with contributions continuing through the dip.",
      caption: "With ten or more years to go, the dip is the part where contributions buy more shares.",
      points: [100, 112, 78, 86, 118, 152, 190],
      xLabels: ["Before", "Peak", "Downturn", "Bottom", "Recovery", "Later", "Much later"],
      startLabel: "Where you started",
      endLabel: "Recovery, plus what you bought cheap",
    }),
  },

  "risk-by-age.html": {
    illus: I.glidepath({
      label: "A glide path showing the share held in stocks falling gradually from the twenties to the sixties, with bonds and cash taking up the rest.",
      caption: "A rough glide path, not a formula. What actually sets the mix is when you need each pool of money.",
      ages: ["25", "35", "45", "55", "65"],
      stockPct: [90, 85, 75, 65, 50],
    }),
  },

  "robo-advisors-vs-diy.html": {
    callouts: [
      { type: "tip", anchor: "If you land on a robo-advisor, a quick checklist" },
    ],
    illus: I.coverageBar({
      label: "Annual cost compared: a robo-advisor charges 0.25 to 0.50 percent plus fund fees, while do-it-yourself index funds cost only 0.03 to 0.10 percent.",
      caption: "The fee gap is real — but the honest comparison is against what you would actually do without the robo-advisor.",
      rows: [
        { name: "Robo-advisor", value: 50, value_label: "0.25–0.50% + fund fees" },
        { name: "DIY index funds", value: 10, value_label: "0.03–0.10%", muted: true },
      ],
      note: "Drawn to the ranges quoted in this article.",
    }),
    bars: {
      title: "What each option costs per year",
      rows: [
        { label: "Robo-advisor fee", pct: 100, value: "0.25–0.50%" },
        { label: "DIY fund fees", pct: 20, value: "0.03–0.10%", muted: true },
      ],
      note: "A fee is worth paying if the alternative is not investing at all, or selling in a panic.",
    },
  },

  "robo-advisors-for-beginners.html": {
    callouts: [
      { type: "warning", anchor: "Since fees and features change" },
    ],
    illus: I.flowSteps({
      label: "Four things to check before choosing a robo-advisor: total cost, account minimum, supported account types, and whether tax-loss harvesting is included.",
      caption: "Four checks, in the order that rules services out fastest.",
      steps: [
        { title: "Total cost", body: "Management fee|plus fund fees" },
        { title: "Minimum", body: "None, or a few|thousand dollars" },
        { title: "Account types", body: "Taxable, IRAs,|401(k) rollovers" },
        { title: "Tax features", body: "Tax-loss harvesting|and at which tier" },
      ],
    }),
  },

  // ---------------- Retirement ----------------
  "401k-match.html": {
    illus: I.matchStack({
      label: "A 50 percent match on the first 6 percent: you contribute 6 percent of salary, the employer adds 3 percent, and 9 percent lands in the account.",
      caption: "With a 50%-of-the-first-6% formula, contributing 6% puts 9% into the account. Stopping at 3% leaves half the match behind.",
      you: { label: "You: 6%", caption: "of your salary", amount: 6 },
      matched: { label: "Employer: 3%", caption: "added by the match", amount: 3 },
      total: { label: "9% invested", caption: "for the cost of 6%" },
      note: "Your own formula is in the plan documents",
    }),
  },

  "401k-job-change.html": {
    illus: I.flowSteps({
      label: "The four options for an old 401(k) when you change jobs: leave it, roll it into the new employer's plan, roll it into an IRA, or cash it out.",
      caption: "Three of these keep the money invested. The fourth is the expensive one.",
      steps: [
        { title: "Leave it", body: "Stays invested|easy to lose track of" },
        { title: "New 401(k)", body: "One account|the new plan's menu" },
        { title: "Roll to an IRA", body: "Widest choice|you manage it" },
        { title: "Cash out", body: "Taxes now|plus a 10% penalty" },
      ],
    }),
  },

  "roth-vs-traditional-401k.html": {
    illus: I.twoColumnCompare({
      label: "Traditional and Roth 401(k) compared on when the tax is paid, who each suits, and where the employer match lands.",
      caption: "The difference is timing: which side of your career pays the tax.",
      left: {
        title: "Traditional — tax break now",
        items: ["Cuts taxable income today", "Withdrawals are taxed", "Often wins in a lower bracket later", "The match lands here either way"],
      },
      right: {
        title: "Roth — tax break later",
        items: ["No break on today's taxes", "Qualified withdrawals are tax-free", "Often wins in a similar or higher bracket", "Splitting both is a fair hedge"],
      },
    }),
  },

  "catching-up-retirement.html": {
    illus: I.waterfallOrder({
      label: "The order of levers for catching up on retirement savings: employer match, catch-up contributions, working longer, cutting fixed costs, then adjusting the plan.",
      caption: "Ordered by how much each one moves the needle — not by how dramatic it feels.",
      steps: [
        "Take the full employer match",
        "Use catch-up contributions after 50",
        "Work two or three years longer",
        "Cut a large fixed cost, not small ones",
        "Right-size the plan to the real timeline",
      ],
    }),
  },

  // ---------------- Housing ----------------
  "renting-vs-buying.html": {
    illus: I.balanceScale({
      label: "A balance scale comparing the real cost of renting against the real cost of buying, including the costs most calculators leave out.",
      caption: "Most calculators weigh the left side against a mortgage payment alone. The right side is longer than that.",
      left: {
        title: "Renting",
        items: ["Rent", "Renters insurance", "What the down payment could earn"],
        tilt: 10,
      },
      right: {
        title: "Buying",
        items: ["Mortgage", "Property taxes", "Insurance", "Maintenance, 1–2% a year", "Closing costs"],
        tilt: -10,
      },
      verdict: "Opportunity cost belongs on the renting side",
    }),
    bars: {
      title: "Price-to-rent ratio, a quick local shortcut",
      rows: [
        { label: "Under about 15", pct: 40, value: "Tends to favour buying" },
        { label: "About 15–20", pct: 60, value: "Genuinely close" },
        { label: "Above about 20", pct: 85, value: "Tends to favour renting", muted: true },
      ],
      note: "Local home price divided by a year of local rent for a comparable place.",
    },
  },

  "how-much-house-can-you-afford.html": {
    illus: I.coverageBar({
      label: "What a bank approves compared with a more honest target: 28 to 36 percent of gross income against 25 to 28 percent of take-home pay.",
      caption: "The bank's ratio is calculated before tax and ignores retirement saving. The lower figure is the one you actually live on.",
      rows: [
        { name: "What a bank approves", value: 36, value_label: "28–36% of gross" },
        { name: "A more honest target", value: 28, value_label: "25–28% of take-home", muted: true },
      ],
      note: "Both figures are quoted in this article; they are measured against different incomes.",
    }),
    bars: {
      title: "Costs a pre-approval leaves out",
      rows: [
        { label: "Maintenance", pct: 70, value: "1–2% of value a year" },
        { label: "PMI", pct: 45, value: "If under 20% down" },
        { label: "HOA, utilities, moving", pct: 55, value: "Varies", muted: true },
      ],
      note: "None of these appear in the monthly payment a lender quotes you.",
    },
  },

  "first-time-homebuyer-programs.html": {
    illus: I.tileMap({
      label: "Low down payment loan options: FHA at 3.5 percent down, Conventional 97 at 3 percent, VA often at zero, and USDA at zero in eligible areas.",
      caption: "Four low-down-payment routes. Assistance grants often stack on top of whichever one you use.",
      heading: "Low-down-payment options",
      tiles: [
        { name: "FHA", note: "3.5% down", strong: true },
        { name: "Conventional 97", note: "3% down" },
        { name: "VA", note: "often 0% down" },
        { name: "USDA", note: "0% in eligible areas" },
      ],
    }),
    bars: {
      title: "Minimum down payment by program",
      rows: [
        { label: "FHA", pct: 35, value: "3.5%" },
        { label: "Conventional 97", pct: 30, value: "3%" },
        { label: "VA", pct: 4, value: "often 0%" },
        { label: "USDA", pct: 4, value: "0% where eligible" },
      ],
      note: "Eligibility, not the percentage alone, is what decides which of these is open to you.",
    },
  },

  "refinancing-mortgage.html": {
    illus: I.beforeAfter({
      label: "Break-even on a refinance: closing costs divided by the monthly saving gives the number of months before the new loan starts paying off.",
      caption: "Break-even is the whole question: closing costs divided by the monthly saving.",
      heading: "Closing costs ÷ monthly saving = months to break even",
      before: { name: "Closing costs", value: 100, value_label: "Paid up front", note: "a one-time hit" },
      after: { name: "Monthly saving", value: 34, value_label: "Every month after", note: "until you move" },
    }),
    bars: {
      title: "When refinancing usually is not worth it",
      rows: [
        { label: "Rate gap under ~0.75–1pt", pct: 25, value: "Rarely clears costs", muted: true },
        { label: "Moving before break-even", pct: 35, value: "You never recoup", muted: true },
        { label: "Restarting 30 years late on", pct: 60, value: "Adds years of payments", muted: true },
      ],
      note: "Each of these can cancel out an otherwise attractive rate.",
    },
  },

  // ---------------- Family ----------------
  "budget-that-survives-real-life.html": {
    illus: I.segmentedBar({
      label: "Take-home pay split into broad categories, with a life-happens buffer included so one surprise does not break the month.",
      caption: "Five to seven broad categories, including a buffer. Detailed budgets are the ones people abandon.",
      total: "Take-home pay, in categories you will actually keep using",
      segments: [
        { pct: 50, name: "Needs — housing, food, utilities, minimums" },
        { pct: 25, name: "Wants" },
        { pct: 15, name: "Saving and extra debt payments" },
        { pct: 10, name: "Life-happens buffer" },
      ],
    }),
    bars: {
      title: "Why fewer categories survive longer",
      rows: [
        { label: "5–7 broad categories", pct: 90, value: "Tracked consistently" },
        { label: "20 detailed categories", pct: 25, value: "Usually abandoned", muted: true },
      ],
      note: "Built from your last 2–3 months of real transactions, not from memory.",
    },
  },

  "splitting-money-with-partner.html": {
    illus: I.segmentedBar({
      label: "A proportional split of shared expenses, where each partner covers a share matching their share of combined income.",
      caption: "A proportional split: each share of the bills matches each share of the income.",
      total: "Shared expenses, split in proportion to income",
      segments: [
        { pct: 60, name: "Higher earner — 60% of combined income, 60% of shared costs" },
        { pct: 40, name: "Lower earner — 40% of combined income, 40% of shared costs" },
      ],
    }),
  },

  "windfall-guide.html": {
    callouts: [
      { type: "tip", anchor: "Parking the money in a savings account for two to four weeks" },
      { type: "example", anchor: "Before spending a windfall, write down in one sentence" },
    ],
    illus: I.waterfallOrder({
      label: "An order of operations for a windfall: wait two to four weeks, set aside taxes, top up the emergency fund, clear high-interest debt, invest, then spend a planned share on something fun.",
      caption: "The waiting period at the top is doing most of the work.",
      steps: [
        "Wait 2–4 weeks before deciding anything",
        "Set aside whatever is owed in tax",
        "Top up the emergency fund",
        "Clear high-interest debt",
        "Invest toward long-term goals",
        "Spend a planned share — around 10% — on something fun",
      ],
    }),
  },

  "teaching-kids-money.html": {
    callouts: [
      { type: "tip", anchor: "For younger kids, even a simple three-jar" },
      { type: "warning", anchor: "Using money as a source of family conflict" },
    ],
    illus: I.buckets({
      label: "The three-jar system for children: spend, save and give, each holding a share of the same allowance.",
      caption: "Three jars make an abstract idea physical: the same money has different jobs.",
      items: [
        { name: "Spend", value: "now", pct: 60 },
        { name: "Save", value: "later", pct: 75 },
        { name: "Give", value: "someone else", pct: 35 },
      ],
    }),
  },

  "back-to-school-budget.html": {
    callouts: [
      { type: "tip", anchor: "Setting aside a smaller amount starting in spring" },
    ],
    illus: I.checklistGrid({
      label: "A list of back-to-school costs to write down before shopping starts: supplies, clothes, shoes, activity fees, technology, and school meals.",
      caption: "Writing the whole list down first is what turns August into a number instead of a series of surprises.",
      heading: "List every cost before the shopping starts",
      items: [
        "Supplies and stationery",
        "Clothes and shoes",
        "Activity and club fees",
        "Technology, spread over months",
        "School meals or lunch supplies",
        "Transport and trips",
      ],
    }),
  },

  "cost-of-living-by-state.html": {
    illus: I.donut({
      label: "The main drivers of cost-of-living differences between states, with housing as much the largest share, followed by childcare, healthcare, transport and taxes.",
      caption: "Housing is usually the difference. The rest matters, but rarely enough to reverse it.",
      slices: [
        { pct: 50, name: "Housing" },
        { pct: 18, name: "Childcare" },
        { pct: 14, name: "Healthcare and insurance" },
        { pct: 10, name: "Transportation" },
        { pct: 8, name: "State and local taxes" },
      ],
      centre: { top: "Housing", bottom: "usually decides it" },
    }),
  },

  "life-insurance-for-parents.html": {
    callouts: [
      { type: "tip", anchor: "If you haven't built a basic" },
      { type: "warning", anchor: "A parent who doesn't work for pay" },
    ],
    illus: I.coverageBar({
      label: "A coverage gap: a rough target of five to ten times income plus future costs, against the one to two times income a workplace policy typically provides.",
      caption: "Workplace cover is a starting point, not the plan. The gap is what a term policy is sized to fill.",
      rows: [
        { name: "Rough target", value: 10, value_label: "5–10x income + future costs" },
        { name: "Typical workplace policy", value: 2, value_label: "1–2x income", muted: true },
      ],
      note: "Subtract existing savings and workplace coverage before sizing a policy.",
    }),
    bars: {
      title: "Term vs. whole life, same budget",
      rows: [
        { label: "Term life", pct: 95, value: "Much more coverage per dollar" },
        { label: "Whole life", pct: 22, value: "Far less, for most families", muted: true },
      ],
      note: "Whole life fits specific estate or lifelong-dependant situations, not the default case.",
    },
  },

  "open-enrollment-guide.html": {
    illus: I.donut({
      label: "What actually makes up the annual cost of a health plan: premiums, the deductible, copays and coinsurance, capped by the out-of-pocket maximum.",
      caption: "The premium is the part you see every month. It is not the part that decides the year's total.",
      slices: [
        { pct: 40, name: "Premiums — the visible part" },
        { pct: 30, name: "Deductible" },
        { pct: 20, name: "Copays and coinsurance" },
        { pct: 10, name: "Everything up to the out-of-pocket max" },
      ],
      centre: { top: "Annual", bottom: "total cost" },
    }),
  },
};

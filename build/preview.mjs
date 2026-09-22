import fs from "node:fs";
import * as I from "./illus.mjs";
import { bareIcon, inlineIcon, ICON_PATHS } from "./icons.mjs";

const blocks = [
  I.stageLadder({
    label: "test", caption: "stageLadder",
    stages: [
      { name: "Starter", value: "$500–$1,000", note: "small emergencies" },
      { name: "One month", value: "1x", note: "essentials only" },
      { name: "Three months", value: "3x", note: "windfalls help" },
      { name: "Six months", value: "6x", note: "the finish line" },
    ],
  }),
  I.twoColumnCompare({
    label: "test", caption: "twoColumnCompare",
    left: { title: "Avalanche — highest rate first", items: ["Card A, 24% APR", "Card B, 19% APR", "Car loan, 7%", "Student loan, 5%"] },
    right: { title: "Snowball — smallest balance first", items: ["Store card, $340", "Card B, $2,100", "Card A, $5,400", "Car loan, $9,000"] },
  }),
  I.growthCurve({
    label: "test", caption: "growthCurve",
    points: [100, 118, 142, 175, 220, 285, 380],
    xLabels: ["Year 0", "5", "10", "15", "20", "25", "30"],
    startLabel: "What you put in", endLabel: "Growth on the growth",
  }),
  I.segmentedBar({
    label: "test", caption: "segmentedBar",
    total: "Take-home pay, split three ways",
    segments: [{ pct: 50, name: "Needs — rent, food, utilities, minimums" }, { pct: 30, name: "Wants" }, { pct: 20, name: "Savings and extra debt payments" }],
  }),
  I.balanceScale({
    label: "test", caption: "balanceScale",
    left: { title: "Renting", items: ["Rent", "Renters insurance", "Utilities"], tilt: 10 },
    right: { title: "Buying", items: ["Mortgage", "Property tax", "Insurance", "Maintenance", "Closing costs"], tilt: -10 },
    verdict: "The costs people forget sit on the right",
  }),
  I.matchStack({
    label: "test", caption: "matchStack",
    you: { label: "You: 6%", caption: "of your salary", amount: 6 },
    matched: { label: "Employer: 3%", caption: "free money", amount: 3 },
    total: { label: "9% saved", caption: "for the cost of 6%" },
    note: "a 50% match on the first 6%",
  }),
  I.donut({
    label: "test", caption: "donut",
    slices: [{ pct: 80, name: "Stocks" }, { pct: 15, name: "Bonds" }, { pct: 5, name: "Cash" }],
    centre: { top: "Age 35", bottom: "sample mix" },
  }),
  I.flowSteps({
    label: "test", caption: "flowSteps",
    steps: [
      { title: "Leave it", body: "Stays invested|no action needed" },
      { title: "Roll to new 401(k)", body: "One account|new plan's menu" },
      { title: "Roll to an IRA", body: "Widest choice|you manage it" },
      { title: "Cash out", body: "Taxes + 10%|penalty" },
    ],
  }),
  I.checklistGrid({
    label: "test", caption: "checklistGrid",
    heading: "Gather before you file",
    items: ["W-2 from every employer", "1099s for side income", "1098 mortgage interest", "Childcare provider's tax ID", "Charitable receipts", "Last year's return"],
  }),
  I.waterfallOrder({
    label: "test", caption: "waterfallOrder",
    steps: ["Hold it for 30 days", "Top up the emergency fund", "Clear high-interest debt", "Max the employer match", "Invest the rest"],
  }),
  I.buckets({
    label: "test", caption: "buckets",
    items: [{ name: "Car repairs", value: "$50/mo", pct: 70 }, { name: "Holidays", value: "$40/mo", pct: 45 }, { name: "Vet", value: "$25/mo", pct: 30 }, { name: "Insurance", value: "$60/mo", pct: 85 }],
  }),
  I.glidepath({
    label: "test", caption: "glidepath",
    ages: ["25", "35", "45", "55", "65"],
    stockPct: [90, 85, 75, 65, 50],
  }),
  I.tileMap({
    label: "test", caption: "tileMap",
    heading: "States with no income tax",
    tiles: [
      { name: "Texas", note: "high property tax", strong: true },
      { name: "Florida", note: "insurance costs" },
      { name: "Nevada", note: "high sales tax" },
      { name: "Washington", note: "no wage tax" },
      { name: "Tennessee", note: "high sales tax" },
      { name: "Wyoming", note: "low overall" },
    ],
  }),
  I.coverageBar({
    label: "test", caption: "coverageBar",
    rows: [
      { name: "What the family needs", value: 10, value_label: "10x income", muted: false },
      { name: "Work policy covers", value: 2, value_label: "2x income", muted: true },
    ],
    note: "The gap is what a term policy is for.",
  }),
  I.timeline({
    label: "test", caption: "timeline",
    events: [
      { when: "Day 1", what: "Statement hits $0" },
      { when: "Week 1", what: "Redirect the payment" },
      { when: "Month 1", what: "Rebuild the cushion" },
      { when: "Month 3", what: "Check your credit" },
    ],
  }),
  I.beforeAfter({
    label: "test", caption: "beforeAfter",
    heading: "Refinancing only pays once you pass break-even",
    before: { name: "Now", value: 1840, value_label: "$1,840/mo", note: "6.8% rate" },
    after: { name: "After refinancing", value: 1620, value_label: "$1,620/mo", note: "5.6% rate" },
  }),
];

const icons = Object.keys(ICON_PATHS)
  .map(k => `<div style="text-align:center"><div class="topic-icon" style="margin:0 auto 8px">${bareIcon(k)}</div><code>${k}</code><div><span class="kicker">${inlineIcon(k)}${k}</span></div></div>`)
  .join("");

const callouts = `
<div class="callout callout-tip"><span class="callout-label">💡 Tip</span><p>A tip callout, tinted with the brand accent.</p></div>
<div class="callout callout-warning"><span class="callout-label">⚠️ Watch out</span><p>A warning callout in amber.</p></div>
<div class="callout callout-example"><span class="callout-label">🧮 Example</span><p>An example callout on the neutral paper tone.</p></div>
<div class="bar-chart"><h3>A bar chart</h3>
<div class="bar"><span class="bar-label">Needs</span><span class="bar-track"><span class="bar-fill" style="width:50%"></span></span><span class="bar-value">50%</span></div>
<div class="bar"><span class="bar-label">Wants</span><span class="bar-track"><span class="bar-fill is-muted" style="width:30%"></span></span><span class="bar-value">30%</span></div>
<div class="bar"><span class="bar-label">Savings</span><span class="bar-track"><span class="bar-fill" style="width:20%"></span></span><span class="bar-value">20%</span></div>
</div>`;

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Preview</title>
<script>(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();</script>
<link rel="stylesheet" href="style.css"></head>
<body class="article-page"><div class="wrap"><article class="article">
<h1>Illustration preview</h1>
<button onclick="document.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark')">toggle theme</button>
<h2>Icons</h2>
<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:16px">${icons}</div>
<h2>Callouts and bars</h2>
${callouts}
<h2>Illustrations</h2>
${blocks.join("\n")}
</article></div></body></html>`;

fs.writeFileSync("_preview.html", html, "utf8");
console.log("wrote _preview.html with", blocks.length, "illustrations");

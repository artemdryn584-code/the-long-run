// Adds an "Official resources" block to each content article, pointing at the
// authoritative body for that topic (IRS, CFPB, SEC's investor.gov, FDIC, etc.).
// Real finance sites cite primary sources; linking to the regulator's own site
// is an honest external-authority signal. Links go to the organisations' main
// domains (stable, no 404s), each with a descriptive label. Idempotent.
import fs from "node:fs";

// reusable authoritative resources (US federal bodies + official portals)
const R = {
  cfpb: ["Consumer Financial Protection Bureau", "https://www.consumerfinance.gov/"],
  irs: ["IRS — official tax guidance", "https://www.irs.gov/"],
  sec: ["Investor.gov (U.S. SEC)", "https://www.investor.gov/"],
  fdic: ["FDIC — deposit insurance", "https://www.fdic.gov/"],
  ncua: ["NCUA — credit union insurance", "https://www.ncua.gov/"],
  studentaid: ["Federal Student Aid (studentaid.gov)", "https://studentaid.gov/"],
  hud: ["HUD — homebuyer programs", "https://www.hud.gov/"],
  healthcare: ["HealthCare.gov", "https://www.healthcare.gov/"],
  ssa: ["Social Security Administration", "https://www.ssa.gov/"],
  dol: ["U.S. Department of Labor — retirement plans", "https://www.dol.gov/general/topic/retirement"],
  bls: ["U.S. Bureau of Labor Statistics", "https://www.bls.gov/"],
  naic: ["NAIC — insurance regulators", "https://content.naic.org/"],
  mymoney: ["MyMoney.gov — federal financial literacy", "https://www.mymoney.gov/"],
  credit: ["AnnualCreditReport.com — official free reports", "https://www.annualcreditreport.com/"],
};

const MAP = {
  // Debt
  "after-paying-off-credit-card.html": ["cfpb", "credit"],
  "debt-avalanche-vs-snowball.html": ["cfpb", "mymoney"],
  "debt-consolidation.html": ["cfpb", "credit"],
  "student-loan-repayment.html": ["studentaid", "cfpb"],
  "tax-season-checklist.html": ["irs", "cfpb"],
  // Saving
  "article.html": ["cfpb", "fdic"],
  "how-much-to-save.html": ["cfpb", "mymoney"],
  "sinking-fund-method.html": ["cfpb", "mymoney"],
  "high-yield-savings-explained.html": ["fdic", "cfpb"],
  "best-high-yield-savings-accounts.html": ["fdic", "ncua"],
  "budgeting-apps-compared.html": ["cfpb", "mymoney"],
  "holiday-budget-guide.html": ["cfpb", "mymoney"],
  "no-income-tax-states.html": ["irs", "bls"],
  // Investing
  "index-funds-explained.html": ["sec", "mymoney"],
  "recession-and-retirement.html": ["sec", "irs"],
  "risk-by-age.html": ["sec", "dol"],
  "robo-advisors-for-beginners.html": ["sec", "cfpb"],
  "robo-advisors-vs-diy.html": ["sec", "mymoney"],
  // Retirement
  "401k-match.html": ["irs", "dol"],
  "401k-job-change.html": ["irs", "dol"],
  "roth-vs-traditional-401k.html": ["irs", "dol"],
  "catching-up-retirement.html": ["irs", "ssa"],
  // Housing
  "renting-vs-buying.html": ["cfpb", "hud"],
  "how-much-house-can-you-afford.html": ["cfpb", "hud"],
  "first-time-homebuyer-programs.html": ["hud", "cfpb"],
  "refinancing-mortgage.html": ["cfpb", "hud"],
  // Family
  "budget-that-survives-real-life.html": ["cfpb", "mymoney"],
  "splitting-money-with-partner.html": ["cfpb", "mymoney"],
  "windfall-guide.html": ["cfpb", "irs"],
  "teaching-kids-money.html": ["cfpb", "mymoney"],
  "back-to-school-budget.html": ["cfpb", "mymoney"],
  "cost-of-living-by-state.html": ["bls", "cfpb"],
  "life-insurance-for-parents.html": ["naic", "cfpb"],
  "open-enrollment-guide.html": ["healthcare", "dol"],
};

let done = 0;
for (const [file, keys] of Object.entries(MAP)) {
  if (!fs.existsSync(file)) { console.warn("missing:", file); continue; }
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  if (s.includes('class="sources"')) { console.log("skip:", file); continue; }

  const items = keys
    .map(k => R[k])
    .map(([label, url]) => `      <li><a href="${url}" target="_blank" rel="noopener">${label}</a></li>`)
    .join("\n");
  const block = `  <div class="sources">
    <h2>Official resources</h2>
    <p class="src-note">Primary sources so you can check the current rules and numbers yourself:</p>
    <ul>
${items}
    </ul>
  </div>
`;

  // place it before Related reading, else before the FAQ, else before </article>
  let anchor = s.indexOf('  <div class="side-box related"');
  if (anchor < 0) anchor = s.indexOf('  <div class="faq"');
  if (anchor < 0) anchor = s.indexOf("</article>");
  if (anchor < 0) { console.warn("no anchor:", file); continue; }

  s = s.slice(0, anchor) + block + s.slice(anchor);
  fs.writeFileSync(file, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
  done++;
}
console.log("sources block added to", done, "articles");

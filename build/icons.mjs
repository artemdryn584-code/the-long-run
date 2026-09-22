// Six line icons, one per category. 24x24, stroke 2, round caps, currentColor —
// written once here and used three ways: standalone files in /icons/, small marks
// inside .kicker badges, and large marks in the category page headers.
import fs from "node:fs";
import path from "node:path";

export const ICON_PATHS = {
  // a chain with a broken link — debt you are trying to get out of
  debt: `<path d="M14.5 7H17a5 5 0 0 1 0 10h-2.5"/><path d="M9.5 17H7A5 5 0 0 1 7 7h2.5"/><path d="M9 12h2"/><path d="M13 12h2"/>`,
  // piggy bank
  saving: `<ellipse cx="11.5" cy="12.5" rx="8" ry="6"/><path d="M7 18.2V20.5M16 18.2V20.5"/><path d="M9.2 7.4 10.6 4.6l3.1 1.7"/><path d="M9 11.4h3.6"/><path d="M19.4 11.2h1.9"/><circle cx="16.2" cy="11" r=".9" fill="currentColor" stroke="none"/>`,
  // a line trending up out of the corner
  investing: `<polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/><path d="M3 21h18"/>`,
  // hourglass — time in the market, and time until you need the money
  retirement: `<path d="M6.5 3h11M6.5 21h11"/><path d="M8.5 3v3.6a4 4 0 0 0 1.5 3.1L12 12l-2 2.3a4 4 0 0 0-1.5 3.1V21"/><path d="M15.5 3v3.6a4 4 0 0 1-1.5 3.1L12 12l2 2.3a4 4 0 0 1 1.5 3.1V21"/>`,
  // house
  housing: `<path d="M3 10.6 12 3.2l9 7.4"/><path d="M5.2 9.4V20.8h13.6V9.4"/><path d="M9.6 20.8v-6.1h4.8v6.1"/>`,
  // an adult and a child
  family: `<circle cx="8" cy="6.8" r="3.1"/><path d="M2.4 20.6v-1.4A5.6 5.6 0 0 1 8 13.6a5.6 5.6 0 0 1 5.6 5.6v1.4"/><circle cx="17.4" cy="11.4" r="2.3"/><path d="M13.6 20.6v-1.2a3.8 3.8 0 0 1 7.6 0v1.2"/>`,
};

export const CATEGORY_OF_ICON = {
  Debt: "debt",
  Saving: "saving",
  Investing: "investing",
  Retirement: "retirement",
  Housing: "housing",
  Family: "family",
};

const OPEN = (size, extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${extra}>`;

// small mark that sits inside a .kicker badge
export const inlineIcon = key =>
  `${OPEN(15, ` class="cat-icon" aria-hidden="true" focusable="false"`)}${ICON_PATHS[key]}</svg>`;

// bare mark for topic cards, the articles index and category headers
export const bareIcon = (key, size = 24) =>
  `${OPEN(size, ` aria-hidden="true" focusable="false"`)}${ICON_PATHS[key]}</svg>`;

export function writeIconFiles(dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const [key, body] of Object.entries(ICON_PATHS)) {
    const file = path.join(dir, `${key}.svg`);
    fs.writeFileSync(
      file,
      `${OPEN(24)}\n  ${body.replace(/></g, ">\n  <")}\n</svg>\n`,
      "utf8"
    );
  }
  return Object.keys(ICON_PATHS).length;
}

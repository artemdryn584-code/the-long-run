// Replaces the old two-row masthead and the one-line footer on every page with
// a sticky header (desktop nav + dropdowns, mobile burger menu) and a
// four-column footer, and injects the JS those need.
//
// Which nav item is marked "current" is carried over from the page's existing
// markup, so no page loses its place in the nav.
import fs from "node:fs";
import { bareIcon, CATEGORY_OF_ICON } from "./icons.mjs";

const TOPICS = [
  ["Debt", "debt.html"],
  ["Saving", "saving.html"],
  ["Investing", "investing.html"],
  ["Retirement", "retirement.html"],
  ["Housing", "housing.html"],
  ["Family", "family.html"],
];

const MORE = [
  ["Glossary", "glossary.html"],
  ["Resources", "resources.html"],
  ["Editorial Guidelines", "editorial-guidelines.html"],
  ["About", "about.html"],
];

const MAIN = [
  ["Guides", "index.html"],
  ["Start Here", "start-here.html"],
  ["Calculators", "calculators.html"],
  ["All Articles", "articles.html"],
  ["Plus", "pricing.html"],
];

const TOOLS = [
  ["Emergency Fund Calculator", "emergency-fund-calculator.html"],
  ["Debt Payoff Calculator", "debt-payoff-calculator.html"],
  ["401(k) Calculator", "401k-calculator.html"],
  ["Compound Interest Calculator", "compound-interest-calculator.html"],
  ["Money Personality Quiz", "money-personality-quiz.html"],
  ["Budget Template", "budget-template.html"],
];

const SITE = [
  ["Start Here", "start-here.html"],
  ["All Articles", "articles.html"],
  ["Glossary", "glossary.html"],
  ["Resources", "resources.html"],
  ["About", "about.html"],
  ["Contact", "contact.html"],
  ["Editorial Guidelines", "editorial-guidelines.html"],
  ["Privacy Policy", "privacy.html"],
];

// the site's own favicon, exactly as the old masthead used it
const coinMark = () => `<img src="favicon.svg" alt="" class="wordmark-icon">`;

const wordmark = () =>
  `<div class="wordmark"><a href="index.html">${coinMark()}Clear<span>coin</span></a></div>`;

const chevron = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;
const searchIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>`;
const burgerIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`;

const mark = (href, current) => (href === current ? ' class="current"' : "");

function header(current) {
  const topicCurrent = TOPICS.some(([, h]) => h === current);
  const moreCurrent = MORE.some(([, h]) => h === current);
  return `<header class="site-header" id="site-header">
  <div class="wrap header-inner">
    ${wordmark()}

    <nav class="header-nav" aria-label="Main">
      <a href="index.html"${mark("index.html", current)}>Guides</a>
      <a href="start-here.html"${mark("start-here.html", current)}>Start Here</a>

      <div class="nav-dropdown" data-dropdown>
        <button type="button" class="nav-dropdown-toggle${topicCurrent ? " current" : ""}" aria-expanded="false" aria-haspopup="true">Topics ${chevron}</button>
        <div class="nav-dropdown-menu">
${TOPICS.map(([n, h]) => `          <a href="${h}"${mark(h, current)}>${bareIcon(CATEGORY_OF_ICON[n], 16)}${n}</a>`).join("\n")}
        </div>
      </div>

      <a href="calculators.html"${mark("calculators.html", current)}>Calculators</a>
      <a href="articles.html"${mark("articles.html", current)}>Articles</a>
      <a href="pricing.html"${mark("pricing.html", current)}>Plus</a>

      <div class="nav-dropdown" data-dropdown>
        <button type="button" class="nav-dropdown-toggle${moreCurrent ? " current" : ""}" aria-expanded="false" aria-haspopup="true">More ${chevron}</button>
        <div class="nav-dropdown-menu">
${MORE.map(([n, h]) => `          <a href="${h}"${mark(h, current)}>${n}</a>`).join("\n")}
        </div>
      </div>
    </nav>

    <div class="header-tools">
      <div class="site-search">
        <input type="text" id="site-search-input" placeholder="Search guides…" aria-label="Search Clearcoin">
        <div class="site-search-results" id="site-search-results"></div>
      </div>
      <button type="button" class="icon-btn" id="search-toggle" aria-expanded="false" aria-controls="header-search-row" aria-label="Search">${searchIcon}</button>
      <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">🌙</button>
      <button type="button" class="icon-btn" id="menu-toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">${burgerIcon}</button>
    </div>
  </div>

  <div class="wrap header-search-row" id="header-search-row">
    <div class="site-search">
      <input type="text" id="site-search-input-mobile" placeholder="Search guides…" aria-label="Search Clearcoin">
      <div class="site-search-results" id="site-search-results-mobile"></div>
    </div>
  </div>
</header>

<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <div class="mobile-menu-backdrop" data-close-menu></div>
  <div class="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="Site menu">
    <div class="mobile-menu-head">
      ${wordmark()}
      <button type="button" class="mobile-menu-close" data-close-menu aria-label="Close menu">✕</button>
    </div>

    <nav aria-label="Main">
${MAIN.map(([n, h]) => `      <a href="${h}"${mark(h, current)}>${n}</a>`).join("\n")}
    </nav>

    <h2>Topics</h2>
    <nav aria-label="Topics">
${TOPICS.map(([n, h]) => `      <a href="${h}"${mark(h, current)}>${bareIcon(CATEGORY_OF_ICON[n], 19)}${n}</a>`).join("\n")}
    </nav>

    <h2>Site</h2>
    <nav aria-label="More">
${MORE.concat([["Contact", "contact.html"], ["Privacy Policy", "privacy.html"]])
  .map(([n, h]) => `      <a href="${h}"${mark(h, current)}>${n}</a>`)
  .join("\n")}
    </nav>

    <div class="mobile-menu-foot">
      <span>Dark mode</span>
      <button type="button" class="theme-toggle" id="theme-toggle-menu" aria-label="Toggle dark mode">🌙</button>
    </div>
  </div>
</div>`;
}

const footer = () => `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        ${wordmark()}
        <p class="footer-slogan">Practical money advice for people with a life to live, not a spreadsheet to obsess over.</p>
        <p class="footer-disclaimer">Everything here is for education only. It is not personal financial advice, and it does not account for your own situation.</p>
      </div>

      <div class="footer-col">
        <h3>Topics</h3>
        <ul>
${TOPICS.map(([n, h]) => `          <li><a href="${h}">${n}</a></li>`).join("\n")}
        </ul>
      </div>

      <div class="footer-col">
        <h3>Tools</h3>
        <ul>
${TOOLS.map(([n, h]) => `          <li><a href="${h}">${n}</a></li>`).join("\n")}
        </ul>
      </div>

      <div class="footer-col">
        <h3>Site</h3>
        <ul>
${SITE.map(([n, h]) => `          <li><a href="${h}">${n}</a></li>`).join("\n")}
        </ul>
      </div>
    </div>

    <div class="footer-bottom">© 2026 Clearcoin. All rights reserved.</div>
  </div>
</footer>`;

const SHELL_JS = `<script>
/* Header: scroll shadow, dropdowns, mobile search and the slide-in menu. */
(function () {
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 4);
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- desktop dropdowns --- */
  var dropdowns = [].slice.call(document.querySelectorAll('[data-dropdown]'));
  function closeDropdowns(except) {
    dropdowns.forEach(function (d) {
      if (d === except) return;
      d.classList.remove('is-open');
      d.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
    });
  }
  dropdowns.forEach(function (d) {
    var toggle = d.querySelector('.nav-dropdown-toggle');
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !d.classList.contains('is-open');
      closeDropdowns(d);
      d.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeDropdowns(); toggle.focus(); }
    });
    /* leaving the group with Tab closes it */
    d.addEventListener('focusout', function (e) {
      if (!d.contains(e.relatedTarget)) {
        d.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('click', function () { closeDropdowns(); });

  /* --- mobile search row --- */
  var searchToggle = document.getElementById('search-toggle');
  var searchRow = document.getElementById('header-search-row');
  if (searchToggle && searchRow) {
    searchToggle.addEventListener('click', function () {
      var open = !searchRow.classList.contains('is-open');
      searchRow.classList.toggle('is-open', open);
      searchToggle.setAttribute('aria-expanded', String(open));
      if (open) { var i = document.getElementById('site-search-input-mobile'); if (i) i.focus(); }
    });
  }

  /* --- slide-in menu --- */
  var menu = document.getElementById('mobile-menu');
  var menuToggle = document.getElementById('menu-toggle');
  if (menu && menuToggle) {
    var lastFocus = null;
    var FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

    function openMenu() {
      lastFocus = document.activeElement;
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('menu-open');
      var first = menu.querySelector('.mobile-menu-close');
      if (first) first.focus();
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('menu-open');
      /* back to whatever opened it; the burger is the sane fallback */
      var target = (lastFocus && lastFocus !== document.body && lastFocus.focus) ? lastFocus : menuToggle;
      target.focus();
    }

    menuToggle.addEventListener('click', function () {
      menu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    [].slice.call(menu.querySelectorAll('[data-close-menu]')).forEach(function (el) {
      el.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key !== 'Tab') return;
      /* keep Tab inside the panel */
      var items = [].slice.call(menu.querySelectorAll(FOCUSABLE)).filter(function (el) {
        return el.offsetParent !== null;
      });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* if the window grows past the breakpoint while the menu is open */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && menu.classList.contains('is-open')) closeMenu();
    });
  }

  /* --- the theme button inside the menu, kept in step with the header one --- */
  var menuTheme = document.getElementById('theme-toggle-menu');
  if (menuTheme) {
    var headerTheme = document.getElementById('theme-toggle');
    function paint() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      menuTheme.textContent = dark ? '☀️' : '🌙';
      if (headerTheme) headerTheme.textContent = dark ? '☀️' : '🌙';
    }
    paint();
    menuTheme.addEventListener('click', function () {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (dark) {
        document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('theme', 'light'); } catch (e) {}
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        try { localStorage.setItem('theme', 'dark'); } catch (e) {}
      }
      paint();
    });
    if (headerTheme) headerTheme.addEventListener('click', paint);
  }
})();
</script>`;

// ---------- apply ----------
const files = fs.readdirSync(".").filter(f => f.endsWith(".html"));
let done = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;
  const before = s;

  // which nav item this page marks as current today
  const cur = (s.match(/href="([a-z0-9.-]+)" class="current"/) || [])[1] || "";

  // Markers make the block replaceable on later runs; the first run finds the
  // original masthead/footer instead.
  const H0 = "<!-- shell:header -->", H1 = "<!-- /shell:header -->";
  const F0 = "<!-- shell:footer -->", F1 = "<!-- /shell:footer -->";
  const newHeader = `${H0}\n${header(cur)}\n${H1}`;
  const newFooter = `${F0}\n${footer()}\n${F1}`;

  const replaceBetween = (text, start, end, replacement, fallbackStart, fallbackEnd) => {
    let a = text.indexOf(start);
    let b = a >= 0 ? text.indexOf(end, a) : -1;
    let endLen = end.length;
    if (a < 0) {
      a = text.indexOf(fallbackStart);
      b = a >= 0 ? text.indexOf(fallbackEnd, a) : -1;
      endLen = fallbackEnd.length;
    }
    if (a < 0 || b < 0) return null;
    return text.slice(0, a) + replacement + text.slice(b + endLen);
  };

  // walk forward from an opening <div ...> to its matching </div>
  const endOfDiv = (text, from) => {
    let depth = 0, i = from;
    const re = /<\/?div\b/g;
    re.lastIndex = from;
    let m;
    while ((m = re.exec(text))) {
      depth += m[0][1] === "/" ? -1 : 1;
      if (depth === 0) return m.index + "</div>".length;
      i = m.index;
    }
    return -1;
  };

  let withHeader = replaceBetween(s, H0, H1, newHeader, '<header class="masthead">', "</header>");
  if (!withHeader && s.includes('<header class="site-header"')) {
    // migrating a header this script generated before the markers existed
    const a = s.indexOf('<header class="site-header"');
    const menuAt = s.indexOf('<div class="mobile-menu"', a);
    const b = menuAt >= 0 ? endOfDiv(s, menuAt) : s.indexOf("</header>", a) + "</header>".length;
    if (b > a) withHeader = s.slice(0, a) + newHeader + s.slice(b);
  }
  if (withHeader) s = withHeader;
  else console.warn("no header block in", file);

  let withFooter = replaceBetween(s, F0, F1, newFooter, "<footer>", "</footer>");
  if (!withFooter) withFooter = replaceBetween(s, F0, F1, newFooter, '<footer class="site-footer">', "</footer>");
  if (withFooter) s = withFooter;
  else console.warn("no footer block in", file);

  // drop a previously injected block first, so re-running picks up JS changes
  s = s.replace(/<script>\n\/\* Header: scroll shadow[\s\S]*?<\/script>\n/, "");
  s = s.replace("</body>", `${SHELL_JS}\n</body>`);

  if (s !== before) {
    fs.writeFileSync(file, crlf ? s.replace(/\n/g, "\r\n") : s, "utf8");
    done++;
  }
}
console.log("pages rebuilt:", done, "of", files.length);

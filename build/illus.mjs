// A library of chart/diagram shapes for article illustrations.
// Every generator returns a complete <figure class="illus">, sizes itself in a
// 600-wide viewBox (so it scales to the column) and colours itself with the
// .illus-* classes, which resolve to the site's CSS variables — meaning dark
// mode and print need no extra work.
//
// The point of having this many shapes is that no two articles get the same
// picture: a ladder, a scale, a curve and a donut say different things.

const esc = s =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const figure = (label, height, body, caption) =>
  `<figure class="illus">
  <svg viewBox="0 0 600 ${height}" width="600" height="${height}" role="img" aria-label="${esc(label)}">
${body}
  </svg>
  <figcaption>${caption}</figcaption>
</figure>`;

// ---------- 1. stage ladder: milestones that step up ----------
export function stageLadder({ label, caption, stages }) {
  const n = stages.length;
  const gap = 14;
  const w = (560 - gap * (n - 1)) / n;
  const maxH = 110;
  const body = stages
    .map((s, i) => {
      const h = Math.round(maxH * ((i + 1) / n));
      const x = 20 + i * (w + gap);
      const y = 150 - h;
      return `    <rect x="${x}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="8" class="${i === n - 1 ? "illus-accent" : "illus-tint"}"/>
    <rect x="${x}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="8" class="illus-stroke-accent" stroke-width="1.5" opacity="${i === n - 1 ? 0 : 0.4}"/>
    <text x="${(x + w / 2).toFixed(1)}" y="${y - 10}" text-anchor="middle" class="illus-value">${esc(s.value)}</text>
    <text x="${(x + w / 2).toFixed(1)}" y="172" text-anchor="middle" class="illus-label">${esc(s.name)}</text>
    <text x="${(x + w / 2).toFixed(1)}" y="188" text-anchor="middle" class="illus-label">${esc(s.note || "")}</text>`;
    })
    .join("\n");
  return figure(
    label,
    200,
    `    <line x1="20" y1="150" x2="580" y2="150" class="illus-line" stroke-width="1"/>\n${body}`,
    caption
  );
}

// ---------- 2. two-column comparison of ordered lists ----------
export function twoColumnCompare({ label, caption, left, right }) {
  const rows = Math.max(left.items.length, right.items.length);
  const height = 78 + rows * 34;
  const col = (x, data, accent) => {
    const head = `    <rect x="${x}" y="14" width="260" height="34" rx="9" class="${accent ? "illus-accent" : "illus-tint"}"/>
    <text x="${x + 130}" y="36" text-anchor="middle" class="${accent ? "illus-on-accent" : "illus-title"}">${esc(data.title)}</text>`;
    const items = data.items
      .map((it, i) => {
        const y = 62 + i * 34;
        return `    <circle cx="${x + 18}" cy="${y + 10}" r="11" class="illus-tint"/>
    <text x="${x + 18}" y="${y + 14}" text-anchor="middle" class="illus-value" font-size="11">${i + 1}</text>
    <text x="${x + 38}" y="${y + 15}" class="illus-label" font-size="12.5">${esc(it)}</text>`;
      })
      .join("\n");
    return `${head}\n${items}`;
  };
  const body = `${col(20, left, true)}\n    <line x1="300" y1="14" x2="300" y2="${height - 14}" class="illus-line" stroke-width="1" stroke-dasharray="4 4"/>\n${col(320, right, false)}`;
  return figure(label, height, body, caption);
}

// ---------- 3. growth curve with a shaded area ----------
export function growthCurve({ label, caption, points, xLabels, endLabel, startLabel }) {
  const x0 = 46, x1 = 570, y0 = 30, y1 = 150;
  const max = Math.max(...points);
  const pts = points.map((p, i) => {
    const x = x0 + (i / (points.length - 1)) * (x1 - x0);
    const y = y1 - (p / max) * (y1 - y0);
    return [x, y];
  });
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${x1} ${y1} L${x0} ${y1} Z`;
  const ticks = xLabels
    .map((t, i) => {
      const x = x0 + (i / (xLabels.length - 1)) * (x1 - x0);
      return `    <text x="${x.toFixed(1)}" y="${y1 + 20}" text-anchor="middle" class="illus-label">${esc(t)}</text>`;
    })
    .join("\n");
  const body = `    <line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" class="illus-line" stroke-width="1"/>
    <line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" class="illus-line" stroke-width="1"/>
    <path d="${area}" class="illus-tint"/>
    <path d="${line}" class="illus-stroke-accent" stroke-width="3" stroke-linecap="round"/>
    <circle cx="${pts[pts.length - 1][0].toFixed(1)}" cy="${pts[pts.length - 1][1].toFixed(1)}" r="5" class="illus-accent"/>
    <text x="${x1}" y="${(pts[pts.length - 1][1] - 12).toFixed(1)}" text-anchor="end" class="illus-value">${esc(endLabel)}</text>
    <text x="${x0 + 6}" y="${y1 - 8}" class="illus-label">${esc(startLabel)}</text>
${ticks}`;
  return figure(label, 180, body, caption);
}

// ---------- 4. one bar split into shares ----------
export function segmentedBar({ label, caption, segments, total }) {
  const x0 = 20, w = 560;
  let x = x0;
  const bars = segments
    .map((s, i) => {
      const sw = (s.pct / 100) * w;
      const cls = i === 0 ? "illus-accent" : i === 1 ? "illus-stroke-accent" : "illus-tint";
      const fill = i === 0 ? "illus-accent" : i === 1 ? "illus-soft" : "illus-tint";
      const rect = `    <rect x="${x.toFixed(1)}" y="30" width="${sw.toFixed(1)}" height="46" class="${fill}" ${i === 0 ? 'rx="8"' : i === segments.length - 1 ? 'rx="8"' : ""}/>
    <text x="${(x + sw / 2).toFixed(1)}" y="59" text-anchor="middle" class="${i < 2 ? "illus-on-accent" : "illus-value"}" font-size="13">${s.pct}%</text>`;
      x += sw;
      return rect;
    })
    .join("\n");
  const keys = segments
    .map((s, i) => {
      const cy = 104 + i * 26;
      const fill = i === 0 ? "illus-accent" : i === 1 ? "illus-soft" : "illus-tint";
      return `    <rect x="20" y="${cy - 10}" width="14" height="14" rx="4" class="${fill}"/>
    <text x="44" y="${cy + 2}" class="illus-label" font-size="13">${esc(s.name)}</text>`;
    })
    .join("\n");
  const height = 104 + segments.length * 26 + 6;
  const body = `    <text x="20" y="18" class="illus-title">${esc(total)}</text>\n${bars}\n${keys}`;
  return figure(label, height, body, caption);
}

// ---------- 5. balance scale ----------
export function balanceScale({ label, caption, left, right, verdict }) {
  const beamY = 54;
  const panTop = t => beamY + t + 26;
  const pan = (cx, data) => {
    const top = panTop(data.tilt);
    const items = data.items
      .map((it, i) => `    <text x="${cx}" y="${top + 48 + i * 19}" text-anchor="middle" class="illus-label" font-size="12.5">${esc(it)}</text>`)
      .join("\n");
    return `    <line x1="${cx}" y1="${beamY + data.tilt}" x2="${cx}" y2="${top}" class="illus-stroke-soft" stroke-width="1.5"/>
    <path d="M${cx - 68} ${top} h136 l-17 22 h-102 Z" class="illus-tint"/>
    <path d="M${cx - 68} ${top} h136 l-17 22 h-102 Z" class="illus-stroke-accent" stroke-width="1.5" opacity="0.45"/>
    <text x="${cx}" y="${top + 32}" text-anchor="middle" class="illus-title" font-size="13">${esc(data.title)}</text>
${items}`;
  };
  const deepest = Math.max(panTop(left.tilt), panTop(right.tilt));
  const items = Math.max(left.items.length, right.items.length);
  const height = deepest + 48 + items * 19 + 34;
  const standTop = beamY + 6;
  const standBottom = height - 52;
  const body = `    <line x1="300" y1="${standTop}" x2="300" y2="${standBottom}" class="illus-stroke-soft" stroke-width="3" stroke-linecap="round"/>
    <path d="M300 ${standBottom} l-40 22 h80 Z" class="illus-soft"/>
    <line x1="140" y1="${beamY + left.tilt}" x2="460" y2="${beamY + right.tilt}" class="illus-stroke-accent" stroke-width="3" stroke-linecap="round"/>
    <circle cx="300" cy="${beamY}" r="6" class="illus-accent"/>
${pan(140, left)}
${pan(460, right)}
    <text x="300" y="${height - 8}" text-anchor="middle" class="illus-value">${esc(verdict)}</text>`;
  return figure(label, height, body, caption);
}

// ---------- 6. your contribution plus somebody else's ----------
export function matchStack({ label, caption, you, matched, total, note }) {
  if (!(you.amount > 0) || !(matched.amount > 0)) {
    throw new Error("matchStack needs numeric you.amount and matched.amount");
  }
  const scale = 150 / (you.amount + matched.amount);
  const hYou = you.amount * scale;
  const hMatch = matched.amount * scale;
  const body = `    <rect x="70" y="${(180 - hYou).toFixed(1)}" width="120" height="${hYou.toFixed(1)}" rx="8" class="illus-accent"/>
    <text x="130" y="${(180 - hYou / 2 + 5).toFixed(1)}" text-anchor="middle" class="illus-on-accent">${esc(you.label)}</text>
    <text x="130" y="200" text-anchor="middle" class="illus-label">${esc(you.caption)}</text>

    <text x="222" y="130" text-anchor="middle" class="illus-value" font-size="26">+</text>

    <rect x="254" y="${(180 - hMatch).toFixed(1)}" width="120" height="${hMatch.toFixed(1)}" rx="8" class="illus-tint"/>
    <text x="314" y="${(180 - hMatch / 2 + 5).toFixed(1)}" text-anchor="middle" class="illus-value">${esc(matched.label)}</text>
    <text x="314" y="200" text-anchor="middle" class="illus-label">${esc(matched.caption)}</text>

    <text x="406" y="130" text-anchor="middle" class="illus-value" font-size="26">=</text>

    <rect x="440" y="30" width="120" height="150" rx="8" class="illus-accent" opacity="0.18"/>
    <rect x="440" y="30" width="120" height="150" rx="8" class="illus-stroke-accent" stroke-width="2"/>
    <text x="500" y="100" text-anchor="middle" class="illus-value" font-size="17">${esc(total.label)}</text>
    <text x="500" y="122" text-anchor="middle" class="illus-label">${esc(total.caption)}</text>
    <text x="500" y="200" text-anchor="middle" class="illus-label">${esc(note)}</text>`;
  return figure(label, 214, body, caption);
}

// ---------- 7. donut ----------
export function donut({ label, caption, slices, centre }) {
  const cx = 150, cy = 118, r = 82, thick = 34;
  let angle = -Math.PI / 2;
  const arcs = slices
    .map((s, i) => {
      const sweep = (s.pct / 100) * Math.PI * 2;
      const end = angle + sweep;
      const large = sweep > Math.PI ? 1 : 0;
      const p = (a, rad) => [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
      const [x1, y1] = p(angle, r);
      const [x2, y2] = p(end, r);
      const [x3, y3] = p(end, r - thick);
      const [x4, y4] = p(angle, r - thick);
      angle = end;
      const cls = i === 0 ? "illus-accent" : i === 1 ? "illus-soft" : "illus-tint";
      return `    <path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L${x3.toFixed(1)} ${y3.toFixed(1)} A${r - thick} ${r - thick} 0 ${large} 0 ${x4.toFixed(1)} ${y4.toFixed(1)} Z" class="${cls}"/>`;
    })
    .join("\n");
  const keys = slices
    .map((s, i) => {
      const y = 60 + i * 30;
      const cls = i === 0 ? "illus-accent" : i === 1 ? "illus-soft" : "illus-tint";
      return `    <rect x="300" y="${y - 11}" width="15" height="15" rx="4" class="${cls}"/>
    <text x="326" y="${y + 1}" class="illus-value" font-size="13">${s.pct}%</text>
    <text x="368" y="${y + 1}" class="illus-label" font-size="13">${esc(s.name)}</text>`;
    })
    .join("\n");
  const height = Math.max(216, 60 + slices.length * 30 + 20);
  const body = `${arcs}
    <text x="${cx}" y="${cy + 1}" text-anchor="middle" class="illus-value" font-size="15">${esc(centre.top)}</text>
    <text x="${cx}" y="${cy + 20}" text-anchor="middle" class="illus-label">${esc(centre.bottom)}</text>
${keys}`;
  return figure(label, height, body, caption);
}

// ---------- 8. left-to-right flow of steps ----------
export function flowSteps({ label, caption, steps }) {
  const n = steps.length;
  const gap = 18;
  const w = (560 - gap * (n - 1)) / n;
  const body = steps
    .map((s, i) => {
      const x = 20 + i * (w + gap);
      const arrow =
        i < n - 1
          ? `    <path d="M${(x + w + 4).toFixed(1)} 76 l10 0 m-4 -5 l5 5 l-5 5" class="illus-stroke-soft" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
          : "";
      const lines = s.body
        .split("|")
        .map((t, j) => `    <text x="${(x + w / 2).toFixed(1)}" y="${96 + j * 17}" text-anchor="middle" class="illus-label" font-size="12">${esc(t)}</text>`)
        .join("\n");
      return `    <rect x="${x.toFixed(1)}" y="30" width="${w.toFixed(1)}" height="46" rx="10" class="${i === 0 ? "illus-accent" : "illus-tint"}"/>
    <text x="${(x + w / 2).toFixed(1)}" y="58" text-anchor="middle" class="${i === 0 ? "illus-on-accent" : "illus-title"}" font-size="12.5">${esc(s.title)}</text>
${lines}
${arrow}`;
    })
    .join("\n");
  const maxLines = Math.max(...steps.map(s => s.body.split("|").length));
  return figure(label, 96 + maxLines * 17 + 10, body, caption);
}

// ---------- 9. checklist grid ----------
export function checklistGrid({ label, caption, items, heading }) {
  const rows = Math.ceil(items.length / 2);
  const height = 44 + rows * 38;
  const body = items
    .map((it, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 20 + col * 290;
      const y = 40 + row * 38;
      return `    <rect x="${x}" y="${y - 14}" width="270" height="30" rx="8" class="illus-tint"/>
    <path d="M${x + 12} ${y} l5 5 l9 -11" class="illus-stroke-accent" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${x + 36}" y="${y + 5}" class="illus-label" font-size="12.5">${esc(it)}</text>`;
    })
    .join("\n");
  return figure(label, height, `    <text x="20" y="18" class="illus-title">${esc(heading)}</text>\n${body}`, caption);
}

// ---------- 10. numbered order of operations, stepping down ----------
export function waterfallOrder({ label, caption, steps }) {
  const height = 26 + steps.length * 44;
  const body = steps
    .map((s, i) => {
      const y = 22 + i * 44;
      const w = 540 - i * 24;
      return `    <rect x="${20 + i * 12}" y="${y}" width="${w}" height="34" rx="9" class="${i === 0 ? "illus-accent" : "illus-tint"}"/>
    <circle cx="${44 + i * 12}" cy="${y + 17}" r="12" class="illus-paper"/>
    <text x="${44 + i * 12}" y="${y + 22}" text-anchor="middle" class="illus-value" font-size="12">${i + 1}</text>
    <text x="${66 + i * 12}" y="${y + 22}" class="${i === 0 ? "illus-on-accent" : "illus-label"}" font-size="12.5">${esc(s)}</text>`;
    })
    .join("\n");
  return figure(label, height, body, caption);
}

// ---------- 11. buckets filled to different levels ----------
export function buckets({ label, caption, items }) {
  const n = items.length;
  const gap = 16;
  const w = (560 - gap * (n - 1)) / n;
  const body = items
    .map((it, i) => {
      const x = 20 + i * (w + gap);
      const top = 30, h = 96;
      const fill = (it.pct / 100) * (h - 10);
      // a straight-sided jar, so the fill can be a plain rect that never spills out
      return `    <rect x="${x.toFixed(1)}" y="${top}" width="${w.toFixed(1)}" height="${h}" rx="7" class="illus-tint"/>
    <rect x="${(x + 5).toFixed(1)}" y="${(top + h - 5 - fill).toFixed(1)}" width="${(w - 10).toFixed(1)}" height="${fill.toFixed(1)}" rx="4" class="illus-accent"/>
    <rect x="${x.toFixed(1)}" y="${top}" width="${w.toFixed(1)}" height="${h}" rx="7" class="illus-stroke-accent" stroke-width="1.5" opacity="0.5"/>
    <text x="${(x + w / 2).toFixed(1)}" y="150" text-anchor="middle" class="illus-value" font-size="12.5">${esc(it.value)}</text>
    <text x="${(x + w / 2).toFixed(1)}" y="168" text-anchor="middle" class="illus-label" font-size="12">${esc(it.name)}</text>`;
    })
    .join("\n");
  return figure(label, 182, `    <text x="20" y="18" class="illus-title">One account, separate jobs</text>\n${body}`, caption);
}

// ---------- 12. glide path: mix shifting over time ----------
export function glidepath({ label, caption, ages, stockPct }) {
  const x0 = 50, x1 = 570, y0 = 26, y1 = 150;
  const pt = (i, pct) => [x0 + (i / (ages.length - 1)) * (x1 - x0), y1 - (pct / 100) * (y1 - y0)];
  const top = stockPct.map((p, i) => pt(i, p));
  const line = top.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const stocks = `${line} L${x1} ${y1} L${x0} ${y1} Z`;
  const bonds = `${line} L${x1} ${y0} L${x0} ${y0} Z`;
  const ticks = ages
    .map((a, i) => {
      const [x] = pt(i, 0);
      return `    <text x="${x.toFixed(1)}" y="${y1 + 20}" text-anchor="middle" class="illus-label">${esc(a)}</text>
    <text x="${x.toFixed(1)}" y="${(pt(i, stockPct[i])[1] - 8).toFixed(1)}" text-anchor="middle" class="illus-value" font-size="11.5">${stockPct[i]}%</text>`;
    })
    .join("\n");
  const body = `    <path d="${bonds}" class="illus-tint"/>
    <path d="${stocks}" class="illus-accent" opacity="0.8"/>
    <path d="${line}" class="illus-stroke-accent" stroke-width="2.5"/>
    <line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" class="illus-line" stroke-width="1"/>
    <text x="${x0 + 12}" y="${y1 - 14}" class="illus-on-accent" font-size="12.5">Stocks</text>
    <text x="${x1 - 6}" y="${y0 + 14}" text-anchor="end" class="illus-label" font-size="12.5">Bonds &amp; cash</text>
${ticks}
    <text x="300" y="${y1 + 40}" text-anchor="middle" class="illus-label">Age</text>`;
  return figure(label, 196, body, caption);
}

// ---------- 13. labelled tiles ----------
export function tileMap({ label, caption, heading, tiles }) {
  const perRow = 4;
  const rows = Math.ceil(tiles.length / perRow);
  const w = 132, h = 52, gapX = 14, gapY = 12;
  const body = tiles
    .map((t, i) => {
      const col = i % perRow;
      const row = Math.floor(i / perRow);
      const x = 20 + col * (w + gapX);
      const y = 34 + row * (h + gapY);
      return `    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" class="${t.strong ? "illus-accent" : "illus-tint"}"/>
    <text x="${x + w / 2}" y="${y + 22}" text-anchor="middle" class="${t.strong ? "illus-on-accent" : "illus-title"}" font-size="12.5">${esc(t.name)}</text>
    <text x="${x + w / 2}" y="${y + 40}" text-anchor="middle" class="${t.strong ? "illus-on-accent" : "illus-label"}" font-size="11.5">${esc(t.note)}</text>`;
    })
    .join("\n");
  return figure(label, 34 + rows * (h + gapY) + 14, `    <text x="20" y="18" class="illus-title">${esc(heading)}</text>\n${body}`, caption);
}

// ---------- 14. what you need vs what you have ----------
export function coverageBar({ label, caption, rows, note }) {
  const x0 = 150, w = 410;
  const max = Math.max(...rows.map(r => r.value));
  const body = rows
    .map((r, i) => {
      const y = 30 + i * 48;
      const bw = (r.value / max) * w;
      // a bar that nearly fills the track has no room for an outside label
      const inside = bw > w * 0.74;
      const valueText = inside
        ? `    <text x="${(x0 + bw - 12).toFixed(1)}" y="${y + 20}" text-anchor="end" class="illus-on-accent" font-size="12.5">${esc(r.value_label)}</text>`
        : `    <text x="${(x0 + bw + 10).toFixed(1)}" y="${y + 20}" class="illus-value" font-size="12.5">${esc(r.value_label)}</text>`;
      return `    <text x="${x0 - 12}" y="${y + 22}" text-anchor="end" class="illus-label" font-size="12.5">${esc(r.name)}</text>
    <rect x="${x0}" y="${y}" width="${w}" height="30" rx="8" class="illus-tint"/>
    <rect x="${x0}" y="${y}" width="${bw.toFixed(1)}" height="30" rx="8" class="${r.muted ? "illus-soft" : "illus-accent"}"/>
${valueText}`;
    })
    .join("\n");
  const height = 30 + rows.length * 48 + 26;
  return figure(label, height, `${body}\n    <text x="20" y="${height - 6}" class="illus-label">${esc(note)}</text>`, caption);
}

// ---------- 15. timeline with dated dots ----------
export function timeline({ label, caption, events }) {
  // inset from the edges so the first and last captions, which are centred on
  // their dots, still fit inside the viewBox
  const x0 = 92, x1 = 508;
  const body = events
    .map((e, i) => {
      const x = x0 + (i / (events.length - 1)) * (x1 - x0);
      const up = i % 2 === 0;
      const ty = up ? 52 : 118;
      return `    <circle cx="${x.toFixed(1)}" cy="88" r="9" class="${i === 0 ? "illus-accent" : "illus-tint"}"/>
    <circle cx="${x.toFixed(1)}" cy="88" r="9" class="illus-stroke-accent" stroke-width="2"/>
    <text x="${x.toFixed(1)}" y="${ty}" text-anchor="middle" class="illus-value" font-size="12.5">${esc(e.when)}</text>
    <text x="${x.toFixed(1)}" y="${ty + 17}" text-anchor="middle" class="illus-label" font-size="12">${esc(e.what)}</text>`;
    })
    .join("\n");
  return figure(
    label,
    170,
    `    <line x1="${x0}" y1="88" x2="${x1}" y2="88" class="illus-stroke-soft" stroke-width="2" stroke-dasharray="5 5"/>\n${body}`,
    caption
  );
}

// ---------- 16. before / after pair ----------
export function beforeAfter({ label, caption, before, after, heading }) {
  const max = Math.max(before.value, after.value);
  const bar = (x, d, accent) => {
    const h = (d.value / max) * 120;
    return `    <rect x="${x}" y="${(170 - h).toFixed(1)}" width="150" height="${h.toFixed(1)}" rx="10" class="${accent ? "illus-accent" : "illus-tint"}"/>
    <text x="${x + 75}" y="${(170 - h - 12).toFixed(1)}" text-anchor="middle" class="illus-value" font-size="15">${esc(d.value_label)}</text>
    <text x="${x + 75}" y="192" text-anchor="middle" class="illus-label">${esc(d.name)}</text>
    <text x="${x + 75}" y="209" text-anchor="middle" class="illus-label" font-size="11.5">${esc(d.note || "")}</text>`;
  };
  const body = `    <text x="20" y="18" class="illus-title">${esc(heading)}</text>
${bar(90, before, false)}
    <path d="M272 120 h50 m-8 -7 l8 7 l-8 7" class="illus-stroke-accent" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
${bar(360, after, true)}`;
  return figure(label, 220, body, caption);
}

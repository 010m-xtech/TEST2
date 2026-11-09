// =============================================================
//  味わいの6項目と、六角形チャート
//  診断アプリ（index.html）と お品書き（menu.html）の両方で使います。
//  お酒の taste はこの6項目を 0〜100 で書きます（50 がふつう）。
// =============================================================
const TASTE_AXES = [
  { key: 'aroma',      label: '香り', high: '華やかな香り', low: '控えめで澄んだ香り', weight: 1.2 },
  { key: 'sweetness',  label: '甘み', high: 'やさしい甘み', low: 'ドライなキレ',       weight: 1.0 },
  { key: 'acidity',    label: '酸味', high: '爽やかな酸味', low: 'まろやかな口当たり', weight: 0.8 },
  { key: 'body',       label: 'コク', high: '濃厚なコク',   low: '軽やかな飲み口',     weight: 1.2 },
  { key: 'bitterness', label: '苦味', high: '心地よい苦味', low: '苦味の少なさ',       weight: 0.8 },
  { key: 'umami',      label: '旨み', high: '豊かな旨み',   low: 'すっきりした味わい', weight: 1.0 }
];

const NEUTRAL_PROFILE = Object.fromEntries(TASTE_AXES.map(a => [a.key, 50]));

// 六角形のレーダーチャート
//   series: [{ values, fill, stroke, dashed }]
//   options.labels = false で、ラベルなしの小さなチャート（一覧のアイコン用）
//   options.highlight = 'aroma' などで、その項目のラベルを強調
//   options.accent = 強調の色（省略すると CSS の --accent）
function renderRadarChart(container, series, size = 250, options = {}) {
  const labels = options.labels !== false;
  const accent = options.accent || 'rgb(var(--accent))';
  const c = size / 2, r = labels ? size / 2 - 38 : size / 2 - 2, n = TASTE_AXES.length;
  const point = (i, v) => {
    const angle = (-90 + i * 360 / n) * Math.PI / 180;
    return [c + Math.cos(angle) * r * v / 100, c + Math.sin(angle) * r * v / 100];
  };
  const polygon = v => TASTE_AXES.map((a, i) => point(i, v(a)).map(x => x.toFixed(1)).join(',')).join(' ');
  let svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="block">`;
  (labels ? [25, 50, 75, 100] : [50, 100]).forEach(level => {
    svg += `<polygon points="${polygon(() => level)}" fill="none" stroke="#E7E2D9" stroke-width="1"></polygon>`;
  });
  TASTE_AXES.forEach((a, i) => {
    const [x, y] = point(i, 100);
    svg += `<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" stroke="#E7E2D9" stroke-width="1"></line>`;
    if(!labels) return;
    const [lx, ly] = point(i, 128);
    const on = options.highlight === a.key;
    svg += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="${on ? 14 : 12}" font-weight="700" style="fill: ${on ? accent : '#6B6560'}">${a.label}</text>`;
  });
  series.forEach(s => {
    svg += `<polygon points="${polygon(a => s.values[a.key] ?? 50)}" style="fill: ${s.fill}; stroke: ${s.stroke}" stroke-width="${labels ? 2 : 1.2}" ${s.dashed ? 'stroke-dasharray="4 4"' : ''} stroke-linejoin="round"></polygon>`;
  });
  container.innerHTML = svg + '</svg>';
}

// チャートの SVG を文字列で返す（一覧に並べるとき用）
function radarChartHtml(series, size, options) {
  const div = document.createElement('div');
  renderRadarChart(div, series, size, options);
  return div.innerHTML;
}

// レーダーチャートを、前の形（最初は中心）から目的の形へ徐々に変化させる
function animateRadarChart(container, series, size = 250, options = {}) {
  if(container._radarAnim) cancelAnimationFrame(container._radarAnim);
  const zero = { ...NEUTRAL_PROFILE };
  Object.keys(zero).forEach(k => zero[k] = 0);
  const from = container._radarValues || [];
  const duration = options.duration || 900;
  const start = performance.now();
  const ease = t => 1 - Math.pow(1 - t, 3);
  const frame = now => {
    const t = Math.min(1, (now - start) / duration);
    const current = series.map((s, i) => {
      const base = from[i] || zero;
      const values = {};
      TASTE_AXES.forEach(a => values[a.key] = base[a.key] + (s.values[a.key] - base[a.key]) * ease(t));
      return { ...s, values };
    });
    renderRadarChart(container, current, size, options);
    container._radarValues = current.map(s => s.values);
    if(t < 1) container._radarAnim = requestAnimationFrame(frame);
  };
  container._radarAnim = requestAnimationFrame(frame);
}

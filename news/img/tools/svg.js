// 작은 SVG 헬퍼 — 차트 카드 HTML이 공유한다. 데이터는 각 HTML 안에 있다.
const NS = 'http://www.w3.org/2000/svg';
function el(parent, tag, attrs = {}, text) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text !== undefined) n.textContent = text;
  parent.appendChild(n);
  return n;
}
// 한쪽 끝만 둥근 막대 (데이터 끝 r=4, 기준선 쪽은 직각). dir: 'right' | 'left'
function bar(parent, x, y, w, h, fill, dir = 'right', r = 4) {
  r = Math.min(r, w / 2, h / 2);
  const d = dir === 'right'
    ? `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`
    : `M${x + w},${y}H${x + r}Q${x},${y} ${x},${y + r}V${y + h - r}Q${x},${y + h} ${x + r},${y + h}H${x + w}Z`;
  return el(parent, 'path', { d, fill });
}
const DAY = 86400000;
const date = (m, d) => Date.UTC(2026, m - 1, d);
const fmtWon = (eok) => {               // 억 단위 정수 → '9조 4,308억'
  const jo = Math.floor(eok / 10000), rest = eok % 10000;
  return (jo ? `${jo}조 ` : '') + (rest ? `${rest.toLocaleString('en-US')}억` : '');
};

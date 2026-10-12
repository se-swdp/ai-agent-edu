/**
 * news.js — 뉴스(AI 업계 브리핑) 뷰.
 *
 * news/issues.json 을 fetch 해서 주간/일간 브리핑을 렌더.
 * 발행 워크플로: issues[] 맨 앞에 새 이슈를 추가하고 hosting 재배포.
 *   - issue: { id, type: 'weekly'|'biweekly'|'monthly'|'daily', no, title, date, period, intro,
 *              cover?, highlights[], feature?, body[](통합 기사 꼭지), refs[] }
 *   - body[] 항목 — 아래 둘 중 하나
 *       "문단"                          문단 하나 (1~6호 형식)
 *       { label?, title?, text, img? }  꼭지
 *         label  작은 머리글 (예: "안전·정렬")
 *         title  꼭지 제목 — h3 로 그리고 id 를 붙여 오른쪽 '이번 호 차례'에 건다
 *         text   "문단" 또는 ["문단", "문단", …] — 문자열마다 <p> 하나
 *         img    있으면 제목 아래·문단 위에 그림
 *   - feature: { label?, title, img?, body[] } — 요점 아래 특집 블록
 *     (body 항목 형식 동일, 꼭지 제목은 특집 제목 아래 단계라 h4)
 *   - img / cover: { src, alt, caption? } — src 는 /news/img/<issue id>/*.webp
 *     (이미지는 immutable 캐시 — 내용을 바꾸면 파일명도 바꾼다)
 *   - ref:   { label, url }
 *   - 문단·요점·캡션 속 "**핵심어**" 는 굵게
 */

import { el, $, clear, jsonLoader } from './utils.js';

const ISSUES_URL = './news/issues.json';

const TYPE_LABEL = { weekly: '주간', biweekly: '격주', monthly: '월간', daily: '일간' };

let currentId = null; // 선택된 이슈 — null 이면 최신호
let tocObserver = null; // 차례 현재 위치 표시 — 다시 그릴 때마다 교체

const loadIssues = jsonLoader(ISSUES_URL, {
  tag: 'news',
  fallback: { issues: [] },
});

/** "**핵심어**" → <strong> — 요약 속 핵심어 강조 (GeekNews 식 스캔 가독성) */
function emphasize(text) {
  const parts = String(text ?? '').split('**');
  if (parts.length < 3) return [text];
  return parts.map((p, i) => (i % 2 ? el('strong', {}, [p]) : p));
}

function chipLabel(issue) {
  // "07.20 주간" — 연도는 메타 행에서 확인 가능하므로 칩은 짧게
  const d = issue.date || '';
  const md = d.length >= 10 ? `${d.slice(5, 7)}.${d.slice(8, 10)}` : d;
  return `${md} ${TYPE_LABEL[issue.type] || ''}`.trim();
}

function selectIssue(id) {
  currentId = id;
  renderNews();
}

/** 기사 그림 — 클릭하면 원본 크기로 새 탭 */
function renderFigure(img, cls = '') {
  if (!img?.src) return null;
  return el('figure', { class: `news-figure ${cls}`.trim() }, [
    el('a', { href: img.src, target: '_blank', rel: 'noopener' }, [
      el('img', { src: img.src, alt: img.alt || '', loading: 'lazy', decoding: 'async' }),
    ]),
    img.caption ? el('figcaption', {}, emphasize(img.caption)) : null,
  ]);
}

const paragraph = (text) => el('p', { class: 'news-article-p' }, emphasize(text));

/**
 * body[] → 노드. 문자열이나 머리글·제목 없는 항목은 예전처럼 그림 + 문단을 잇고,
 * 머리글·제목이 있으면 <section> 꼭지로 묶는다. 제목 있는 꼭지는 toc 에 { id, title } 로 등록.
 */
function renderBodyItems(items, { idPrefix, heading, toc }) {
  return items.flatMap((item, i) => {
    const { label, title, text, img } = typeof item === 'string' ? { text: item } : item;
    const paras = (Array.isArray(text) ? text : [text]).filter(Boolean).map(paragraph);
    if (!label && !title) return [renderFigure(img), ...paras];

    const id = title ? `${idPrefix}-${i + 1}` : null;
    if (id) toc.push({ id, title });
    return [
      el('section', { class: 'news-sec', id }, [
        label ? el('div', { class: 'news-sec-label' }, [label]) : null,
        title ? el(heading, { class: 'news-sec-title' }, [title]) : null,
        renderFigure(img),
        ...paras,
      ]),
    ];
  });
}

/** '원문' 링크 행 — 통합 기사 하단 */
function renderRefs(refs) {
  if (!refs?.length) return null;
  return el('div', { class: 'news-digest-refs', id: 'news-refs' }, [
    el('span', { class: 'news-digest-refs-label' }, [`원문 ${refs.length}건`]),
    ...refs.flatMap((r, i) => [
      i > 0 ? el('span', { class: 'dot' }) : null,
      el('a', { href: r.url, target: '_blank', rel: 'noopener' }, [r.label]),
    ]),
  ]);
}

function renderIssueNav(issues) {
  const nav = $('#newsIssueNav');
  if (!nav) return;
  clear(nav);
  for (const issue of issues) {
    nav.append(
      el(
        'button',
        {
          class: `chip${issue.id === currentId ? ' is-active' : ''}`,
          type: 'button',
          on: { click: () => selectIssue(issue.id) },
        },
        [chipLabel(issue)]
      )
    );
  }
}

/** 차례 링크 — 해시를 남기지 않고(뷰 전환 때 URL 에 따라붙는다) 그 자리로 스크롤 */
function jumpLink(id, children, cls) {
  return el(
    'a',
    {
      href: `#${id}`,
      class: cls,
      on: {
        click: (e) => {
          const target = document.getElementById(id);
          if (!target) return;
          e.preventDefault();
          const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
          target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
        },
      },
    },
    children
  );
}

/**
 * 오른쪽 레일 — 넓은 화면에서만 보인다 (CSS).
 * 이번 호 차례 · 원문 바로가기 · 지난 호/다음 호 · 맨 위로
 */
function renderRail(issue, issues, toc, hasRefs) {
  const { feature, featureSubs, sections } = toc;
  const tocItems = [];
  if (feature) {
    tocItems.push(
      el('li', {}, [
        jumpLink('news-feature', [el('span', { class: 'news-toc-kicker' }, ['특집']), feature.title]),
        featureSubs.length
          ? el('ol', {}, featureSubs.map((s) => el('li', {}, [jumpLink(s.id, [s.title])])))
          : null,
      ])
    );
  }
  for (const s of sections) tocItems.push(el('li', {}, [jumpLink(s.id, [s.title])]));

  const idx = issues.indexOf(issue);
  const older = issues[idx + 1];
  const newer = idx > 0 ? issues[idx - 1] : null;
  const issueButton = (target, dir) =>
    target
      ? el(
          'button',
          {
            type: 'button',
            class: 'news-rail-issue',
            on: {
              click: () => {
                selectIssue(target.id);
                window.scrollTo({ top: 0 });
              },
            },
          },
          [
            el('span', { class: 'news-rail-issue-dir' }, [dir]),
            el('span', {}, [`${target.no ? `제${target.no}호 · ` : ''}${chipLabel(target)}`]),
          ]
        )
      : null;

  return el('aside', { class: 'news-rail', 'aria-label': '이번 호 길잡이' }, [
    tocItems.length || hasRefs
      ? el('nav', { class: 'news-rail-box news-toc', 'aria-label': '이번 호 차례' }, [
          tocItems.length ? el('div', { class: 'news-rail-label' }, ['이번 호 차례']) : null,
          tocItems.length ? el('ol', {}, tocItems) : null,
          hasRefs
            ? jumpLink('news-refs', [`원문 ${issue.refs.length}건`, el('span', { 'aria-hidden': 'true' }, ['↓'])], 'news-rail-refs')
            : null,
        ])
      : null,
    el('div', { class: 'news-rail-box news-rail-issues' }, [
      issueButton(older, '← 지난 호'),
      issueButton(newer, '다음 호 →'),
      el(
        'button',
        { type: 'button', class: 'news-rail-top', on: { click: () => window.scrollTo({ top: 0, behavior: 'smooth' }) } },
        ['맨 위로 ↑']
      ),
    ]),
  ]);
}

/** 읽고 있는 꼭지를 차례에 표시 — 화면 위쪽 1/3 띠에 들어온 꼭지가 '현재' */
function watchToc(root) {
  tocObserver?.disconnect();
  tocObserver = null;
  const links = new Map(
    [...root.querySelectorAll('.news-toc ol a')].map((a) => [a.getAttribute('href').slice(1), a])
  );
  if (!links.size || !('IntersectionObserver' in window)) return;
  tocObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const current = links.get(entry.target.id);
        links.forEach((a) => a.classList.toggle('is-current', a === current));
      }
    },
    { rootMargin: '-80px 0px -66% 0px' }
  );
  for (const id of links.keys()) {
    const target = root.querySelector(`#${CSS.escape(id)}`);
    if (target) tocObserver.observe(target);
  }
}

function renderIssue(issue, issues) {
  const nodes = [];
  const toc = { feature: null, featureSubs: [], sections: [] };

  const head = el('header', { class: 'news-issue-head' }, [
    el('div', { class: 'news-issue-headrow' }, [
      el('div', { class: 'news-issue-headmain' }, [
        el('div', { class: 'news-issue-eyebrow' }, [
          `${TYPE_LABEL[issue.type] || ''} 브리핑${issue.no ? ` · 제${issue.no}호` : ''}`,
        ]),
        el('h2', { class: 'news-issue-title' }, [issue.title || 'AI 업계 브리핑']),
        el('div', { class: 'news-issue-period' }, [
          el('span', {}, [issue.period || issue.date || '']),
          el('span', { class: 'dot' }),
          el('span', {}, [`기사 ${issue.refs?.length || 0}건`]),
        ]),
      ]),
      // 낙관 — 대문 화제 '愛以我怡'를 전각 배치(우상→우하→좌상→좌하)로 새긴 인장
      el(
        'span',
        { class: 'news-issue-seal', 'aria-hidden': 'true', lang: 'zh-Hant' },
        ['我', '愛', '怡', '以'].map((c) => el('span', {}, [c]))
      ),
    ]),
    issue.intro
      ? el('p', { class: 'news-issue-intro' }, emphasize(issue.intro))
      : null,
  ]);
  nodes.push(head);

  if (issue.cover) nodes.push(renderFigure(issue.cover, 'news-cover'));

  if (issue.highlights?.length) {
    nodes.push(
      el('aside', { class: 'news-highlights' }, [
        el('div', { class: 'news-highlights-label' }, ['이번 호 요점']),
        el(
          'ul',
          {},
          issue.highlights.map((h) => el('li', {}, emphasize(h)))
        ),
      ])
    );
  }

  const { feature } = issue;
  if (feature?.body?.length) {
    if (feature.title) toc.feature = { title: feature.title };
    nodes.push(
      el('section', { class: 'news-feature', id: 'news-feature' }, [
        el('div', { class: 'news-feature-label' }, [feature.label || '이번 호 특집']),
        el('h3', { class: 'news-feature-title' }, [feature.title || '']),
        renderFigure(feature.img),
        ...renderBodyItems(feature.body, { idPrefix: 'news-feature', heading: 'h4', toc: toc.featureSubs }),
      ])
    );
  }

  const hasRefs = Boolean(issue.body?.length && issue.refs?.length);
  if (issue.body?.length) {
    // 통합 기사 모드 — 카테고리 구분 없이 한 편의 요약 기사로
    nodes.push(
      el('article', { class: 'news-article' }, [
        ...renderBodyItems(issue.body, { idPrefix: 'news-sec', heading: 'h3', toc: toc.sections }),
        renderRefs(issue.refs),
      ])
    );
  }

  nodes.push(
    el('footer', { class: 'news-foot' }, [
      '요약은 AI(Claude)가 공개 출처를 정리해 작성 — 정확한 내용은 원문 링크에서 확인.',
    ])
  );

  return el('article', { class: 'news-issue' }, [
    el('div', { class: 'news-main' }, nodes),
    renderRail(issue, issues, toc, hasRefs),
  ]);
}

export async function renderNews() {
  const body = $('#newsBody');
  const meta = $('#newsMeta');
  if (!body) return;

  const data = await loadIssues();
  const issues = data.issues || [];

  if (!issues.some((i) => i.id === currentId)) currentId = issues[0]?.id ?? null;
  renderIssueNav(issues);

  if (meta) {
    if (data.error) meta.textContent = `브리핑을 불러오지 못했습니다 (${data.error})`;
    else if (issues.length)
      meta.textContent = `브리핑 ${issues.length}호 · 갱신 ${data.updated || issues[0].date}`;
    else meta.textContent = '';
  }

  clear(body);
  const issue = issues.find((i) => i.id === currentId);
  if (!issue) {
    tocObserver?.disconnect();
    body.append(
      el('div', { class: 'news-empty' }, [
        data.error ? '브리핑을 불러오지 못했습니다.' : '아직 발행된 브리핑이 없습니다.',
      ])
    );
    return;
  }
  body.append(renderIssue(issue, issues));
  watchToc(body);
}

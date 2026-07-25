/**
 * news.js — 뉴스(AI 업계 브리핑) 뷰.
 *
 * news/issues.json 을 fetch 해서 주간/일간 브리핑을 렌더.
 * 발행 워크플로: issues[] 맨 앞에 새 이슈를 추가하고 hosting 재배포.
 *   - issue: { id, type: 'weekly'|'daily', no, title, date, period, intro,
 *              highlights[], body[](통합 기사 문단), refs[] }
 *   - ref:   { label, url }
 */

import { el, $, clear, jsonLoader } from './utils.js';

const ISSUES_URL = './news/issues.json';

const TYPE_LABEL = { weekly: '주간', daily: '일간' };

let currentId = null; // 선택된 이슈 — null 이면 최신호

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

/** '원문' 링크 행 — 통합 기사 하단 */
function renderRefs(refs) {
  if (!refs?.length) return null;
  return el('div', { class: 'news-digest-refs' }, [
    el('span', { class: 'news-digest-refs-label' }, ['원문']),
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
          on: {
            click: () => {
              currentId = issue.id;
              renderNews();
            },
          },
        },
        [chipLabel(issue)]
      )
    );
  }
}

function renderIssue(issue) {
  const nodes = [];

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

  if (issue.body?.length) {
    // 통합 기사 모드 — 카테고리 구분 없이 한 편의 요약 기사로
    nodes.push(
      el('article', { class: 'news-article' }, [
        ...issue.body.map((p) =>
          el('p', { class: 'news-article-p' }, emphasize(p))
        ),
        renderRefs(issue.refs),
      ])
    );
  }

  nodes.push(
    el('footer', { class: 'news-foot' }, [
      '요약은 AI(Claude)가 공개 출처를 정리해 작성 — 정확한 내용은 원문 링크에서 확인.',
    ])
  );

  return el('article', { class: 'news-issue' }, nodes);
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
    body.append(
      el('div', { class: 'news-empty' }, [
        data.error ? '브리핑을 불러오지 못했습니다.' : '아직 발행된 브리핑이 없습니다.',
      ])
    );
    return;
  }
  body.append(renderIssue(issue));
}

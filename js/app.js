/**
 * app.js — App shell: bootstrap, UI state, top-level render, shared utils.
 *
 * 뷰(캘린더/타임라인) 렌더링은 ./views.js, 모달은 ./modals.js 에 분리되어 있다.
 * 이 파일은 글로벌 UI state (ui), 공용 헬퍼(toast, openModal, closeModal),
 * 사이드바/상단바/잠금 UI, DOMContentLoaded 부트스트랩만 담당한다.
 */

import { store } from './store.js';
import { $, $$, debounce } from './utils.js';
import {
  bindCalendarControls,
  renderCalendar,
  bindTimelineControls,
  renderTimeline,
} from './views.js';
import {
  bindPasswordForm,
  bindSessionForm,
  renderDetail,
} from './modals.js';
import { renderLibrary } from './library.js';
import { renderNews } from './news.js';
import { renderQna, bindQnaForm } from './qna.js';

/* =============== Shared UI state =============== */
export const ui = {
  view: 'cover', // cover | calendar | timeline | library | news | qna
  calCursor: new Date(),
  calFilter: 'all',
  tlFilter: 'all',
  search: '',
  openSessionId: null,
  editingId: null, // null = create new, string = edit existing
};

/** 뷰 레지스트리 — 뷰 추가/변경 시 여기 한 곳만 고친다 (nav 마크업 제외). */
const VIEWS = {
  cover: { title: '대문', sub: 'AI 전파교육 소개' },
  calendar: { title: '캘린더', sub: '월간 교육 일정', render: renderCalendar, usesSearch: true },
  timeline: { title: '타임라인', sub: '과거 · 예정 교육 목록', render: renderTimeline, usesSearch: true },
  library: { title: '열람실', sub: '발표자료 열람 · 자료 다운로드', render: renderLibrary },
  news: { title: '뉴스', sub: 'AI 업계 브리핑 — 에이전트 · 모델 · 방법론', render: renderNews },
  qna: { title: '문의하기', sub: '질문을 남기면 답변이 댓글로 달립니다', render: renderQna },
};

/* 정적 노드 캐시 — type=module 은 defer 라 모듈 평가 시점에 DOM 완성 보장 */
const NAV_ITEMS = $$('.nav-item');
const VIEW_SECTIONS = $$('.view');
const CONTENT = $('.content');

/* =============== Top-level render =============== */
export function renderAll() {
  const st = store.getState();
  syncLock();
  renderTally(st);
  VIEWS[ui.view]?.render?.(st);
  if (ui.openSessionId) {
    const s = store.getById(ui.openSessionId);
    if (s) renderDetail(s);
    else closeModal('detail');
  }
}

/* =============== Navigation / view switching =============== */
export function switchView(view) {
  ui.view = view;
  NAV_ITEMS.forEach((n) => {
    const active = n.dataset.view === view;
    n.classList.toggle('is-active', active);
    // 스크린리더에 현재 위치 노출 — 시각적 is-active와 항상 동기
    if (active) n.setAttribute('aria-current', 'page');
    else n.removeAttribute('aria-current');
  });
  VIEW_SECTIONS.forEach((v) =>
    v.classList.toggle('is-active', v.dataset.viewContent === view)
  );
  // 뷰별 레이아웃(예: 대문 전면 화폭)은 CSS 가 data-view 로 opt-in
  if (CONTENT) CONTENT.dataset.view = view;
  const { title = '', sub = '' } = VIEWS[view] || {};
  $('#pageTitle').textContent = title;
  $('#pageSub').textContent = sub;
  renderAll();
}

function bindNav() {
  NAV_ITEMS.forEach((btn) =>
    btn.addEventListener('click', () => switchView(btn.dataset.view))
  );
  $('.sidebar-brand')?.addEventListener('click', () => switchView('cover'));
}

/* =============== Topbar: search + tally =============== */
/** 검색어 state 와 input DOM 을 함께 소유 — 둘이 어긋나지 않게 한 곳에서만 변경. */
export function setSearch(value) {
  ui.search = value.trim().toLowerCase();
  const input = $('#searchInput');
  if (input && input.value !== value) input.value = value;
}

function bindTopbar() {
  $('#searchInput').addEventListener(
    'input',
    debounce((e) => {
      setSearch(e.target.value);
      // 검색을 읽는 뷰만 다시 그린다 — 열람실/뉴스 재구축 낭비 방지
      if (VIEWS[ui.view]?.usesSearch) renderAll();
    }, 180)
  );
}

function renderTally({ sessions }) {
  const tally = $('#pageTally');
  if (!tally) return;
  const total = sessions.length;
  const attendees = sessions.reduce((a, s) => a + (s.enrolled || 0), 0);
  tally.textContent = total
    ? `교육 ${total}회 · 누적 수강 ${attendees.toLocaleString('ko-KR')}명 (동일인 누적 포함)`
    : '';
}

/* =============== Lock (edit mode) =============== */
function bindLock() {
  $('#lockBtn').addEventListener('click', () => {
    if (store.isEditing()) {
      store.lockEditing();
      toast('편집 잠금');
    } else {
      openPasswordModal();
    }
  });
}

function syncLock() {
  const btn = $('#lockBtn');
  const label = $('#lockLabel');
  if (!btn || !label) return;
  const editing = store.isEditing();
  btn.classList.toggle('is-unlocked', editing);
  btn.setAttribute('aria-pressed', editing ? 'true' : 'false');
  btn.setAttribute(
    'aria-label',
    editing ? '편집 모드 잠금' : '편집 모드 잠금 해제'
  );
  label.textContent = editing ? '편집 중' : '편집 잠금';
}

/* =============== Modal primitives =============== */
/** 모달별 닫힘 후처리 — 소유 모듈(modals.js)이 등록, primitive 는 이름을 모른다.
    저장소는 함수 프로퍼티 — modals.js 가 순환 import 로 app.js 본문 평가 전에
    등록을 호출해도 TDZ 없이 동작한다. */
export function onModalClose(name, fn) {
  (onModalClose.hooks ??= {})[name] = fn;
}

export function openModal(name) {
  const m = $(`#${name}Modal`);
  if (!m) return;
  m.classList.add('is-open');
  m.setAttribute('aria-hidden', 'false');
  // 인라인 스크립트(대문 화첩 키보드 가드)도 이 클래스로 모달 열림을 읽는다
  document.body.classList.add('is-modal-open');
  document.body.style.overflow = 'hidden';
}

export function closeModal(name) {
  const m = $(`#${name}Modal`);
  if (!m) return;
  m.classList.remove('is-open');
  m.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-modal-open');
  document.body.style.overflow = '';
  onModalClose.hooks?.[name]?.();
}

function bindGlobalModalClose() {
  document.addEventListener('click', (e) => {
    // closest() so clicks on the button's inner <svg>/<path> still resolve
    // to the [data-close] ancestor (the close button or backdrop).
    const trigger = e.target.closest?.('[data-close]');
    if (trigger) closeModal(trigger.getAttribute('data-close'));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.modal.is-open');
    if (open) closeModal(open.id.replace(/Modal$/, ''));
  });
}

export function openPasswordModal() {
  const input = $('#passwordInput');
  input.value = '';
  const hint = $('#passwordHint');
  hint.textContent = '현재 세션에만 유효합니다.';
  hint.classList.remove('is-error');
  openModal('password');
  setTimeout(() => input.focus(), 30);
}

/* =============== Toast =============== */
let toastTimer = null;
export function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-show'), 2200);
}

/* =============== Bootstrap =============== */
document.addEventListener('DOMContentLoaded', async () => {
  bindNav();
  bindTopbar();
  bindGlobalModalClose();
  bindLock();
  bindPasswordForm();
  bindCalendarControls();
  bindTimelineControls();
  bindSessionForm();
  bindQnaForm();
  store.subscribe(renderAll);

  renderAll();
  await store.init();

  if (store.getState().error) toast('데이터를 불러오지 못했습니다');
});

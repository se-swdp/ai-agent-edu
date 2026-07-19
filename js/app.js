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

/* =============== Shared UI state =============== */
export const ui = {
  view: 'cover', // cover | calendar | timeline | library
  calCursor: new Date(),
  calFilter: 'all',
  tlFilter: 'all',
  search: '',
  openSessionId: null,
  editingId: null, // null = create new, string = edit existing
};

const VIEW_TITLES = {
  cover: ['대문', 'AI 전파교육 소개'],
  calendar: ['캘린더', '월간 교육 일정'],
  timeline: ['타임라인', '과거 · 예정 교육 목록'],
  library: ['열람실', '발표자료 열람 · 자료 다운로드'],
};

/* =============== Top-level render =============== */
export function renderAll() {
  const st = store.getState();
  syncLock();
  renderTally(st);
  if (ui.view === 'calendar') renderCalendar(st);
  if (ui.view === 'timeline') renderTimeline(st);
  if (ui.view === 'library') renderLibrary();
  if (ui.openSessionId) {
    const s = store.getById(ui.openSessionId);
    if (s) renderDetail(s);
    else closeModal('detail');
  }
}

/* =============== Navigation / view switching =============== */
export function switchView(view) {
  ui.view = view;
  $$('.nav-item').forEach((n) => {
    const active = n.dataset.view === view;
    n.classList.toggle('is-active', active);
    // 스크린리더에 현재 위치 노출 — 시각적 is-active와 항상 동기
    if (active) n.setAttribute('aria-current', 'page');
    else n.removeAttribute('aria-current');
  });
  $$('.view').forEach((v) =>
    v.classList.toggle('is-active', v.dataset.viewContent === view)
  );
  // 대문은 전면 화폭 — content 의 max-width/패딩 캡을 해제
  const content = $('.content');
  if (content) content.classList.toggle('content--cover', view === 'cover');
  const [t, sub] = VIEW_TITLES[view] || ['', ''];
  $('#pageTitle').textContent = t;
  $('#pageSub').textContent = sub;
  renderAll();
}

function bindNav() {
  $$('.nav-item[data-view]').forEach((btn) =>
    btn.addEventListener('click', () => switchView(btn.dataset.view))
  );
  $('.sidebar-brand')?.addEventListener('click', () => switchView('cover'));
}

/* =============== Topbar: search + tally =============== */
function bindTopbar() {
  $('#searchInput').addEventListener(
    'input',
    debounce((e) => {
      ui.search = e.target.value.trim().toLowerCase();
      renderAll();
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
export function openModal(name) {
  const m = $(`#${name}Modal`);
  if (!m) return;
  m.classList.add('is-open');
  m.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

export function closeModal(name) {
  const m = $(`#${name}Modal`);
  if (!m) return;
  m.classList.remove('is-open');
  m.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (name === 'detail') ui.openSessionId = null;
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
  store.subscribe(renderAll);

  renderAll();
  await store.init();

  if (store.getState().error) toast('데이터를 불러오지 못했습니다');
});

/**
 * qna.js — 문의하기 뷰.
 *
 * inquiries 컬렉션(문의 글) + inquiry_comments 컬렉션(답변 댓글, inquiryId 필드로 연결).
 * 두 컬렉션 모두 onSnapshot 구독 — 다른 탭/브라우저의 문의·답변이 즉시 반영된다.
 * 글쓰기는 누구나(이름은 선택), 삭제는 편집 모드(관리자)에서만 노출.
 *
 * 스냅샷이 도착할 때마다 뷰 전체를 다시 그리므로, 입력 중이던 답글이 날아가지
 * 않도록 drafts 맵에 입력값을 보존했다가 렌더 후 복원한다.
 */

import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import { db } from './firebase.js';
import { store } from './store.js';
import { el, $, clear } from './utils.js';
import { toast } from './app.js';

const INQUIRIES_COLLECTION = 'inquiries';
const COMMENTS_COLLECTION = 'inquiry_comments';
const NAME_STORAGE_KEY = 'lecture-dashboard.qna-name';

let inquiries = null; // null = 첫 스냅샷 전 (로딩)
let comments = [];
let loadError = null;
let started = false;

/** 렌더를 넘나드는 입력 보존 — key: 'new' | inquiryId, value: 답글 본문 */
const drafts = new Map();

/* =============== helpers =============== */

const millis = (t) => (t && typeof t.toMillis === 'function' ? t.toMillis() : Date.now());

function formatTime(t) {
  if (!t || typeof t.toDate !== 'function') return '방금';
  const d = t.toDate();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}. ${p(d.getMonth() + 1)}. ${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function savedName() {
  return localStorage.getItem(NAME_STORAGE_KEY) || '';
}

function rememberName(name) {
  if (name) localStorage.setItem(NAME_STORAGE_KEY, name);
}

/* =============== live subscription =============== */

function start() {
  if (started) return;
  started = true;
  onSnapshot(
    collection(db, INQUIRIES_COLLECTION),
    (snap) => {
      inquiries = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => millis(b.createdAt) - millis(a.createdAt));
      loadError = null;
      rerenderIfActive();
    },
    (err) => {
      console.error('[qna] inquiries snapshot error', err);
      loadError = err;
      inquiries = [];
      rerenderIfActive();
    }
  );
  onSnapshot(
    collection(db, COMMENTS_COLLECTION),
    (snap) => {
      comments = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => millis(a.createdAt) - millis(b.createdAt));
      rerenderIfActive();
    },
    (err) => console.error('[qna] comments snapshot error', err)
  );
}

function rerenderIfActive() {
  const sec = document.querySelector('[data-view-content="qna"]');
  if (sec?.classList.contains('is-active')) renderQna();
}

/* =============== writes =============== */

async function createInquiry(name, body) {
  await addDoc(collection(db, INQUIRIES_COLLECTION), {
    name: name || '익명',
    body,
    createdAt: serverTimestamp(),
  });
}

async function createComment(inquiryId, name, body) {
  await addDoc(collection(db, COMMENTS_COLLECTION), {
    inquiryId,
    name: name || '익명',
    body,
    createdAt: serverTimestamp(),
  });
}

async function removeComment(id) {
  await deleteDoc(doc(db, COMMENTS_COLLECTION, id));
}

async function removeInquiry(inq) {
  // 문의를 지우면 달린 답변 댓글도 함께 정리
  const orphans = await getDocs(
    query(collection(db, COMMENTS_COLLECTION), where('inquiryId', '==', inq.id))
  );
  await Promise.all(orphans.docs.map((d) => deleteDoc(d.ref)));
  await deleteDoc(doc(db, INQUIRIES_COLLECTION, inq.id));
}

/* =============== render =============== */

const ICON_TRASH =
  '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
  '<path d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m2.5 0-.7 9.1a1.5 1.5 0 0 1-1.5 1.4H7.7a1.5 1.5 0 0 1-1.5-1.4L5.5 6M8.2 9v4.5M11.8 9v4.5"/></svg>';

function deleteButton(label, onClick) {
  const btn = el('button', {
    class: 'icon-btn qna-del',
    type: 'button',
    'aria-label': label,
    title: label,
    on: { click: onClick },
  });
  btn.innerHTML = ICON_TRASH;
  return btn;
}

function renderComment(c, editing) {
  return el('div', { class: 'qna-comment' }, [
    el('div', { class: 'qna-comment-head' }, [
      el('span', { class: 'qna-comment-name' }, [c.name || '익명']),
      el('span', { class: 'qna-time' }, [formatTime(c.createdAt)]),
      editing
        ? deleteButton('답변 삭제', async () => {
            if (!confirm('이 답변을 삭제할까요?')) return;
            try {
              await removeComment(c.id);
              toast('답변 삭제됨');
            } catch (e) {
              console.error('[qna] comment delete failed', e);
              toast('삭제하지 못했습니다');
            }
          })
        : null,
    ]),
    el('div', { class: 'qna-comment-body' }, [c.body || '']),
  ]);
}

function renderReplyForm(inq) {
  const input = el('input', {
    class: 'form-input qna-reply-input',
    type: 'text',
    maxlength: '500',
    placeholder: '답변을 남겨주세요',
    'aria-label': '답변 내용',
    value: drafts.get(inq.id) || '',
    on: { input: (e) => drafts.set(inq.id, e.target.value) },
  });
  const form = el('form', { class: 'qna-reply' }, [
    input,
    el('button', { class: 'btn btn-primary btn-sm', type: 'submit' }, ['답변']),
  ]);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = input.value.trim();
    if (!body) return;
    try {
      await createComment(inq.id, savedName(), body);
      drafts.delete(inq.id);
      input.value = '';
      toast('답변이 등록되었습니다');
    } catch (err) {
      console.error('[qna] comment create failed', err);
      toast('답변을 등록하지 못했습니다');
    }
  });
  return form;
}

function renderCard(inq, inqComments, editing) {
  return el('article', { class: 'qna-card' }, [
    el('div', { class: 'qna-card-head' }, [
      el('span', { class: 'qna-card-name' }, [inq.name || '익명']),
      el('span', { class: 'qna-time' }, [formatTime(inq.createdAt)]),
      el('span', { class: 'qna-count' }, [
        inqComments.length ? `답변 ${inqComments.length}` : '답변 대기',
      ]),
      editing
        ? deleteButton('문의 삭제', async () => {
            if (!confirm('이 문의와 달린 답변을 모두 삭제할까요? 되돌릴 수 없습니다.')) return;
            try {
              await removeInquiry(inq);
              toast('문의 삭제됨');
            } catch (e) {
              console.error('[qna] inquiry delete failed', e);
              toast('삭제하지 못했습니다');
            }
          })
        : null,
    ]),
    el('div', { class: 'qna-card-body' }, [inq.body || '']),
    el('div', { class: 'qna-comments' }, [
      ...inqComments.map((c) => renderComment(c, editing)),
      renderReplyForm(inq),
    ]),
  ]);
}

export function renderQna() {
  start();
  const list = $('#qnaList');
  const meta = $('#qnaMeta');
  if (!list) return;

  if (meta) {
    meta.textContent =
      inquiries === null
        ? '문의를 불러오는 중…'
        : inquiries.length
          ? `문의 ${inquiries.length}건 · 답변 ${comments.length}건`
          : '';
  }

  clear(list);
  if (loadError) {
    list.append(
      el('div', { class: 'qna-empty' }, ['문의를 불러오지 못했습니다. 잠시 후 새로고침 해주세요.'])
    );
    return;
  }
  if (inquiries === null) return;
  if (!inquiries.length) {
    list.append(
      el('div', { class: 'qna-empty' }, ['아직 문의가 없습니다. 첫 질문을 남겨보세요.'])
    );
    return;
  }

  const editing = store.isEditing();
  const byInquiry = new Map();
  for (const c of comments) {
    const l = byInquiry.get(c.inquiryId);
    if (l) l.push(c);
    else byInquiry.set(c.inquiryId, [c]);
  }
  for (const inq of inquiries) {
    list.append(renderCard(inq, byInquiry.get(inq.id) || [], editing));
  }
}

/* =============== top form =============== */

export function bindQnaForm() {
  const form = $('#qnaForm');
  if (!form) return;
  const nameInput = form.elements.name;
  const bodyInput = form.elements.body;
  nameInput.value = savedName();
  bodyInput.value = drafts.get('new') || '';
  bodyInput.addEventListener('input', () => drafts.set('new', bodyInput.value));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = bodyInput.value.trim();
    if (!body) return;
    const name = nameInput.value.trim();
    rememberName(name);
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    try {
      await createInquiry(name, body);
      drafts.delete('new');
      bodyInput.value = '';
      toast('문의가 등록되었습니다');
    } catch (err) {
      console.error('[qna] inquiry create failed', err);
      toast('문의를 등록하지 못했습니다');
    } finally {
      submitBtn.disabled = false;
    }
  });
}

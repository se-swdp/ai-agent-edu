/**
 * visits.js — 방문자 카운터.
 *
 * visits 컬렉션: 날짜별 문서(YYYY-MM-DD)의 count 를 increment, _total 문서에 누적.
 * 같은 브라우저는 localStorage 날짜 표식으로 하루 1회만 집계 (페이지 새로고침 중복 방지).
 * 사이드바 푸터에 "오늘 N · 누적 N" 실시간 표시.
 */

import { doc, setDoc, increment, onSnapshot } from 'firebase/firestore';

import { db } from './firebase.js';
import { store } from './store.js';
import { $, todayKey } from './utils.js';

const VISITS_COLLECTION = 'visits';
const VISIT_STORAGE_KEY = 'lecture-dashboard.visit-date';

let today = 0;
let total = 0;
let todayLoaded = false;
let totalLoaded = false;

function render() {
  const elMeta = $('#visitMeta');
  if (!elMeta) return;
  // 집계는 모두, 표시는 관리자(편집 모드)만
  if (!store.isEditing() || !todayLoaded || !totalLoaded) {
    elMeta.hidden = true;
    return;
  }
  elMeta.hidden = false;
  elMeta.textContent = `오늘 ${today.toLocaleString('ko-KR')} · 누적 ${total.toLocaleString('ko-KR')}`;
  elMeta.title = '방문자 수 (브라우저당 하루 1회 집계)';
}

async function record(dateKey) {
  // 실패해도 앱 동작에 영향 없음 — 조용히 무시
  try {
    await setDoc(doc(db, VISITS_COLLECTION, dateKey), { count: increment(1) }, { merge: true });
    await setDoc(doc(db, VISITS_COLLECTION, '_total'), { count: increment(1) }, { merge: true });
    localStorage.setItem(VISIT_STORAGE_KEY, dateKey);
  } catch (e) {
    console.warn('[visits] record failed', e);
  }
}

export function initVisits() {
  const dateKey = todayKey();
  if (localStorage.getItem(VISIT_STORAGE_KEY) !== dateKey) record(dateKey);

  store.subscribe(render); // 편집 잠금/해제 시 표시 토글

  onSnapshot(
    doc(db, VISITS_COLLECTION, dateKey),
    (snap) => {
      today = snap.data()?.count || 0;
      todayLoaded = true;
      render();
    },
    (e) => console.warn('[visits] today snapshot error', e)
  );
  onSnapshot(
    doc(db, VISITS_COLLECTION, '_total'),
    (snap) => {
      total = snap.data()?.count || 0;
      totalLoaded = true;
      render();
    },
    (e) => console.warn('[visits] total snapshot error', e)
  );
}

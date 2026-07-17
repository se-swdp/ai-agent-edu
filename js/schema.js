/**
 * schema.js — single source of truth for the session record shape.
 *
 * 브라우저 store 가 사용하는 canonical 필드셋 · status enum · normalization ·
 * 기본 정렬을 한 곳에 모은다.
 */

export const STATUS_LABEL = Object.freeze({
  scheduled: '예정',
  ongoing: '진행중',
  completed: '완료',
});

export const STATUSES = Object.freeze(Object.keys(STATUS_LABEL));
const STATUS_SET = new Set(STATUSES);

export function normalize(s) {
  return {
    id: String(s.id || ''),
    title: String(s.title || '').trim(),
    topic: s.topic ? String(s.topic).trim() : '',
    date: String(s.date || ''),
    startTime: s.startTime || '',
    endTime: s.endTime || '',
    isOnline:
      s.isOnline === true || s.isOnline === 'true' || s.isOnline === 1,
    location: s.location ? String(s.location).trim() : '',
    instructor: s.instructor ? String(s.instructor).trim() : '',
    audience: s.audience ? String(s.audience).trim() : '',
    enrolled: Number(s.enrolled) || 0,
    capacity: Number(s.capacity) || 0,
    status: STATUS_SET.has(s.status) ? s.status : 'scheduled',
    description: s.description ? String(s.description) : '',
  };
}

export function compareSessions(a, b) {
  return (
    a.date.localeCompare(b.date) ||
    (a.startTime || '').localeCompare(b.startTime || '') ||
    a.id.localeCompare(b.id)
  );
}

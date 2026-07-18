# AI, 어디까지 왔고 어디로 가는가 — 2026년 7월 AI 체크포인트 (HTML 덱 · 28장)

2026-07-17 전면 재설계(v2). 기존 손글씨 이미지 노트 덱(영어 원문)은 실제 세미나 진행이
어려워, **시간축 내러티브("지금 어디까지 왔나 → 앞으로 어디로 가나") 위에 Claude Code를
렌즈로 놓는 한국어 HTML 덱**으로 완전히 새로 제작. 개발자 + 지식노동자 혼합 청중, 40분 기준.

**관통 주제(척추 문장)**: "모델 능력은 지수로 오르고 토큰 단가는 폭락하는데, 인간의 이해
속도만 상수로 남았다 — 그래서 병목이 '구현'에서 '인지'로 이동했다."

## 파일 구조

- `index.html` — 상영본 (html-slides v2 플랫 다크 덱 · ←/→/Space/Home/End, `F` 전체화면, 터치 스와이프, `#N` 딥링크)
- `note-deck.html` — **같은 v2 내용의 손글씨 노트 이미지 덱(22장, 한국어)** 뷰어. 이미지·부속 파일은 `note/`.
- `note-deck-legacy.html` — (레거시) 2026-07-17 오전 제작한 영어 손글씨 덱 뷰어. 이미지·부속 파일은 `note-legacy/`.
- `note/` — 현행 한국어 노트 덱: `NN-slug.webp` 22장 · `deck-spec.json` · `src-png/`(원본 PNG, gitignore)
- `note-legacy/` — 레거시 영어 노트 덱: `NN-slug.webp` 21장 · `deck-spec.json` · `PLAN.md` · `src-png/`(gitignore)

## 구성 (28장 = 본편 17 + 커버 · 훅 · 디바이더 4 · 소결 2 · 클로징 · 출처 · Q&A)

| 구간 | 슬라이드(1-based) | 내용 | 액센트 |
|------|------|------|--------|
| 오프닝 | 1–2 | 커버 · 훅("병목은 구현에서 인지로") | — |
| ① 지금 어디까지 왔나 | 3–6 | 디바이더 · 일선 증언(Karpathy/Cherny) · 5년 압축사 · 2026.7 지표 | sky |
| ② 하나의 도구로 읽는 현재 | 7–14 | 디바이더 · 태생(안전 연구→$1B) · IDE는 인간용 안경 · The Loop(SVG) · Scaffolding · "100줄" 인용 · 수렴 증거(Karpathy/Hassabis/Clark) · 소결("낙관의 곡선") | cyan |
| ③ 현실의 마찰 | 15–22 | 디바이더 · 보안(Willison) · 품질(Ronacher 토큰 팩토리) · 토큰 역설(-67% vs 5~30배) · 사건들(Uber/Meta) · 이해 병목(5~7배 갭) · 대응 워크플로우 · 소결("인간의 곡선만 평평하다") | amber |
| ④ 앞으로 어디로 가나 | 23–28 | 디바이더 · 세 곡선(SVG) · 역할 재정의 · "We are 1% done" · 출처 4편 · Q&A | blue |

## 내러티브 설계 노트

- 텐션 곡선: 낙관(①②) → 현실(③) → 종합(④). 14장 소결("낙관의 곡선")이 ③으로 넘어가는 브릿지, 16장 Ronacher의 "토큰 팩토리" 냉소가 비용 파트 진입 브릿지.
- 22장 소결("기술의 두 곡선은 휘는데 인간의 곡선만 평평하다")이 클라이맥스 — 24장 세 곡선 그래프가 이를 시각화로 회수.
- 수미상관: 커버 질문 2개 → 클로징 "We are 1% done" + Q&A 질문 3개.
- 수치·인용은 기획서 v2(2026-07-17, 최신 조사 반영) 기준. 출처 귀속은 각 슬라이드 하단 `.meta`에 표기.

## 노트 덱 이미지 생성 재현 (note/ · 2026-07-17)

- 구성: HTML 덱 28장을 22장으로 압축 (소결 배너 2장·태생 타임라인·역할 재정의·출처·Q&A 단독 장 제외,
  핵심 문구는 디바이더 부제·클로징에 흡수). 커버 1 + 훅 1 + 디바이더 4 + 본편 16.
- 생성: note-deck 스킬 `gen_deck.py` 배치 (codex exec, 드라이버 gpt-5.6-sol +
  `model_reasoning_effort="low"`, 내장 image_gen). `note/deck-spec.json` 참조.
  22/22 1차 성공(장당 98~126초, 병렬 3), **재생성 0장** — 15번 "스펙" 의심 부위는 확대 검수로 정상 확인.
- 인코딩: `python ~/.claude/skills/note-deck/scripts/encode_webp.py note` (q95 고정, 22장 3.3MB).
- 2026-07-17 2차: 제목 변경("AI, 어디까지 왔고 어디로 가는가") + 4-agent 웹 팩트체크 반영으로
  6장 재생성 (01 표지 · 06 지표(57%/95%/40%) · 10 Scaffolding("Claude Code 팀 이야기" 부제,
  펀치라인 순화) · 12 수렴(Clark→Amodei 귀속 정정) · 18 이해병목(속도=업계 추정 명시) ·
  19 제동장치(RCT 24~39→65~86%)). 원본을 `note/src-png/ref/`에 두고 style_refs로 첨부해 재생성, 6/6 1차 성공.
- 검증: 뷰어(note-deck.html) 참조 22개 ↔ webp 22장 ↔ 1672×941 전량 일치 (수동 스크립트,
  verify_deck.py는 덱 폴더 내 index.html 전제라 미사용).
- 수정 시: 원본 `note/src-png/NN-slug.png`를 `-i`로 첨부해 note-deck 스킬
  references/prompts.md Recipe 3("Recreate EXACTLY … ONLY these changes") 사용.

## 레거시 노트 덱 (note-deck-legacy.html)

이미지 재생성·검증 절차는 git 히스토리의 이전 README(커밋 037e5a0) 및 `note-legacy/PLAN.md` 참조.
매니페스트: `node scripts/build-materials-manifest.mjs` (배포 predeploy hook이 자동 실행)

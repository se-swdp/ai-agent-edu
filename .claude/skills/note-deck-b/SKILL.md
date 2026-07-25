---
name: note-deck-b
description: >
  수묵 문인화(서당 먹 노트) 스타일 노트 덱 변형 — 사용자가 "수묵", "붓글씨", "서당", "먹",
  "문인화", "동양화 스타일", "note-deck-b", "B 스타일"을 언급하거나 사이트 대문(수묵 풍속화)과
  브랜드 톤을 맞춘 덱을 원하면 사용. 한지 + 붓글씨 제목 + 먹선 박스 + 愛以我怡 낙관 +
  한복 입은 수묵 서동 로봇 — "서당 훈장의 저녁 공부 노트"라는 노트 공유 정체성의 문인화 재해석.
  내용 설계·어투는 deck-authoring 스킬, 생성 파이프라인은 전역 note-deck 스킬을 그대로 따르고,
  이 스킬은 STYLE 블록과 레이아웃 어휘만 교체한다.
---

# Note Deck B — 서당 먹 노트 (Sumuk Scholar's Note)

정체성: **서당 훈장이 저녁에 남긴 공부 노트.** 사이트 대문의 수묵 문인화(서당·풍속도 연작)와
같은 세계관 — 대시보드·뉴스 인장(愛以我怡)·발표덱이 하나의 브랜드로 묶인다.

검증된 템플릿(2026-07-25 1차 통과): `assets/style-refs/cover.webp`, `cards.webp`.
새 슬라이드 생성 시 이 두 장 + 사이트 대문 그림(`assets/hero-v10.jpg`, 레포 루트)을
`style_refs`로 함께 첨부하면 수묵 질감이 유지된다.

## STYLE 블록 (deck-spec prompt에 그대로 사용)

프롬프트 맨 앞에 붙일 것: `The attached image(s) are MOOD REFERENCE only — borrow the
Korean ink-painting (수묵) brush texture, hanji paper feel, and calm literati composition.
Do NOT copy their scene or layout; create a presentation slide per the spec below.`

```text
STYLE — Korean scholar's ink-brush note slide (문인화 노트), 16:9 landscape:
- Background: warm hanji paper (#F3EBDA) with visible natural fiber texture, generous
  asymmetric empty space like a literati painting.
- Title: expressive Korean BRUSH CALLIGRAPHY (붓글씨) in charcoal-black ink (먹) —
  thick-thin strokes with slight natural ink bleed, dignified but warm. Body text in
  smaller, neater brush-pen handwriting. All Korean text rendered VERBATIM as quoted —
  every syllable exactly as written, no invented characters.
- Accents: cinnabar red (#B0392E) used ONLY for the seal stamp / one seal-dot check
  mark; thin vermilion brush underline strokes allowed sparingly. No other colors.
- Seal: ONE square carved seal stamp (낙관) containing "愛以我怡" arranged 2x2 —
  cover and closing slides only.
- Boxes: drawn with single confident charcoal brush lines, softly organic corners —
  like frames drawn by a calligrapher in one motion.
- Illustration: one small sumi-e ink-wash drawing — a cute little robot wearing hanbok
  (서동), painted in loose gray ink washes. Scene varies per slide (grinding ink at an
  inkstone, unrolling a hand-scroll, holding a brush...).
- Numbers and Latin text in the same brush handwriting.
- Composition: calm, asymmetric, lots of breathing room. Mood: a scholar's evening
  study note in a seodang.
```

## 레이아웃 어휘 번역 (note-deck 기본 레시피 → 문인화)

| 기본 레시피 | 이 스타일 |
|---|---|
| 파란 이중 밑줄 | 주홍 붓 밑줄 단일 획 |
| 노랑 형광펜 | 없음 — 라벨을 조금 큰 붓글씨로 |
| 빨간 별 낙서·체크 | 주홍 낙관식 원형 체크 1개 |
| 카드 테두리 | 한 획 먹선 박스 (유기적 모서리) |
| 강조 배너 | **두루마리(hand-scroll)** 에 펀치라인 — 서동이 펼치는 구도 가능 |
| 로봇 마스코트 | 한복 입은 수묵 서동 (장면은 슬라이드마다 변주) |
| 커버 낙관 | 愛以我怡 2x2 전각 인장 (우상단) |

## 주의점

- 붓글씨는 획이 겹쳐 **오탈자 위험이 기본 스타일보다 높다** — 검수 시 제목을 확대해 자획 확인.
- 낙관의 4자 배열이 전통 전각 순서(우상→우하→좌상→좌하)와 다르게 나올 수 있다 —
  뉴스 뷰 인장과 나란히 놓일 일이 없으면 허용, 신경 쓰이면 Recipe 3로 교정.
- 서동 일러스트는 매력 자산이지만 텍스트 영역을 침범하기 쉽다 — "small"을 유지하고
  본편 장에서는 모서리로 밀 것.

## 파이프라인

내용 설계·어투 → 프로젝트 `deck-authoring` 스킬. 스펙 작성·배치 생성(`gen_deck.py`)·
육안 검수·`encode_webp.py`·뷰어 조립·README → 전역 `note-deck` 스킬 §1~8 그대로.
이 스킬은 STYLE 블록과 위 어휘 표만 교체한다.

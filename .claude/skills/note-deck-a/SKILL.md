---
name: note-deck-a
description: >
  칠판(chalkboard) 스타일 노트 덱 변형 — 사용자가 "칠판 스타일", "분필", "다크 스타일 발표",
  "note-deck-a", "A 스타일"을 언급하거나 어두운 발표장·저녁 세션용 덱을 원하면 사용.
  짙은 흑록 칠판에 하얀 분필 필기 — "야근 끝, 팀을 위해 칠판에 남긴 선배의 정리"라는
  노트 공유 정체성의 명도 반전 재해석. 내용 설계·어투는 deck-authoring 스킬,
  생성 파이프라인(스펙·gen_deck.py·검수·인코딩·뷰어)은 전역 note-deck 스킬을 그대로 따르고,
  이 스킬은 STYLE 블록과 레이아웃 어휘만 교체한다.
---

# Note Deck A — 칠판 (After-hours Chalkboard)

정체성: **야근이 끝난 저녁, 내일 출근할 팀을 위해 칠판에 남겨둔 선배의 정리.**
크림색 종이 노트의 명도 반전판 — 노트를 "공유한다"는 DNA는 같고, 지면이 칠판으로 바뀐다.

검증된 템플릿(2026-07-25 1차 통과): `assets/style-refs/cover.webp`, `cards.webp`.
새 슬라이드 생성 시 이 두 장을 `style_refs`로 첨부하면 톤이 유지된다.

## STYLE 블록 (deck-spec prompt에 그대로 사용)

프롬프트 맨 앞에 붙일 것: `No reference image is attached — if any is, IGNORE it entirely
and follow only the STYLE block below.` (이 스킬의 style-refs를 첨부할 때는 이 줄 대신
"match the attached slides' chalk style exactly"로 교체)

```text
STYLE — Korean chalkboard lecture-note presentation slide, 16:9 landscape:
- Background: deep charcoal-green chalkboard surface (#1F2B26), realistic fine chalk
  dust, faint ghost traces of erased writing in places. No wooden frame, board surface
  fills the slide.
- Text: white chalk Korean handwriting with grainy chalk stroke texture — confident,
  legible. Titles large; body medium. All Korean text rendered VERBATIM as quoted —
  every syllable exactly as written, no invented characters.
- Accents: pale butter-yellow chalk (#EFE3B0) for the single underline stroke and short
  label emphasis; soft coral chalk (#E8A19A) for at most one circle or check mark.
  No other colors.
- Boxes: rounded rectangles drawn in white chalk lines, slightly rough like real chalk.
- Mascot: tiny robot drawn in simple white chalk lines (round head, small antenna,
  smiling).
- Numbers and Latin text in the same chalk handwriting.
- Composition: generous dark space, calm alignment, nothing touching the edges.
  Mood: the quiet end of a long day — someone left their best explanation on the board
  for the team to find tomorrow.
```

## 레이아웃 어휘 번역 (note-deck 기본 레시피 → 칠판)

| 기본 레시피 | 이 스타일 |
|---|---|
| 파란 이중 밑줄 | 버터옐로 분필 단일 획 |
| 노랑 형광펜 | 라벨을 버터옐로 분필로 직접 씀 |
| 빨간 별 낙서·체크 | 코랄 분필 서클 또는 체크 1개만 |
| 카드 검정 테두리 | 하얀 분필 라운드 박스 |
| 강조 배너 | 이중 분필 테두리 배너 |
| 로봇 마스코트 | 하얀 분필 선 로봇 |

## 주의점

- **어두운 배경 = 인쇄·유인물 부적합.** 상영 전용. 유인물이 필요하면 기본 크림 노트 스타일 병행.
- 분필 질감 특성상 아주 작은 글씨는 뭉개진다 — 장당 텍스트를 기본 스타일보다 한 단계 더 줄일 것.
- 검수 시 "지운 자국(ghost traces)"이 글자를 침범했는지 확인.

## 파이프라인

내용 설계·어투 → 프로젝트 `deck-authoring` 스킬. 스펙 작성(deck-spec.json)·배치 생성
(`gen_deck.py`)·육안 검수·`encode_webp.py`·뷰어 조립·README → 전역 `note-deck` 스킬 §1~8
그대로. 이 스킬은 STYLE 블록과 위 어휘 표만 교체한다.

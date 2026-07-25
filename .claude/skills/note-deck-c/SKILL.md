---
name: note-deck-c
description: >
  교정지 첨삭(marked-up proof) 스타일 노트 덱 변형 — 사용자가 "교정지", "첨삭", "빨간펜",
  "보고서 마크업", "note-deck-c", "C 스타일"을 언급하거나 '기계 산출물 위에 사람의 판단'이라는
  메시지를 시각 자체로 말하는 덱을 원하면 사용. 인쇄된 명조 보고서 위에 리뷰어가 빨간펜·연필·
  형광펜으로 첨삭한 2레이어 구성 — 노트 공유 정체성을 '문서 위의 주석'으로 재해석한 것으로,
  검증·리뷰·비용 게이트 등 사람의 판단을 다루는 주제와 주제-형식 공명이 가장 강하다.
  내용 설계·어투는 deck-authoring 스킬, 생성 파이프라인은 전역 note-deck 스킬을 그대로 따르고,
  이 스킬은 STYLE 블록과 레이아웃 어휘만 교체한다.
---

# Note Deck C — 교정지 첨삭 (Marked-up Proof)

정체성: **결재 서류에 남긴 선배의 빨간펜.** 기계가 뽑은 반듯한 보고서(인쇄층) 위에
사람의 손(마크업층)이 판단을 얹는다 — "AI 산출물 위에 앉는 인간의 판단"이라는 이 레포의
철학을 형식 자체가 수행한다. 검증·리뷰·게이트·비용 통제 주제에서 최우선 후보.

검증된 템플릿(2026-07-25 1차 통과): `assets/style-refs/cover.webp`, `cards.webp`.
새 슬라이드 생성 시 이 두 장을 `style_refs`로 첨부하면 톤이 유지된다.

## STYLE 블록 (deck-spec prompt에 그대로 사용)

프롬프트 맨 앞에 붙일 것: `No reference image is attached — if any is, IGNORE it entirely
and follow only the STYLE block below.` (이 스킬의 style-refs를 첨부할 때는 이 줄 대신
"match the attached slides' two-layer proof style exactly"로 교체)

```text
STYLE — 'marked-up proof' presentation slide: a machine-printed Korean report page that
a human reviewer has annotated by hand. 16:9 landscape. TWO distinct layers:
- PRINTED LAYER: near-white clean paper (#FBFBF8) styled like an enlarged A4 report
  page — a thin printed header rule at top, subtle margins. Printed Korean text in a
  neat serif (명조) typeface look, perfectly regular, clearly MACHINE-PRINTED. Rows may
  be separated by thin printed rules like a formal report table. All printed Korean
  text rendered VERBATIM as quoted.
- HANDWRITTEN MARKUP LAYER on top: a reviewer's red ballpoint pen (circles, arrows,
  underlines, check marks, asterisks) and gray pencil margin notes in casual Korean
  handwriting, plus one soft yellow highlighter swipe. The markup is loose and human,
  contrasting sharply with the printed base. Handwritten Korean also VERBATIM as quoted.
- Two small pieces of beige masking tape at the top corners, as if the page is taped
  to a wall.
- Mascot: a tiny robot doodled in pencil in the margin — the reviewer's idle doodle.
- Composition: the printed page fills the slide with clean margins; markup breathes on
  top. Mood: a senior's red-pen review on a fresh report — the human judgment sitting
  on top of the machine output.
```

## 레이아웃 어휘 번역 (note-deck 기본 레시피 → 교정지)

| 기본 레시피 | 이 스타일 |
|---|---|
| 손글씨 제목 | **인쇄 명조 제목** + 핵심어에 빨간펜 서클·여백 메모 |
| 파란 이중 밑줄 | 인쇄 헤더 괘선 (밑줄 불필요) |
| 노랑 형광펜 | 형광펜 스와이프 1곳 (동일) |
| 빨간 별 낙서·체크 | 빨간펜 체크·밑줄·화살표 — 리뷰어 마크업으로 자연스럽게 |
| 카드 | 인쇄 표 행(라벨 | 내용) + 가는 괘선 |
| 강조 배너 | **펀치라인을 빨간펜 육필 대문짝 스크롤** + 거친 이중 밑줄 — 이 스타일의 시그니처 |
| 로봇 마스코트 | 여백의 연필 낙서 로봇 |
| 여백 메모 | 연필 손글씨 짧은 혼잣말 ("왜 커졌지?") — 장당 1개 이하 |

## 주의점

- 이 스타일의 생명은 **두 레이어의 대비** — 인쇄층이 손글씨처럼 흔들리거나 마크업층이
  너무 단정하면 실패. 검수 시 "인쇄층은 perfectly regular한가"를 첫 항목으로.
- 마크업은 리뷰어의 손이므로 **장당 3~4개 요소가 상한** — 첨삭이 많아지면 노트가 아니라
  낙서가 된다. 핵심 1곳만 서클, 펀치라인은 육필로.
- 인쇄층 명조는 이미지 모델이 폰트를 흉내 내는 것 — 긴 문단은 자형이 무너진다.
  행당 한 줄 원칙을 기본 스타일보다 엄격히.

## 파이프라인

내용 설계·어투 → 프로젝트 `deck-authoring` 스킬. 스펙 작성·배치 생성(`gen_deck.py`)·
육안 검수·`encode_webp.py`·뷰어 조립·README → 전역 `note-deck` 스킬 §1~8 그대로.
이 스킬은 STYLE 블록과 위 어휘 표만 교체한다.

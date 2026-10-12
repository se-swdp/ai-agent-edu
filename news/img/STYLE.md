# 뉴스 이슈 그림 — 스타일 프롬프트와 제작 절차

7호(2026-10-12)부터 이슈마다 그림을 넣는다: 대표 그림(`cover`) 1장 + 특집(`feature`) 1~3장 + 본문 섹션마다 1장.
스키마는 `js/news.js` 상단 주석. 그림은 `news/img/<issue id>/<name>.webp`, JSON에는 `/news/img/...` 절대경로.

## 생성

OpenRouter 스크립트를 단독 모드로 쓴다 (레퍼런스 없이 → 프롬프트가 그대로 나간다). 모델은 `openai/gpt-5.4-image-2`
(1280×720, 장당 약 $0.14·75초, 한글 verbatim 정확, 매거진 톤이 가장 깔끔). 여러 장은 병렬로 돌린다.

```bash
python .claude/skills/note-deck-openrouter/scripts/gen_openrouter.py --one <scratch>/out/cover.png \
  --prompt-file <scratch>/p/cover.txt --model openai/gpt-5.4-image-2
```

프롬프트 파일 = 아래 STYLE 블록 + `CONTENT:` (kicker 태그 · 2줄 헤드라인 · 숫자 블록 3개(숫자 + 라벨) · 일러스트 장면).
숫자·라벨은 본문에 실제로 쓴 값만 넣는다. 실존 인물 얼굴·로고는 넣지 않는다.

## 검수·인코딩

- 생성된 PNG를 한 장씩 열어 한글 오탈자와 숫자를 본문과 대조한다.
- webp 인코딩: Pillow `quality=82, method=6` (장당 130~210KB). 배포 이미지는 immutable 캐시라 내용이 바뀌면 파일명을 바꾼다.
- `alt`에는 그림 속 헤드라인과 숫자를 그대로 적는다 (스크린리더·검색용).

## STYLE 블록

```text
STYLE — premium Korean magazine editorial infographic card (매거진 카드뉴스), 16:9 landscape:
- Layout: left ~45% text column, right ~55% editorial illustration. Clean grid, generous margins.
- Background: warm off-white paper (#F6F1E7) with a very subtle grain.
- Typography: Korean text in a crisp, bold modern Korean sans-serif (like Pretendard / Noto Sans KR
  Black) for the headline, medium weight for labels. ALL Korean text rendered VERBATIM exactly as
  quoted — every syllable exactly as written. Render ONLY the quoted text; add no other words.
- A small kicker label above the headline in a cinnabar (#B0392E) rounded tag.
- Key numbers: very large bold numerals in deep ink navy (#1F2A44) with a short label under each,
  separated by thin rules.
- Illustration: a modern editorial illustration (textured gouache / risograph feel), limited palette —
  ink navy, cinnabar red, mustard ochre, soft teal, cream. Expressive, witty, conceptual (a visual
  metaphor for the story), no photorealism.
- No logos or real brand marks, no real people's faces, no page numbers, no watermark, no UI chrome.
```

# AI Driven 전환은 왜 어려운가 (손글씨 노트 덱)

원본 39슬라이드 HTML 덱을 노트필기 스타일 24장 이미지 덱으로 전면 재설계·대체 (2026-07-14).
"막히기 쉬운 10가지 구조"를 축으로 압축 — 오프닝 6장 + 10가지(디바이더 포함 11장) + 마무리 7장.

- `index.html` — 이미지 뷰어 셸 (←/→/Space/Home/End, `F` 전체화면, 터치 스와이프, `#N` 딥링크)
- `NN-slug.webp` — 슬라이드 24장 (1672×941, q95, 총 ~5.4MB)
- `src-png/` — 원본 PNG (git/배포 제외: `**/src-png/**`)

## 슬라이드 구성 (원본 39장 → 24장)

| # | 슬라이드 | 펀치라인 |
|---|----------|----------|
| 1 | 커버 — AI Driven 전환은 왜 어려운가 | 도구 보급을 넘어 — 업무 운영체계의 문제 |
| 2 | 질문을 바꾸면 | 반복 패턴 — 미리 보고 덜 놀라기 |
| 3 | 세 숫자 88 / 5 / 95 | 도입률은 이미 높다 — 병목은 가치 전환 |
| 4 | AI 사용 vs AI Driven | 대부분의 조직은 — 아직 왼쪽 |
| 5 | 보조도구 멈춤 경로 4단계 | 만들기는 쉽다 — 운영이 어렵다 |
| 6 | 사람의 위치 이동 5단계 (agent boss) | 난이도는 모델보다 — 위임과 검증의 습관 |
| 7 | 디바이더 — 막히기 쉬운 10가지 구조 (미니 인덱스) | 실패의 원인이 아니라 — 확률을 높이는 조건 |
| 8–17 | 10가지 구조 각 1장 (통일 템플릿: 현상+메커니즘+출처+처방 배너) | 01 Tool-first · 02 Workflow 미변경 · 03 부분 최적화 · 04 Owner 부재 · 05 쉬운 PoC 반복 · 06 Context 부재 · 07 사후 Governance · 08 검증 병목 · 09 습관 없는 교육 · 10 중앙조직 병목 |
| 18 | 수식 — 모델+도구−운영 구조 = 파일럿의 함정 | 모델의 문제가 아니라 — 운영 구조 설계의 문제 |
| 19 | 여섯 질문 (Intent·Plan·Context·Tool·Verify·Gate) | 여섯이 비어 있으면 — 똑똑한 비서에 머묾 |
| 20 | 운영의 세 장치 (맥락·경계·사다리) | 맥락은 주고 — 경계는 긋고 — 판단은 사람이 |
| 21 | 루프와 하네스 (AWS AI-DLC + Humans steer.) | 말 걸기에서 — 환경 설계로 |
| 22 | 이슈 분석 스케치 6단계 | "AI가 분석했다"가 아니라 — 분석 Workflow가 남는 것 |
| 23 | 시작할 일 다섯 질문 | 다섯이 맞는 업무 하나를 — 끝까지 |
| 24 | 요지 + Q&A + 출처 | AX는 업무 구조를 바꾸는 일 |

컷한 것: Solow 역설, 보조도구vs플랫폼(5에 흡수), 지표/Goodhart, 역할분담 상세(17·20에 흡수),
"그럼에도" 브릿지, 출처 전용 장(24 하단 한 줄).

## 이미지 생성 재현

24장 전부 codex imagegen (2026-07-14). 프롬프트 원본:
`(세션 스크래치) gen_atd.py` — note-deck 스킬 스타일 블록 + 슬라이드별 verbatim 한글 문구,
스타일 레퍼런스는 `~/.claude/skills/note-deck/assets/style-refs/` (cover/divider/cards/flow/contrast-banner).
10가지 구조(8–17)는 공용 RISK 템플릿 하나에 현상·메커니즘·출처·처방만 치환.
14는 초판 필체 이질(가는 획·필기체 숫자)로 덱 내부 13·15를 `-i` 스타일 레퍼런스 삼아 재생성.

수정 시: 원본 슬라이드를 `-i`로 주고 "Recreate EXACTLY … with ONLY these changes" (note-deck 스킬
references/prompts.md Recipe 3). 인코딩: `python ~/.claude/skills/note-deck/scripts/encode_webp.py .`
검증: `python ~/.claude/skills/note-deck/scripts/verify_deck.py . http://localhost:8934/presentations/ai-driven-transition/`

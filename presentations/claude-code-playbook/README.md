# Claude Code 실전 활용법 (하이브리드 노트 덱 · 53장)

2026-07-17 신규 제작. 개론·설명이 아니라 **실전 사용법** 중심의 강의 덱 —
기초 세팅부터 위임·검증 리듬, 하네스(스킬·훅·서브에이전트), Loop Engineering,
Codex(GPT) 크로스모델 연동, 플러그인/MCP, 세션 꿀팁까지.

**하이브리드 구성이 특징**: 개념·구조 슬라이드는 손글씨 이미지(webp 38장),
코드·커맨드 슬라이드는 HTML(15장, Gaegu 손글씨 폰트 + JetBrains Mono 터미널 카드,
1672×941 고정 캔버스를 JS로 이미지와 동일 스케일링). 모든 기능·버전 정보는
제작 당일 공식 문서(code.claude.com/docs, GitHub CHANGELOG)로 재검증
(v2.1.212, Sonnet 5 1M 기본, Loop Engineering 2026-06 명명 등).

- `index.html` — 하이브리드 뷰어 (←/→/Space/Home/End, `F` 전체화면, 터치 스와이프, `#N` 딥링크)
- `NN-slug.webp` — 이미지 슬라이드 38장 (1672×941, q95)
- `src-png/` — 원본 PNG (git/배포 제외: `**/src-png/**`)

## 소스 자료

- `personal-agent-method` — 위임·검증 프레임 (브리핑 3요소, 스코프 위임, 증거 심문)
- `ai-dev-tools-handson` #45~ — 핸즈온 아크 (첫 프롬프트, 설정 위임, 스킬 실습)
- `harness-engineering` — 하네스 6요소, backpressure, slop zone, 성숙도 사다리
- 웹 리서치 (2026-07-17): Loop Engineering (Steinberger·Osmani·Cherny·LangChain),
  codex-plugin-cc, 공식 best-practices/power-user 팁, 플러그인 생태계
- 사용자 실환경: ~/.claude/CLAUDE.md 크로스모델 운영 규칙, codex 타입드 서브에이전트 8종

## 구성 (53장 = 이미지 38 + HTML 15)

| 구간 | 페이지 | 내용 |
|------|--------|------|
| 오프닝 | 1–3 | 커버 · 게임이 바뀌었다(프롬프트→컨텍스트→하네스→루프 타임라인) · 오늘의 흐름 7구간 |
| ① 기초 세팅 | 4–10 | 디바이더 · 첫 프롬프트("구분해서 알려줘") · **[H]시작 10초 치트** · CLAUDE.md 원칙 · **[H]CLAUDE.md 배치** · 권한 대비 · **[H]권한 세팅** |
| ② 잘 시키는 법 | 11–18 | 디바이더 · 브리핑 3요소 · 스텝 말고 스코프 · 기본 리듬 4단계 · **[H]Plan Mode** · 실제로 돌려봤어? · 검증 게이트 4단 · 컨텍스트 관리 |
| ③ 하네스 | 19–26 | 디바이더 · 하네스 6요소 · Skill 개념 · **[H]SKILL.md 해부** · 룰 vs 훅 · **[H]Hook 실전** · 서브에이전트 · **[H]에이전트 .md** |
| ④ Loop Engineering | 27–34 | 디바이더 · Cherny 인용 · 루프의 해부 · 루프 4형(LangChain) · **[H]루프 실전(/goal·/loop·ralph.sh)** · 병렬 · **[H]병렬 실전(worktree·팀·ultracode)** · 헤매는 신호 |
| ⑤ Codex 연결 | 35–40 | 디바이더 · 셀프 리뷰의 함정 · **[H]공식 플러그인(/codex:*)** · **[H]CLI 직접(stdin 파이프)** · 스폰 게이팅 · 운영 3원칙(무성 폴백 금지) |
| ⑥ 플러그인 | 41–46 | 디바이더 · 번들 개념 · **[H]설치·개발 커맨드** · 추천 스택 6종 · **[H]MCP 커맨드** · 도구 다이어트(40개) |
| ⑦ 꿀팁 | 47–53 | 디바이더 · **[H]세션 꿀팁** · **[H]번들 명령 치트시트** · 푸시백 프롬프트 3종 · 성숙도 사다리 · 오늘 시작할 한 가지 · 클로징(Q&A) |

**[H]** = HTML 코드 슬라이드 (index.html 안에 인라인, webp 없음).
이미지 파일 번호는 뷰어 순번과 일치(HTML 슬라이드 번호는 건너뜀): 06·08·10·15·22·24·26·31·33·37·38·43·45·48·49가 HTML.

## 이미지 생성 재현

### 2026-07-17 1차 — 신규 38장

- note-deck 스킬 파이프라인: `make_spec.py`(세션 스크래치) → deck-spec.json →
  `python ~/.claude/skills/note-deck/scripts/gen_deck.py deck-spec.json --parallel 3`
- 드라이버 gpt-5.6-sol + `model_reasoning_effort="low"`, 내장 image_gen (1672×941 네이티브)
- 스타일 레퍼런스: 스킬 기본 `assets/style-refs/` 레이아웃별 1장
- 전량 Read 육안 검수 (verbatim·필체·레이아웃)

수정 시: 원본 슬라이드를 `-i`로 주고 "Recreate EXACTLY … with ONLY these changes"
(note-deck 스킬 references/prompts.md Recipe 3).
인코딩: `python ~/.claude/skills/note-deck/scripts/encode_webp.py .`
검증: `python ~/.claude/skills/note-deck/scripts/verify_deck.py . <base_url>`
(HTML 슬라이드가 있어 index.html 참조 수 ≠ webp 수인 것은 의도된 구성)

### HTML 슬라이드 수정

index.html 안의 `<div class="slide code">` 블록을 직접 편집. 캔버스는 1672×941 고정,
컴포넌트: `.ttl`(제목+파란 이중 밑줄) · `.term`(터미널 카드) · `.panel`(종이 카드) ·
`.chip`(커맨드+설명 행) · `.note`(빨간 주석) · `.punch`(펀치라인 배너).
폰트: Gaegu(손글씨) + JetBrains Mono(코드) — Google Fonts CDN.

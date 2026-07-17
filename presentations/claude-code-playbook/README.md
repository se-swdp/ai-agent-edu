# Claude Code 실전 활용법 (하이브리드 노트 덱 · 56장)

2026-07-17 신규 제작, **2026-07-18 실전주의 리워크**. 개론·설명이 아니라 **실전 사용법**
중심의 강의 덱 — 기초 세팅부터 위임·검증 리듬, 하네스(스킬·훅·서브에이전트),
Loop Engineering, 교차 검증(세컨드 오피니언 — 선택으로 크로스모델), 플러그인/MCP,
세션 꿀팁까지.

**하이브리드 구성이 특징**: 개념·구조 슬라이드는 손글씨 이미지(webp 41장),
코드·커맨드 슬라이드는 HTML(15장, Gaegu 손글씨 폰트 + JetBrains Mono 터미널 카드,
1672×941 고정 캔버스를 JS로 이미지와 동일 스케일링). 모든 기능·버전 정보는
공식 문서(code.claude.com/docs)로 재검증 (bypassPermissions defaultMode ·
--dangerously-skip-permissions · auto 모드 · description 자동 발동, 2026-07-18).

- `index.html` — 하이브리드 뷰어 (←/→/Space/Home/End, `F` 전체화면, 터치 스와이프, `#N` 딥링크)
- `NN-slug.webp` — 이미지 슬라이드 41장 (1672×941, q95)
- `src-png/` — 원본 PNG (git/배포 제외: `**/src-png/**`)
- ⚠️ 파일명 숫자는 **최초 53장 시절 뷰어 순번의 흔적** — 07-18 리워크(컷 2 ·
  삽입 5)의 삽입분은 `10b`/`20b`/`46b`/`46c`/`50b` 접미로 정렬만 맞춘다.
  실제 순서의 정본은 index.html의 div 순서.

## 2026-07-18 리워크 (실전주의 재기획)

사용자 관점 반영: ⑴ 권한은 승인 구조가 아니라 **bypass가 현실** — 안전은 git·격리로
⑵ 수동 명령(--worktree 등) 대신 **알아서 불려가게** 설계 ⑶ 혼자 vs 협업 구분
⑷ CLAUDE.md 3계층(개인 전역/팀 공유/레포 로컬) 설계 관점 ⑸ 남의 하네스 유지보수
문제 → 궁극적으로 전체 하네스 소유 ⑹ 좋은 서드파티는 순정이 흡수 — 순정에서 시작해
확장 ⑺ 원리 공부는 오픈소스 에이전트(OpenClaw·OpenHarness·codex CLI)를 Claude Code로 해부.

- **컷 2**: 28-loop-quote(Cherny 인용), 30-four-loops(루프 4형 분류)
- **이미지 재생성 5**: 09(권한—현실은 bypass), 29(감독 캡션 추가), 32(격리는 자동),
  41(빌려서 배우고—내 것으로), 51(사다리=순정→내 하네스)
- **이미지 신규 5**: 10b(혼자vs같이), 20b(불려가게), 46b(남의 하네스), 46c(순정 흡수),
  50b(원리 공부)
- **HTML 수정 4**: 08(CLAUDE.md 세 계층), 10(권한 풀스피드+안전벨트),
  22(description 자동 트리거), 33(병렬—말로 시킨다)

## 구성 (56장 = 이미지 41 + HTML 15)

| 구간 | 뷰어 페이지 | 내용 |
|------|--------|------|
| 오프닝 | 1–3 | 커버 · 게임이 바뀌었다 · 오늘의 흐름 7구간 |
| ① 기초 세팅 | 4–11 | 디바이더 · 첫 프롬프트 · **[H]10초 치트** · CLAUDE.md 원칙 · **[H]CLAUDE.md 세 계층** · 권한—현실은 bypass · **[H]권한 세팅(풀스피드+벨트)** · 혼자일 때—같이일 때 |
| ② 잘 시키는 법 | 12–19 | 디바이더 · 브리핑 3요소 · 스코프 · 리듬 4단계 · **[H]Plan Mode** · 돌려봤어? · 게이트 4단 · 컨텍스트 |
| ③ 하네스 | 20–28 | 디바이더 · 6요소 · 외우게 하지 말고—불려가게 · Skill · **[H]SKILL.md(자동 트리거)** · 룰vs훅 · **[H]Hook** · 서브에이전트 · **[H]에이전트 .md** |
| ④ Loop Engineering | 29–34 | 디바이더 · 루프의 해부(+감독 캡션) · **[H]루프 실전** · 병렬(격리는 자동) · **[H]병렬 실전(말로 시킨다)** · 헤매는 신호 |
| ⑤ 교차 검증 | 35–40 | 디바이더("다른 눈이 봐야 — 다른 게 보인다") · 셀프 리뷰의 함정(다른 눈 = 새 세션·에이전트·다른 모델) · **[H]세컨드 오피니언 실전**(/code-review·적대 서브에이전트·새 세션) · **[H]다른 모델의 눈 — 선택**(codex-plugin-cc) · 스폰 게이팅 · 교차 검증 3원칙(무성 폴백 금지) |
| ⑥ 플러그인 | 41–48 | 디바이더(빌려서 배우고—내 것으로) · 번들 · **[H]설치·개발** · 추천 스택 · **[H]MCP** · 도구 다이어트 · 남의 하네스는 빌린 것 · 순정이 흡수한다 |
| ⑦ 꿀팁 | 49–56 | 디바이더 · **[H]세션 꿀팁** · **[H]치트시트** · 푸시백 3종 · 원리 공부(오픈소스 해부) · 성숙도 사다리(한 겹씩 내 손으로) · 오늘 한 가지 · 클로징 |

**[H]** = HTML 코드 슬라이드 (index.html 안에 인라인, webp 없음).

## 이미지 생성 재현

- note-deck 스킬 파이프라인 (`~/.claude/skills/note-deck`), codex exec 내장
  image_gen (1672×941 네이티브), 스타일 레퍼런스는 이 덱 자신의 슬라이드를 `-i`로.
- 수정 시: 원본 슬라이드를 `-i`로 주고 "Recreate EXACTLY … with ONLY these changes"
  (note-deck 스킬 references/prompts.md Recipe 3).
- 인코딩: `python ~/.claude/skills/note-deck/scripts/encode_webp.py .` (q95)
- 검증: `python ~/.claude/skills/note-deck/scripts/verify_deck.py . <base_url>`
  (HTML 슬라이드가 있어 index.html 참조 수 ≠ webp 수인 것은 의도된 구성)

### 2026-07-17 3차 — ⑤ 구간 범용화 (교차 검증 프레임)

사용자 피드백: "Codex 연결/두 번째 엔진은 AI를 두 개 쓴다는 전제라 범용적이지 않다."
⑤ 구간을 **교차 검증(세컨드 오피니언)** 프레임으로 재편 — 다른 눈 = 새 세션·적대
서브에이전트·(선택) 다른 모델. Codex는 구간 주제에서 '선택지 하나'로 강등.

- 이미지 4장 Recipe 3 재생성: 03(⑤ 라벨 "Codex 연결"→"교차 검증") ·
  35(제목 "두 번째 엔진"→"교차 검증", 부제 "Claude가 만들고 — GPT가 의심한다"→
  "만든 눈은 후하다 — 다른 눈으로 채점") · 36(우측 카드 "다른 엔진이"→"다른 눈이",
  첫 불릿 "새 세션 · 에이전트 · 다른 모델", 배너 "두 모델이"→"의견이") ·
  40(제목 "크로스모델 운영"→"교차 검증", 3행 "엔진 다운/대체"→"검증 불가/생략",
  배너 "크로스모델을"→"신뢰를")
- 46(도구 다이어트): 보류됐던 Tool Search 한 줄 추가 재생성 (쿼터 리셋 후)
- HTML 재작성: 37 "세컨드 오피니언 — 다른 눈 붙이는 법"(/code-review·ultra·적대
  서브에이전트·새 세션·Plan 리뷰) · 38 "더 가면 — 다른 모델의 눈 (선택)"(codex
  플러그인 + config.toml 문서 공유, CLI stdin 패턴은 제거)
- 파일명은 유지(35-divider-codex 등) — 뷰어 참조 안정성 우선.

### 2026-07-17 2차 — 전수 팩트체크 (2-agent 교차검증 + CHANGELOG 원문 대조)

claude-code-guide 에이전트(공식 문서) + 웹 리서치 에이전트(생태계) 병렬 검증 후,
UNVERIFIABLE 항목은 GitHub CHANGELOG 원문 grep으로 최종 확인. 결과:

- **확인됨(수정 불요)**: v2.1.212 · Sonnet 5 1M 기본 · /effort(low~max) · /statusline ·
  Shift+Tab 순환 · rules paths frontmatter · @import · auto 모드 · /sandbox · Plan Mode
  (Shift+Tab ×2 · /plan 프리픽스 · Ctrl+G) · SKILL.md(allowed-tools · disable-model-invocation ·
  !`cmd` 선실행 · $ARGUMENTS · 6개 스태킹) · Hook(exit 2 · prompt/agent 타입) ·
  isolation: worktree · memory frontmatter(user/project/local) · /goal · /loop · /schedule ·
  --worktree --tmux · /batch · ultracode·/workflows(16 동시·1,000 상한) · codex-plugin-cc
  (마켓·커맨드 전부) · project_doc_fallback_filenames · ralph(Huntley) · Cherny 인용
  ("I don't prompt Claude anymore… my job is to write loops") · Loop Engineering 명명
  (Osmani 에세이 → Steinberger 슬로건 → LangChain 4루프) · MCP 2분 자동 백그라운드
  (CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS) · Esc Esc rewind · /fork · /btw · /cd · --bare ·
  --teleport · PR URL 세션 검색 · /usage · bash 삭제 복구 불가
- **수정 3건**:
  1. [H]#06 npm 설치 → deprecated(공식 변경 로그) — 네이티브 인스톨러(irm/curl)로 교체
  2. [H]#26 `background: true` frontmatter → 근거 없음(서브에이전트는 기본 백그라운드로 변경됨) — 주석으로 대체
  3. [H]#45 Tool Search 칩 추가(도구 정의 10% 초과 시 자동 미뤄 로드 — 기본 on) —
     #46 "40" 상한은 tool search 꺼진 기준이라 뉘앙스 보강 필요
- **보류 1건**: #46 이미지에 "지금은 Tool Search 기본 — 안 쓰는 정의는 미뤄 로드" 한 줄 추가
  — 쿼터 소진으로 보류했다가 같은 날 리셋 후 3차에서 재생성 완료.

### HTML 슬라이드 수정

index.html 안의 `<div class="slide code">` 블록을 직접 편집. 캔버스는 1672×941 고정,
컴포넌트: `.ttl`(제목+파란 이중 밑줄) · `.term`(터미널 카드) · `.panel`(종이 카드) ·
`.chip`(커맨드+설명 행) · `.note`(빨간 주석) · `.punch`(펀치라인 배너).
폰트: Gaegu(손글씨) + JetBrains Mono(코드) — Google Fonts CDN.

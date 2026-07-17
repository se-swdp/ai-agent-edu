# We are 1% done — AI 구루들의 2026 여름 필기노트 (손글씨 노트 덱 · 21장)

2026-07-17 신규 제작. "지난 두 달, 업계 리더들의 발표·글·팟캐스트를 듣고 적은 필기노트를
공유합니다"라는 컨퍼런스 노트 액자 구조의 세미나 덱 — 개발자 + 지식노동자 혼합 청중 대상.
**모든 수치·인용은 제작 당일 16-agent 웹 검증 워크플로우로 1차 출처 재검증** (검증 내역과
슬라이드별 발표 노트는 `PLAN.md`, 초안 대비 정정 목록은 PLAN.md "정정 노트" 참조).

- `index.html` — 이미지 뷰어 셸 (←/→/Space/Home/End, `F` 전체화면, 터치 스와이프, `#N` 딥링크)
- `NN-slug.webp` — 상영 슬라이드 21장 (1672×941, q95)
- `src-png/` — 원본 PNG (git/배포 제외: `**/src-png/**`)
- `deck-spec.json` — gen_deck.py 배치 스펙 (21장 전체 프롬프트)
- `PLAN.md` — 기획서 (구성표 · verbatim 문구 · 발표 노트 · 출처 · 정정 노트)

## 구성 (21장 = 본편 17 + 디바이더 4)

| 구간 | 파일 | 내용 |
|------|------|------|
| 오프닝 | 01–03 | 커버(We are 1% done) · 훅(Karpathy "타이핑 반년째 0줄") · 등장인물 라인업 5팀 |
| ① 판이 어떻게 됐나 | 04–06 | 디바이더 · 스탯(57.3% 프로덕션 / 131일 배가 주기 / Codex 1/5 비개발자) · 5년 진화 flow |
| ② 빌더들의 노트 | 07–11 | 디바이더 · Cherny "100 lines" 배너 · Bitter Lesson · **09b IDE에 대한 노트** · Karpathy Loop · Loop Engineering |
| ③ 반대편 노트 | 12–16 | 디바이더 · Mario "while loop" 배너 · Ronacher 반론 · Willison 경보→현실(보안 사건 3건) · Hassabis |
| ④ 그래서, 우리의 일은 | 17–19 | 디바이더 · 일자리 종말론 정정(contrast) · 이해 병목(Litt·Shihipar 퀴즈 게이트) |
| 클로징 | 20 | "We are 1% done." + Q&A |

09b는 v1.1 무번호 정책의 문자 접미사 삽입 — 뷰어 카운터와 실제 장수가 어긋나지 않도록
슬라이드 안에 페이지 번호를 넣지 않는 원칙 유지.

## 이미지 생성 재현

### 2026-07-17 1차 — 신규 21장

- 생성: note-deck 스킬 `gen_deck.py` 배치 (codex exec, 드라이버 **gpt-5.6-sol** +
  `model_reasoning_effort="low"`, 내장 image_gen). 스타일 레퍼런스는 레이아웃별
  `~/.claude/skills/note-deck/assets/style-refs/` 자동 첨부.
- 01–17: 다른 세션에서 착수한 배치가 생성 (13:18–13:28). 러너 중단으로 18–20 실패
  → 본 세션에서 `--only 18,19,20`으로 재생성, 3/3 성공.
- 09b(IDE에 대한 노트): 체르니 IDE 발언 웹 검증 후 추가 생성. **"IDE는 사라진다" 직접
  인용은 존재하지 않아** 사실 4개(본래 역할 / 에이전트는 화면 불필요 / 2025.11 본인 IDE
  삭제 / 2026.6 Windsurf→Devin Desktop) 나열 구성으로 설계.
- 검수: 21장 전량 Read 육안 검수. 오탈자 1건 발견 — 09b "셸로"→"셀로" 렌더링
  → Recipe 3(원본 `-i` 첨부, "ONLY this change" 지시)로 재생성.
- 나머지 20장은 **1차 통과** (재생성 0).

수정 시: 원본 슬라이드를 `-i`로 주고 "Recreate EXACTLY … with ONLY these changes"
(note-deck 스킬 references/prompts.md Recipe 3).
인코딩: `python ~/.claude/skills/note-deck/scripts/encode_webp.py .` (q95 고정)
검증: `python ~/.claude/skills/note-deck/scripts/verify_deck.py .`
매니페스트: `node scripts/build-materials-manifest.mjs` (배포 predeploy hook이 자동 실행)

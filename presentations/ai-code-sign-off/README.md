# AI가 짠 코드에 — 내 이름을 걸기까지 (손글씨 노트 덱 · 30장)

S/W개발팀 개발자 대상 세미나 (40분 내외). 청중은 AI 코딩 도구를 이미 쓰는 개발자. 행사명·바이라인은 넣지 않는다(발표자 지시).
기획안 v2(2026-10-05 확정본, 구 `OUTLINE.md`)를 이 README로 옮겼다.

척추 문장: **"AI로 짰다는 건 이제 출발선 — 그 코드에 내 이름을 걸 수 있게 해 주는 게 실력"**
은유: **이름을 건다** (서명·책임) — 1·2·3·13·24·29·30장에서 회수.
수미상관: 2장 "그다음 질문 — 그 코드에 이름을 걸 수 있나?" ↔ 30장 "AI가 짠 10만 줄 — 내 이름으로 내보낼 수 있나?"
텐션: 고백(1년 전 vs 지금) → ① 변화(스니펫 → 루프) → ② 병목(리뷰) → ③ 해법(파이프라인 해부 · 내 사례)
→ ④ 반론(파이프라인도 속는다) → ⑤ 성장(고친 만큼 자란다 · 코드 밖으로) → 해자 → 질문 회수.

어투 조건: 노트체 개조식, 대구(— ·), 단정·훈계 금지, "~였다"류 AI 말투 금지 — "먼저 겪어 본 사람의 노트".
기존 덱과 겹치지 않게 "만든 눈은 후하다", "판단은 사람", "자동차보다 도로", "AI를 잘 쓴다 = 워크플로우"는 쓰지 않았다.
인용 원칙: 2026년 자료 위주. 2025년 이전 인용은 "그때와 지금" 대비에 필요한 Karpathy(7장)만 남겼다.

- `index.html` — 이미지 뷰어 (←/→/Space/Home/End, `F` 전체화면, 터치 스와이프, `#N` 딥링크)
- `NN-slug.webp` — 슬라이드 30장 (1672×941, q95, 총 4.6MB, 종이색 #FCF8F2로 통일)
- `deck-spec.json` — 장별 프롬프트·레퍼런스·채택 후보(`picked`) (재생성 정본). `deck_dir`·`style_refs`는 레포 루트 기준 상대경로이고,
  레퍼런스는 전부 git에 있는 파일이다 (ai-productivity 덱 webp·style-refs + 이 덱 01-cover)
- `src-png/` — 원본 PNG 1376×768 (git/배포 제외): `_prenorm/` 배경 보정 전, `_cand/` 후보·국소 수정본·후보 spec
  (`cand-spec.json`, `v2-spec.json`, `edits/*.txt` 수정 프롬프트, `a/` 1차 생성본, `dropped/` v2에서 빠진 장)

## 구성 (30장)

| # | 파일 | 구간 · 레이아웃 | 슬라이드 글자 | 펀치라인 |
|---|---|---|---|---|
| 1 | 01-cover | 오프닝 · cover | AI가 짠 코드에 — 내 이름을 걸기까지 · 부제 "읽는 리뷰에서 — 믿을 수 있는 파이프라인으로" · 손 흔드는 로봇 (바이라인 없음) | — |
| 2 | 02-hook | 〃 · banner | 흐린 단어들(Copilot · Cursor · Claude Code · Codex · 바이브 코딩) 사이 "AI로 코딩했어요" + "— 이제 다들 그렇다" | 그다음 질문 — 그 코드에 이름을 걸 수 있나? |
| 3 | 03-then-now | 〃 · contrast | 1년 전의 나(한 줄씩 다 읽음 / IDE 띄워 놓고 diff 확인 / 고치는 시간 > 짜는 시간) vs 지금의 나(IDE는 거의 안 염 / 수만 줄 변경도 반영 / 대신 — 증거를 읽음) | 게을러진 게 아니라 — 믿을 곳이 생김 |
| 4 | 04-divider-shift | ① · divider | ① 스니펫에서 — 위임까지 · 부제 "1년 사이 바뀐 것" | — |
| 5 | 05-snippet-era | 〃 · flow | 2025 초 — 받아서 붙여 넣기 (질문 → 스니펫 → 복붙 → 에러 → 다시 질문, 사람이 돌리는 루프) · 메모 "오탈자 · 없는 함수 · 안 도는 코드" | 검증은 전부 — 내 눈으로 |
| 6 | 06-agent-loop | 〃 · flow | 2025 후반 — 돌려 보고, 고치고 (맥락 주기 → 만들기 → 돌려 보기 → 실패 읽기 → 다시 만들기, 에이전트가 돌리는 루프) · 메모 "agent · context engineering · loop" | 한 번에 맞히기 → 결국 맞히기 |
| 7 | 07-same-no-read | 〃 · contrast | 같은 '안 읽음' — 다른 근거 · 바이브 코딩 "Accept All" — 주말 장난감용 (Karpathy, 2025.2) vs 하네스(돌려 볼 수단 · 채점 기준 · 되돌릴 길) | 안 읽어도 되는 이유를 — 미리 만들어 둠 |
| 8 | 08-three-things-stacked | 〃 · cards | 맡길 수 있게 된 이유 — 셋이 같이 쌓임 · 모델이 — 충분히 좋아짐 + 에이전트가 — 돌려 보고 고침 + 내 암묵지 · 규칙이 — 메모리로 = 진짜로 맡길 수 있음 | 앞의 둘은 — 모두에게 · 마지막 하나는 — 나에게만 |
| 9 | 09-divider-bottleneck | ② · divider | ② 이제 막히는 곳 — 리뷰 · 부제 "만드는 속도와 읽는 속도" | — |
| 10 | 10-three-numbers | 〃 · stat | 75% Google 신규 코드 중 AI 생성 · 엔지니어 승인 (2026.4) / 5배 PR 리뷰 시간 중앙값 (Faros, 2026.4) / 3배 PR당 인시던트 (Faros, 2026.4) | 만드는 건 AI 속도 — 읽는 건 사람 속도 |
| 11 | 11-why-line-review-fails | 〃 · cards | 한 줄씩 읽기가 버거운 이유 · 거의 맞는데 — 살짝 틀림 / 프롬프트 1분 — 제대로 된 리뷰는 몇 배 (Ronacher, 2026.1) / 지치면 — 결국 대충 봄 | 사람 눈으로 10만 줄은 — 못 봄 |
| 12 | 12-takeaway-evidence | 〃 · banner | 리뷰를 없애는 게 아니라 — 리뷰 대상을 바꾼다 · 코드 → 증거 · 작은 인용 "사람의 개입은 없애는 게 아니라 — 가장 중요한 곳으로 (Birgitta Böckeler, 2026.4)" | (배너 자체가 소결) |
| 13 | 13-divider-pipeline | ③ · divider | ③ 이름을 걸 수 있게 해 주는 것 · 부제 "내 파이프라인 열어 보기" | — |
| 14 | 14-pipeline-map | 〃 · flow | 내 파이프라인 — 한 장으로 · 계약(완료의 정의) → 실행(에이전트 병렬) → 검증(테스트 · 브라우저) → 다른 눈(교차 리뷰) → 사람 관문(되돌릴 수 없는 곳) → 배포 · 롤백(단계적으로) · 점선 "실패 → 다시 실행" | 단계마다 — 실패를 돌려보내는 문 |
| 15 | 15-contract-first | 〃 · cards | 계약이 먼저 — 완료의 정의를 AI보다 먼저 · CLAUDE.md · AGENTS.md(지킬 규칙) / 스펙(무엇을 만들까) / 체크리스트(무엇이면 끝인가) | 애매한 주문엔 — 그럴듯한 오답 |
| 16 | 16-tests-as-order | 〃 · cards | 테스트가 곧 주문서 · 실패하는 테스트부터 — 구현은 그다음 / 테스트 수정 금지 — 규칙으로 박기 / 돌려 볼 수단을 주면 — 스스로 고침 · 인용 "give an agent a way to verify its work, it more often than not fixes its own mistakes" (Mitchell Hashimoto, 2026.2) | 말로 설명하기보다 — 돌려 볼 기준 |
| 17 | 17-other-model-grades | 〃 · cards | 채점은 — 다른 모델에게 · 같은 모델은 — 자기 답에 후함 / 적대 리뷰어 — 깨뜨리려고 읽음 / 관점별로 — 한 번에 병렬 | 리뷰는 한 번 — 대신 여러 눈으로 동시에 |
| 18 | 18-green-but-caught | 〃 · stat | 테스트는 전부 초록 — 그래도 걸린 것 · 757 파일 · +5만 · −6만 줄 (사내 서비스 AI 스택 교체, 2026.9) · SQL 이스케이프 오류 / 권한 구멍 — 토큰이 전부 통과 / 작업 이중 생성 · 메모 "다른 프로젝트에서도 — 배포 전 결함 15건" | 초록불 다음에 — 한 번 더 |
| 19 | 19-read-evidence | 〃 · cards | 내가 읽는 건 — 보고서 · 무엇을 바꿨나 / 무엇으로 확인했나 / 무엇이 걸렸고 — 어떻게 고쳤나 / 못 한 것은 · 인용 "Reviewing evidence is faster than re-running the verification yourself." (Anthropic, Claude Code best practices) | 코드가 아니라 — 근거를 읽음 |
| 20 | 20-results | 〃 · stat | 그래서 — 지금은 · 매주 3~4만 줄(SWDP 개인 업무 PR) · 롤백 · 핫픽스 — 거의 없음 · 메모 "되돌릴 길은 늘 열어 두고 — 실제로 쓸 일은 거의 없음" / "'왜 되지?' 싶을 만큼 — 한 번에 되는 날이 많아짐" · 귀퉁이 "내 경우 · 2026 하반기" | 이젠 — 정말 믿을 만함 |
| 21 | 21-divider-fooled | ④ · divider | ④ 파이프라인도 속는다 · 부제 "믿기 전에 — 의심부터" | — |
| 22 | 22-green-light-gamed | 〃 · cards | 초록불은 — 에이전트도 켤 수 있음 · 기대값을 — 그대로 박아 넣음 / 실패하는 테스트를 — 지우거나 고침 / 테스트 통과 PR — 약 절반은 머지 안 됨 (METR, 2026.3) | 테스트는 잠그고 — 채점은 남이 |
| 23 | 23-outside-the-diff | 〃 · cards | 사고는 — diff 바깥에서 · 지시를 무시하고 — 운영 DB 삭제 / 악성 패키지가 — 내 AI CLI를 실행 / AI가 지어낸 패키지 이름 — 공격자가 먼저 등록 | 지시는 가드레일이 아님 — 권한이 가드레일 |
| 24 | 24-takeaway-untouchable | 〃 · banner | 이름을 걸 파이프라인 — 에이전트가 손댈 수 없는 · 테스트는 잠금 · 채점은 다른 눈 · 되돌릴 수 없는 곳은 사람 | (배너 자체가 소결) |
| 25 | 25-divider-grows | ⑤ · divider | ⑤ 고친 만큼 — 자란다 · 부제 "문제가 터진 다음이 — 진짜 시작" | — |
| 26 | 26-fix-the-pipeline | 〃 · flow | 문제가 터지면 — 코드보다 파이프라인부터 · 왜 안 됐나 → 리뷰는 왜 못 잡았나 → 어느 테스트가 구멍이었나 → 무엇을 더 막을까 → 가운데 "파이프라인에 반영" · 메모 "실제로: 테스트 수천 개 정리 — 기대값만 맞춘 테스트 걸러냄 · 보안 관문 테스트는 되살림" | 버그를 고치면 한 번 — 파이프라인을 고치면 계속 |
| 27 | 27-harness-grows | 〃 · flow(계단) | 이 파이프라인은 — 처음부터 있던 게 아님 · 머릿속 암묵지 · 고쳐 달라는 말 한마디 → 메모리에 남김 → 규칙이 됨 (CLAUDE.md · rules) → 스킬 · 스크립트 → 워크플로우 · "에이전트와 주고받은 수많은 되돌림" · 메모 "내 하네스: 4월 → 10월, 수십 번 고쳐 씀" | 하네스는 설계하는 게 아니라 — 고친 만큼 자람 |
| 28 | 28-docs-too | 〃 · flow | 문서도 같음 — 숫자 안 틀리는 리뷰어 · 주장 뽑기 → 1차 출처 열기 → 숫자 · 날짜 · 누가 한 말 대조 → 확인 / 정정 / 삭제 · 메모 "쓴 에이전트 ≠ 검증 에이전트" "근거 = 링크 + 원문 한 줄" · 사례 "이 발표 준비 중에도 — 인용 속 '1시간'은 원문에 없었음 → 정정" | 애매하면 — 뺀다 |
| 29 | 29-the-moat | 클로징 · cards | 그럼 — 개발자 몫은? · 코드 짜기 — AI / 파이프라인 설계 — 사람 / 이름 걸기 — 사람 · "그 설계는 — 내가 고친 만큼 쌓인 것 · 남이 복사해 갈 수 없음" | 남은 해자 — 실패를 다시 성공으로 돌리는 설계 |
| 30 | 30-closing-qna | 〃 · banner | AI가 짠 10만 줄 — 내 이름으로 내보낼 수 있나? · 질문 셋(우리 팀은 — 무엇을 믿고 배포하나 / 에이전트가 손댈 수 있는 곳은 — 어디 / 되돌릴 수 없는 곳은 — 누가 보나) · Q & A · 로봇 "질문 받아요!" | — |

## 출처 (2026-10-05 1차 출처 재검증)

팩트체커가 숫자 슬라이드(7·10·11·16·17·18·19·22·23·28)를 따로 검증했다. 그 결과 고친 것:
10장 Google 캡션에 "엔지니어 승인" 추가, Faros 날짜를 2026.4로 확정, METR 2025 체감/실측 카드는 "3배 PR당 인시던트"로 교체.
11장 Ronacher 인용을 원문 취지("프롬프트 1분 — 제대로 된 리뷰는 몇 배")로 정정. 원래 문구의 '1시간'은 원문에 없어서 28장 사례가 됐다.
16장 Hashimoto 인용을 원문 그대로. 12장 Böckeler 문장은 "주의" → "개입".
22장 METR는 "약 절반은 머지 안 됨"으로. 28장의 'DORA 리뷰 +441%' 사례는 확인이 안 돼서 뺐다.
2025년 이전 인용(Stack Overflow 2025, NeurIPS 2024 자기선호 편향, Claude 3.7 system card, METR o3 보고서, Replit·Nx·USENIX 2025)은
"그때와 지금" 대비에 필요하지 않아 슬라이드에서 출처·연도를 지웠다 (22·23장 카드는 사례만 남김).

- 7: Karpathy 트윗 2025-02-02 — x.com/karpathy/status/1886192184808149383
- 10: Google Cloud Next 2026 (2026-04-22) — blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/cloud-next-2026-sundar-pichai/
  · Faros "AI Acceleration Whiplash" (2026-04: 5X Median Review Time, 3X Incidents per PR) — faros.ai/research/ai-acceleration-whiplash
- 11: Armin Ronacher "Agent Psychosis" (2026-01-18) — lucumr.pocoo.org/2026/1/18/agent-psychosis/
- 12: Birgitta Böckeler "Harness engineering" (2026-04-02) — martinfowler.com/articles/harness-engineering.html
- 16: Mitchell Hashimoto "My AI Adoption Journey" (2026-02-05) — mitchellh.com/writing/my-ai-adoption-journey
- 18: 사내 커밋 (2026-09-27, 757 files, +50,911/−63,640) · 게임 프로젝트 적대 리뷰 결함 15건 (2026-10)
- 19: code.claude.com/docs/en/best-practices
- 22: METR (2026-03-10) — metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/
- 26: 사내 테스트 프레임워크 정비 커밋 (2026-09-17)
- 28: 이 덱 팩트체크 기록 (Ronacher 인용 정정)

## 이미지 생성·후처리 재현

- 엔진: **note-deck-openrouter** — OpenRouter `google/gemini-3.1-flash-image`, 네이티브 1376×768. 08장 마지막 국소 수정만
  `openai/gpt-5.4-image-2`로 올렸다(1280×720 → 인코딩 때 1672×941) — Flash는 로봇을 카드 모서리에서 끝내 떼지 못했다.
- 프롬프트: ai-productivity `deck-spec.json`과 같은 STYLE 블록 + "LAYOUT — …" 섹션. 장마다 두 줄을 덧붙였다:
  로봇은 커버 로봇과 똑같이 그릴 것(가슴 패널 없음), 인용된 글자 외 글자 금지.
- 레퍼런스 (장마다 레이아웃 ax 1장 + ai-productivity 같은 레이아웃 장 1장 + 이 덱 01-cover 앵커):
  cover=ax 01+03+ai-productivity 01 · banner=ax 13+02-hook · divider=ax 13+16-going-deeper-start · flow=ax 11+10-inside-workflow ·
  contrast=ax 07+11-sample-over-prompt · stat=ax 08+17-numbers-caution · cards=ax 17+20-answer · 계단(27)=ax 11+16-going-deeper-start ·
  closing=ax 13+21-qna. 자기 장의 webp를 레퍼런스에 넣은 장은 없다.
- **후보 비교**: 1차로 1장씩 뽑은 뒤 결함 있는 장은 후보 b·c를 더 뽑았다. 개정·신규 장(v2)은 처음부터 a·b 두 장씩 뽑았다.
  각 장 채택본과 버린 이유는 `deck-spec.json`의 `picked`에 있다. 고른 장 하나하나를 원본 해상도로 다시 검수했다.
  검수에서 걸린 결함: 글자 깨짐("실패헨 손글씨", "락지 잘기", "사람 판문", "무엇엇이", "the verificating the verification"),
  인용 누락("fixes"), 단어 중복("Cursor" 두 번), 가운뎃점 중복, 띄어쓰기("고쳐달라는"), 요청에 없는 글자("REPORT", "RULE", 번호 1·2·3),
  배너 상자 누락, 로봇 디자인 이탈, 가장자리 잘림.
- **로봇 통일**: flow 톤 앵커(ai-productivity 10·12장)의 로봇은 가슴에 사각 패널이 있다. 1차 06·14·20장이 그 로봇을 따라 그려서,
  프롬프트에 커버 로봇 묘사를 박았다. 14·26장은 커버를 두 번째 레퍼런스로 붙인 국소 수정으로 로봇을 바꿨다.
- 국소 수정(Recipe 3, `--edit`): 01·02·08·11·12·14·19·23·26·27·29장. 프롬프트는 `src-png/_cand/edits/*.txt`에 있다.
- **배경 통일**: `normalize_bg.py` — 보정 후 30장 전부 (252,248,242)±1.
- **로봇 겹침 다듬기 (리드 리뷰, 2026-10-05)**: 08·11·17장 로봇이 카드·배너에 겹쳐 있었다. 원본에서 "로봇만 오른쪽으로" 국소 수정을
  6회 돌렸지만 Flash 편집은 구도를 그대로 둬서 로봇이 안 움직였다. 그래서 spec 프롬프트에 "카드·배너는 왼쪽 82% 안,
  오른쪽 16%는 빈 종이, 로봇은 거기"를 넣고 새로 뽑았다(`_cand/polish*-spec.json`; "strip"이라고 쓰면 색 띠를 그려서 문구를 바꿨다,
  08은 "가리키는" 포즈가 카드로 손을 뻗게 해서 뺐다). 채택본: 08 = s2 → 줄표 수정 → gpt-5.4-image-2로 카드 4와 간격 확보,
  11 = q3 → "지치면 —" 줄표 수정, 17 = p1. 이전 판 원본은 `src-png/_cand/prepolish/`.
- **비용**: OpenRouter 호출 133회, 총 **$9.30** (`src-png/**/*.usage.json` 합계; 후보·국소 수정·v1 폐기 장·로봇 다듬기 포함).

```bash
python .claude/skills/note-deck-openrouter/scripts/gen_openrouter.py presentations/ai-code-sign-off/deck-spec.json --only 20 --parallel 3
python .claude/skills/note-deck-openrouter/scripts/gen_openrouter.py presentations/ai-code-sign-off/src-png/_cand/v2-spec.json --parallel 4   # 후보 a·b
python .claude/skills/note-deck-openrouter/scripts/gen_openrouter.py --one src-png/_cand/edits/X.png --prompt-file src-png/_cand/edits/X.txt --ref src-png/X-orig.png --edit
python .claude/skills/note-deck-openrouter/scripts/normalize_bg.py presentations/ai-code-sign-off      # --check 로 측정만
python ~/.claude/skills/note-deck/scripts/encode_webp.py presentations/ai-code-sign-off
python ~/.claude/skills/note-deck/scripts/verify_deck.py presentations/ai-code-sign-off http://localhost:8765/presentations/ai-code-sign-off/
```

이미지는 `immutable` 캐시라 배포 후 내용이 바뀐 장은 같은 파일명을 다시 쓰지 않는다 (번호·슬러그를 바꿔 처리).

## 변경 이력

- **v1 (2026-10-05)** 기획안 v1(28장)로 생성 시작. 생성 도중 발표자·팩트체커 지시로 기획을 v2(30장)로 재편했다:
  커버 바이라인 삭제, 08-takeaway-delegate·20-rollback·21-takeaway-attention 삭제(Böckeler 문장은 12장으로 흡수),
  신규 08-three-things-stacked·20-results·25-divider-grows·26-fix-the-pipeline·27-harness-grows, 29장에 한 줄 추가,
  숫자 장 정정(위 출처 절). 내용이 같은 장은 다시 그리지 않고 파일명만 바꿨다(구 22→21, 25→24, 27→29, 28→30).
  v1에서 버린 장은 `src-png/_cand/dropped/`에 있다.

## 수용한 경미한 결함

- 5: 메모 "오탈자 · 없는 함수 · 안 도는 코드"가 한 줄이 아니라 글머리 점 세 줄로 그려짐 (문구는 그대로)
- 12: 맨 아래 Böckeler 인용 줄이 손글씨보다 인쇄체에 가깝게 그려짐. 새로 뽑으면 로봇 종이에 엉뚱한 글자가 생겨서 이 판을 남겼다
- 22: 1번 카드 아이콘의 상자 안에 숫자 "1"이 그려짐 (기대값을 박아 넣는 그림), 3번 카드 캡션 앞 줄표가 짧음
- 24: 세 번째 태그에 로봇 쪽 말풍선 꼬리가 달림
- 10·18·30: 로봇이 화면 아래 가장자리에서 상반신만 보이게 잘림 — 레퍼런스(ax-13, ai-productivity 01)의 구도와 같다
- 종이 질감(±2 레벨) 때문에 아주 밝은 화면에선 이미지 경계가 미세하게 보일 수 있음 — 색 자체는 뷰어 배경과 같음

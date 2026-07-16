# AI Agent와 일하는 법 (손글씨 노트 덱 · 52장)

2026-07-16 신규 제작. 4~7월 발표 13종을 전수 분석해 하나의 자기완결적 발표로 대통합한
범용(전직군) 덱 — 이전 발표를 본 적 없는 청중 기준. 모든 통계는 제작 당일 1차 출처
웹 재검증을 거침 (METR TH1.1 131일, Stanford AI Index 2026, MIT NANDA 2025,
HBR workslop 2025.9, Gravitee/McKinsey/Gartner 2026 등).

- `index.html` — 이미지 뷰어 셸 (←/→/Space/Home/End, `F` 전체화면, 터치 스와이프, `#N` 딥링크)
- `NN-slug.webp` — 슬라이드 52장 (1672×941, q95, 총 ~9.0MB)
- `src-png/` — 원본 PNG (git/배포 제외: `**/src-png/**`)

## 구성 (52장)

| 구간 | 페이지 | 내용 |
|------|--------|------|
| 오프닝 | 01–04 | 커버 · 질문형 vs 위임형 · 테제(도구는 시작일 뿐) · 오늘의 흐름 |
| ① 기준선 | 05–09 | 디바이더 · 도입 88%/53% · 격차 90/40/95 · METR 가속 131일 · Workslop |
| ② 개념 | 10–16 | 디바이더 · ARS vs 비서 · 에이전트 루프 · 4계층 · 성능 공식 · 토큰 다이얼 · 자동차보다 도로 |
| ③ 잘 시키기 | 17–21 | 디바이더 · 목표+경계+근거 · 상태+가설+제약 · 스코프 위임 · 맥락 더한 위임 |
| ④ 잘 확인하기 | 22–26 | 디바이더 · 완료 증거 · 첫 답은 초안 · 미끄러지는 신호 4 · 판단은 사람 |
| ⑤ 환경 | 27–32 | 디바이더 · 규칙 vs Hook · 하네스=매뉴얼 · 내 하네스 · Rule/Skill · 프로파일링 |
| ⑥ 사례 | 33–38 | 디바이더 · 포털 10명·1년→2명·4주 · 운영 루프 · 하나의 인터페이스 · 개발 업무 대입 · 문서도 코드다 |
| ⑦ 조직 | 39–45 | 디바이더 · 갈림길 · 파일럿의 함정 · 10가지 구조 · 권한 3원칙 · 자율성 사다리 · 통제 격차 |
| ⑧ 사람 | 46–49 | 디바이더 · In/On/Above the loop · 판단 속도 · 바이오 토큰 |
| 클로징 | 50–52 | 도메인×AI=곱 · 개인에서 팀으로 · 요지+Q&A |

## 이미지 생성 재현

52장 전부 codex imagegen **1차 통과** (2026-07-16, 재생성 0, 쿼터 대기 0).
프롬프트 원본: (세션 스크래치) `unified-gen/gen_unified.py` — note-deck 스킬 스타일 블록 +
슬라이드별 verbatim 한글 문구, 스타일 레퍼런스 `~/.claude/skills/note-deck/assets/style-refs/`
(cover/divider/cards/flow/contrast-banner에서 레이아웃별 1장씩). 페이지 번호 없음(v1.1 정책).

수정 시: 원본 슬라이드를 `-i`로 주고 "Recreate EXACTLY … with ONLY these changes" (note-deck 스킬
references/prompts.md Recipe 3). 인코딩: `python ~/.claude/skills/note-deck/scripts/encode_webp.py .`
검증: `python ~/.claude/skills/note-deck/scripts/verify_deck.py . http://localhost:8934/presentations/ai-agent-unified/`

# SWDP 개발·운영과 AI 에이전트 적용 방향 (손글씨 노트 덱)

원본 36슬라이드 라이트 인포그래픽 HTML 덱을 노트필기 스타일 28장 이미지 덱으로
통합·대체 (2026-07-14). 내용은 보존하고 인트로·예시·클로징을 합쳐 압축.

- `index.html` — 이미지 뷰어 셸 (←/→/Space/Home/End, `F` 전체화면, 터치 스와이프, `#N` 딥링크)
- `NN-slug.webp` — 슬라이드 28장 (1672×941, q95, 총 ~4.9MB)
- `src-png/` — 원본 PNG (git/배포 제외: `**/src-png/**`)

## 슬라이드 구성 (원본 36장 → 28장)

| 구간 | 페이지 | 통합 내용 |
|------|--------|-----------|
| 오프닝 | 01–04 | 커버 · 범위(구2+3) · AI-DLC 루프(구4) · 접근 4종 비교(구5) |
| ① SWDP 구조 | 05–09 | 디바이더 · 개발 절차+TR 주석(구7+9) · 핵심 기능 6(구8) · 적용 대상 4(구10) · 현재→지향(구11+12) |
| ② 에이전트 적용 업무 | 10–15 | 디바이더 · 여섯 단계(구14) · NPE 예시 ①감지(구15+16) ②가설(구17) ③PR(구18+19) · 닫힌 루프(구20) |
| ③ 권한과 운영 기준 | 16–22 | 디바이더 · 아키텍처(구22+23) · 운영 지식(구24) · 권한 원칙(구25 표→3카드) · 승인 피로 93/84(구26) · 검증 사다리(구27) · 사람 관리 지점(구28) |
| ④ PoC 이후 | 23–28 | 디바이더 · 자율성 사다리(구30) · 지표(구31) · 로드맵(구32) · 방법론 매핑(구33) · 클로징 명제+Q&A+출처(구34+35+36) |

권한 표(구25)는 손글씨 가독성을 위해 "읽기는 넓게 / 쓰기는 좁게 / 게이트는 사람" 3카드로
재구성, 핵심 제약("운영 DB·운영 환경 쓰기 없음")은 펀치라인으로 이동.

## 이미지 생성 재현

28장 전부 codex imagegen 1차 통과 (2026-07-14, 재생성 0). 프롬프트 원본:
`(세션 스크래치) gen_swdp.py` — note-deck 스킬 스타일 블록 + 슬라이드별 verbatim 한글 문구,
스타일 레퍼런스 `~/.claude/skills/note-deck/assets/style-refs/` (cover/divider/cards/flow/contrast-banner).

수정 시: 원본 슬라이드를 `-i`로 주고 "Recreate EXACTLY … with ONLY these changes" (note-deck 스킬
references/prompts.md Recipe 3). 인코딩: `python ~/.claude/skills/note-deck/scripts/encode_webp.py .`
검증: `python ~/.claude/skills/note-deck/scripts/verify_deck.py . http://localhost:8934/presentations/ai-dlc-swdp/`

구 라이트 인포그래픽 일러스트 6장(`presentations/assets/images/ai-dlc-swdp/`)은 대체와 함께 제거.

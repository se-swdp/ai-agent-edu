---
name: note-deck-openrouter
description: >-
  note-deck 손글씨 노트 덱을 OpenRouter 이미지 모델(기본 google/gemini-3.1-flash-image)로 생성하는 변형.
  사용자가 "note-deck-openrouter", "오픈라우터로 덱/슬라이드", "제미나이 이미지로 슬라이드"를 말하거나,
  codex image_gen이 쿼터 소진·툴 미노출로 막혔을 때 note-deck 대신 사용한다. 내용 설계·어투는 deck-authoring,
  STYLE 블록·레이아웃 레시피·스타일 레퍼런스·인코딩·뷰어는 note-deck 스킬을 그대로 쓰고, 이 스킬은
  이미지 생성 엔진(3단계)만 교체한다.
---

# Note Deck — OpenRouter 엔진

note-deck 파이프라인에서 **3. 배치 생성**만 바꾼다. 나머지(구성표 → deck-spec.json → 검수 → 인코딩 → 뷰어 →
README → 검증)는 `~/.claude/skills/note-deck/SKILL.md`를 그대로 따른다. 프롬프트는 반드시
`~/.claude/skills/note-deck/references/prompts.md`의 STYLE 블록 + 레이아웃 레시피로 쓴다.

**위치와 의존성.** 이 스킬은 ai-agent-edu 레포의 `.claude/skills/note-deck-openrouter/`에 들어 있어 레포를 받은
컴퓨터면 어디서든 쓸 수 있다. 아래 명령은 레포 루트에서 실행한다. 다만 프롬프트 레시피·기본 스타일 레퍼런스·
`encode_webp.py`·`verify_deck.py`는 **note-deck 스킬**에 있고 note-deck은 레포에 없다 — 전역
`~/.claude/skills/note-deck/`에 깔려 있어야 한다. `gen_openrouter.py`는 note-deck을 레포
`.claude/skills/note-deck/` → 전역 `~/.claude/skills/note-deck/` 순서로 찾는다.

**다른 컴퓨터에서 기존 덱을 고칠 때.** 이 레포 덱들의 `deck-spec.json`은 `style_refs`를 `E:\workspace\...` 절대경로로
적었고, 일부는 git에 안 올라가는 `src-png/`(예: `ai-easier/src-png/_v4/01-title.png` 앵커)를 가리킨다. 없는 레퍼런스는
스크립트가 건너뛰고 `WARNING: style ref(s) not found`를 찍는다 — 이 경고가 뜨면 톤이 틀어지니, 경로를 그 컴퓨터의
레포 위치로 고치고 앵커는 배포된 webp(예: `presentations/ai-easier/01-title.webp`)로 바꿔 넣는다.

## 왜 이 엔진인가

- codex image_gen은 쿼터가 떨어지면 에러 없이 툴이 사라진다(note-deck 메모 참고). OpenRouter는 크레딧만 있으면 바로 된다.
- **스타일 레퍼런스가 진짜 이미지 입력으로 들어간다.** 웹 채팅에 손으로 붙여 넣을 때 생기던 로봇·색 불일치가
  여기서는 생기지 않는다. 통일성의 핵심은 매 장 같은 레퍼런스를 붙이는 것이다.

## 키

- 환경변수 `OPENROUTER_API_KEY` (Windows 사용자 환경변수로 저장됨). 키를 설정하기 전에 시작된 셸이라
  환경변수가 안 보이면 스크립트가 레지스트리(HKCU\Environment)에서 직접 읽는다.
- 새 컴퓨터에서는 키를 사용자 환경변수로 한 번 등록하고 셸을 새로 연다:
  `setx OPENROUTER_API_KEY "<키>"` (Windows) / `export OPENROUTER_API_KEY=...`를 셸 rc에 (macOS·Linux).
  레지스트리 읽기는 Windows 전용 보조 경로다.
- **키를 파일에 쓰지 않는다.** 이 레포는 GitHub에 올라가고, 원래 컴퓨터는 홈(`C:\Users\hik90`)도 GitHub 원격이
  붙은 git 레포라 홈·레포 아래 어떤 파일에 써도 유출 위험이 있다.

## 실행

```bash
# 덱 전체 (note-deck와 같은 deck-spec.json)
python .claude/skills/note-deck-openrouter/scripts/gen_openrouter.py deck-spec.json --parallel 2

# 일부만
python .claude/skills/note-deck-openrouter/scripts/gen_openrouter.py deck-spec.json --only 01,14,29b

# 한 장만 (스모크 테스트, Recipe 3 수정)
python .claude/skills/note-deck-openrouter/scripts/gen_openrouter.py \
  --one <deck>/src-png/03-divider.png --prompt-file prompt.txt \
  --ref ~/.claude/skills/note-deck/assets/style-refs/divider.png --ref <deck>/src-png/01-cover.png
```

- 결과: `<deck_dir>/src-png/<file>.png`, 로그·프롬프트·사용량(`*.usage.json`, 비용 포함)은 `src-png/logs/`.
- 레퍼런스 기본값은 note-deck과 같은 레이아웃별 style-ref 1장. **통일성을 올리려면** spec의 `style_refs`에
  레이아웃 레퍼런스 + 이 덱에서 잘 나온 앵커 장(보통 01 커버)을 같이 넣는다 (note-deck Recipe 2와 같은 원리).
- 모델 교체: `--model <openrouter-model-id>` 또는 spec의 `"model"`.
- 429면 60초 쉬고 재시도, 401/402/403(키·크레딧)은 바로 중단.

## 수정 (Recipe 3)

원본 PNG를 `--ref`로 주고 note-deck Recipe 3 프롬프트("The attached image is the ORIGINAL slide. Recreate it
EXACTLY … with ONLY these changes")를 `--prompt-file`로 넘긴다. 레퍼런스가 있으면 스크립트가 "STYLE
REFERENCES only" 지시를 앞에 붙이므로, Recipe 3일 때는 프롬프트 안에서 "ORIGINAL slide"임을 분명히 적는다.

## 실측 (2026-10-02, google/gemini-3.1-flash-image)

- 한 장 약 11초, 출력 **1376×768** (`image_config.aspect_ratio = 16:9`), 이미지 토큰 1,120개, **약 $0.069/장**.
  22장 덱이면 2달러 안팎, 재생성 포함해도 3~4달러 수준.
- 한글 문구 verbatim 정확(디바이더 테스트에서 오탈자 0). 로봇 안테나 끝 빨간 점이 빠지는 경향 — 필요하면 프롬프트에 강조.

## 배경색 통일 (인코딩 전에 꼭)

Gemini는 부를 때마다 종이색을 조금씩 다르게 칠한다(누런 장, 회색 장, 장 안의 비네팅). 인코딩 전에
`normalize_bg.py`로 모든 장의 종이를 뷰어 배경색 #FCF8F2로 맞춘다. 종이색을 부드러운 필드로 추정해 나누는
방식이라 잉크·형광펜의 상대 톤은 유지된다. 원본은 `src-png/_prenorm/`에 남고, 재실행해도 원본에서 다시 시작한다.

```bash
python .claude/skills/note-deck-openrouter/scripts/normalize_bg.py <deck_dir> --check   # 측정만
python .claude/skills/note-deck-openrouter/scripts/normalize_bg.py <deck_dir>           # 보정
```

실측(ai-easier, 18장): 보정 전 장별 종이색 (249,242,228)~(255,255,245), 보정 후 전부 (252,248,242)±1.

## 국소 수정은 `--edit`

`--one ... --ref 원본.png --edit` — 레퍼런스용 "새 구도" 지시를 붙이지 않고 Recipe 3 프롬프트를 그대로 보낸다.

## 인코딩·검증

배포 이미지에 `immutable` 캐시가 걸린 사이트(ai-agent-edu)는 내용이 바뀐 장의 **파일명을 바꿔야** 한다.

note-deck 스크립트를 그대로 쓴다. `encode_webp.py`가 1376×768을 1672×941로 LANCZOS 업스케일하므로 기존 덱·
`verify_deck.py`와 치수가 맞는다. (네이티브 1376×768을 유지하고 싶으면 ax-why-hard처럼 크기 상수만 바꾼 로컬 사본을 쓴다.)

```bash
python ~/.claude/skills/note-deck/scripts/encode_webp.py <deck_dir>
python ~/.claude/skills/note-deck/scripts/verify_deck.py <deck_dir> [base_url]
```

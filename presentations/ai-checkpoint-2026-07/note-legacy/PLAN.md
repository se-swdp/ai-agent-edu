# We are 1% done — AI 구루들의 2026 여름 필기노트 (기획서)

- **덱 슬러그**: `ai-checkpoint-2026-07` (구 `guru-notes-2026`) · 21장 (본편 17 + 디바이더 4) · note-deck 손글씨 스타일
- **대상**: 개발자 + 지식노동자 혼합 청중
- **액자 구조**: "지난 두 달, 업계 리더들의 발표·글·팟캐스트를 듣고 적은 필기노트를 공유합니다."
  컨퍼런스 프로그램북처럼 등장인물 라인업 → 세션(디바이더) 4개 → 클로징 인용.
- **표기 원칙**: 영문이 더 정확한 표현은 영문 그대로. 인물 첫 언급 시 한 줄 신원 라벨
  ("Claude Code 만든 사람" 톤). 공통적·일반적 내용은 인용 없이 필기 본문으로.
- **모든 수치·인용은 2026-07-17 웹 재검증 완료** (16-agent 워크플로우, 하단 정정 노트 참조).

## 내러티브 아크

훅(카파시의 고백) → ① 숫자로 본 판 → ② 빌더들의 낙관 (Cherny 100줄 · Karpathy Loop · Loop Engineering)
→ ③ 반대편 노트 (Mario의 냉소 · Ronacher의 반론 · Willison의 보안 경보 · Hassabis의 브레이크)
→ ④ 우리의 일 (일자리 정정 · 이해 병목) → 클로징 "We are 1% done."

지적 하이라이트: **최대 낙관(Cherny: 미래는 100줄 루프)과 최대 냉소(Mario: 그냥 while loop)가
같은 사실에 동의한다** — 본질은 루프, 차이는 그 루프를 다루는 태도.

## 구성표

| # | 파일 | layout | 핵심 메시지 |
|---|------|--------|-------------|
| 1 | 01-cover | cover | We are 1% done — AI 구루들의 2026 여름 필기노트 |
| 2 | 02-hook | banner | Karpathy: "타이핑을 안 한 지 반년" — 우리는 오늘 몇 줄 썼나? |
| 3 | 03-lineup | cards | 오늘의 등장인물 5팀 (신원 라벨 포함) |
| 4 | 04-divider-shift | divider | ① 판이 어떻게 됐나 |
| 5 | 05-numbers | stat | 57.3% · 131일 · 1/5 — 검증된 숫자 3개 |
| 6 | 06-evolution | flow | 자동완성→챗봇→에이전트→루프·플릿 (5년) |
| 7 | 07-divider-builders | divider | ② 빌더들의 노트 |
| 8 | 08-cherny-100-lines | banner | "100 lines of code a year from now" |
| 9 | 09-bitter-lesson | cards | 왜 100줄인가 — The Bitter Lesson, 프롬프트 절반 삭제 |
| 9b | 09b-ide-note | cards | IDE에 대한 노트 — 예측이 아니라 이미 일어난 일 |
| 10 | 10-karpathy-loop | flow | 에이전트가 연구를 한다 — 700회 실험, 11% 단축 |
| 11 | 11-loop-engineering | cards | 올여름의 공통 어휘 — Loop Engineering |
| 12 | 12-divider-counter | divider | ③ 반대편 노트 |
| 13 | 13-while-loop | banner | Mario: "a while loop that calls an LLM with four tools" |
| 14 | 14-ronacher | cards | Ronacher의 반론 — 과적합·자율루프 회의·토큰 청구서 |
| 15 | 15-security | cards | Willison의 Challenger 경보 → 6·7월에 현실이 됨 |
| 16 | 16-hassabis | cards | Hassabis — AGI 2030±1, 감시기구 제안 |
| 17 | 17-divider-our-work | divider | ④ 그래서, 우리의 일은 |
| 18 | 18-jobs-walkback | contrast | 일자리 종말론 1년 만의 정정 (좌 2025 경고 / 우 2026 현실) |
| 19 | 19-understanding-bottleneck | cards | Understanding is the new bottleneck — 퀴즈 게이트 |
| 20 | 20-closing | banner | "We are 1% done." |

## 슬라이드별 상세 (verbatim 문구 + 발표 노트)

### 01-cover (cover)
- 제목: **We are 1% done**
- 부제: "AI 구루들의 목소리" · "2026 여름 필기노트" · "에이전트의 미래"
- byline: "AI 세미나 · 2026년 7월"
- 로봇 말풍선: "필기해 왔어요!"
- 발표 노트: 제목은 Cherny가 7/7 "The Making of Claude Code" 공개 때 남긴 실제 문장.
  오늘 발표는 지난 두 달간 업계 리더들의 발표·글을 직접 추적해 정리한 필기노트다.

### 02-hook (banner)
- 메시지: "I don't think I've typed like a line of code probably since December."
- 보조: "— Andrej Karpathy (前 Tesla AI 리드) · 그럼 우리는, 오늘 몇 줄을 썼을까?"
- 발표 노트: No Priors 팟캐스트(2026-03-20) 실제 발언. 1월 X 포스트에서는 "11월엔 수동 80%,
  지금은 에이전트 80%"라고 수치화. 5/19 Anthropic 프리트레이닝 팀 합류
  ("using Claude to build the next Claude").

### 03-lineup (cards) — "오늘의 등장인물"
- Boris Cherny | Claude Code 만든 사람 — "100줄이면 된다"
- Andrej Karpathy | 前 Tesla AI 리드 — 에이전트에게 연구를 시켰다
- Demis Hassabis | Google DeepMind CEO — 특이점을 말하며 브레이크를 설계
- Simon Willison | Django 같이 만든 사람 — 보안 경보를 울렸다
- Armin Ronacher · Mario Zechner | Flask · Pi 만든 사람들 — 냉정한 반론
- 펀치라인: "낙관, 냉소, 경고 — 다 적어왔습니다"
- 발표 노트: Willison은 "prompt injection"(2022) · "agentic engineering"(2026-02) 용어를 만든
  장본인. Mario Zechner의 Pi는 미니멀 코딩 에이전트(OpenClaw의 토대).

### 04-divider-shift (divider ①)
- 제목: "판이 어떻게 됐나" / 보조: "숫자로 보는 2026년 여름"
- 펀치라인: "에이전트는 데모에서 — 인프라가 됐다"

### 05-numbers (stat)
- 제목: "지금 어디까지 왔나"
- **57.3%** — 이미 프로덕션에서 에이전트 운영 중
- **131일** — AI가 혼자 해내는 일의 길이가 2배 되는 주기
- **1/5** — Codex 사용자 5명 중 1명은 비개발자
- 출처 표기: "LangChain 2026 · METR TH1.1 · OpenAI 2026.6"
- 펀치라인: "개발자만의 이야기가 아니다"
- 발표 노트: LangChain State of Agent Engineering(2026-06-12, 1,340명): 57.3% 프로덕션 운영,
  1만 명 이상 조직은 67%. METR TH1.1(2026-01-29): post-2023 배가 주기 130.8일(최근 추세는
  88.6일로 더 빠름). Codex 주간 사용자 5M(6/2), 약 1/5이 비개발자. 참고: Claude Code 연환산
  ~$8B(2026-05), Cowork 세션 분석(7/7, 60만+ 조직)에서 대부분이 비코딩 업무.

### 06-evolution (flow)
- 제목: "5년의 진화"
- 흐름: "자동완성 (2021)" → "챗봇 복붙 (2023)" → "에이전트 (2025)" → "루프 · 플릿 (2026)"
- 주석: "이제 한 번에 1,000개 에이전트를 부리는 기능까지" (Claude Dynamic Workflows, 2026-05)
- 펀치라인: "도구가 아니라 — 일을 맡는 존재"
- 발표 노트: 2026년 신호들 — Windsurf가 'Devin Desktop'으로 전환(IDE가 에이전트 칸반 보드로),
  Google Antigravity 2.0 동적 서브에이전트, GitHub Copilot 전면 종량제 전환(6/1).

### 07-divider-builders (divider ②)
- 제목: "빌더들의 노트" / 보조: "만든 사람들이 말하는 미래"
- 펀치라인: "Loops are the future"

### 08-cherny-100-lines (banner)
- 메시지: "Claude Code itself may be 100 lines of code a year from now."
- 보조: "— Boris Cherny (Claude Code 만든 사람) · Sequoia AI Ascent 2026"
- 두 번째 줄: "코딩은 사실상 풀렸다 — 단, '내가 쓰는 코드는'"
- 발표 노트: Training Data 팟캐스트(2026-05-05) 공식 설명문 그대로. 같은 에피소드:
  2026년 코드 0줄, 폰에서 하루 수십 개 PR("150개 랜딩한 날도"), "coding is effectively
  solved — at least for the code he writes"(한정어 유지 필수), 인쇄기 비유.

### 09-bitter-lesson (cards)
- 제목: "왜 100줄인가 — The Bitter Lesson"
- 벽의 액자 | 팀 사무실에 Sutton의 'The Bitter Lesson'이 걸려 있다
- 팀의 원칙 | "Always bet on general-purpose models"
- 실제 사건 | 새 모델이 나오자 — 시스템 프롬프트 절반을 삭제
- 결론 | 정교한 스캐폴딩은 모델이 곧 삼킨다
- 펀치라인: "모델이 좋아질수록 — 비계는 스스로 무너진다"
- 발표 노트: 액자는 복수 출처 확인. 원칙 인용은 Lenny's Podcast(2026-02-19) 버전.
  삭제 일화 verbatim은 "We deleted 50% of the system prompt when the new models dropped"
  ("2,000토큰"은 미확인 수치 — 사용 금지). "모델이 삼킨다"는 패러프레이즈(따옴표 금지).
  Cherny 개인 CLAUDE.md도 ~2,500토큰(~100줄), 실수 로그로 운영.
- Q&A 대비 — "100줄이 뭔 소리냐": 지금의 수만 줄은 대부분 모델이 못 미더워서 존재하는
  코드다(에러 제어·컨텍스트 압축·출력 파서·상태 머신) = 비계. 모델이 스스로 터미널을
  다루고 계획을 세우면 이 코드들은 할 일이 없어지고, "상태를 주고 → 결정 받고 → 실행하고
  → 결과를 되돌려주는" while 루프 하나(~100줄)만 남는다. 지능 처리 전부가 모델 안으로
  흡수된다는 뜻. 청중용 반문: "우리가 짜는 예외 처리·오케스트레이션 중 다음 모델이 통째로
  삼킬 비계는 몇 %인가?"

### 09b-ide-note (cards) — v1.1 문자 접미사 삽입 (2026-07-17)
- 제목: "IDE에 대한 노트"
- 본래 역할 | 사람의 한계 보완 — 트리 · 하이라이팅 · 디버거
- 에이전트는 | grep · bash로 직접 읽는다 — 화면이 필요 없다
  (원래 "셸로"였으나 ㅖ/ㅔ 오탈자가 2회 반복돼 영문 "bash로"로 우회 — 검증 인용의
  "it can run bash commands"와도 일치)
- 2025. 11 | 체르니, 자기 IDE를 삭제했다
- 2026. 6 | IDE들이 에이전트 관제 보드로 (Windsurf → Devin Desktop)
- 펀치라인: "쓰는 화면에서 — 승인하는 화면으로"
- 발표 노트 (담담하게): IDE는 사람의 인지 한계(파일 구조·문법·디버깅)를 보완하려고 무거워진
  도구다. 에이전트는 화면을 보지 않는다 — grep·glob·셸로 직접 읽는다. Claude Code가 CLI로
  나온 이유, 체르니 verbatim: "Because it runs in the terminal, it has access to a bunch of
  stuff that you just don't get if you're running on the web or on desktop... it can run bash
  commands, it can see all of the files... and it does all that agentically." (Latent Space)
  체르니는 2025-11 자기 IDE를 삭제했다(한 달간 안 열어서 — Acquired Unplugged, 2026-06).
  업계도 따라간다: Windsurf는 2026-06-02 'Devin Desktop'으로 전환 — 기본 화면이 에디터가
  아니라 에이전트 칸반 관제 보드(ACP로 타사 에이전트까지 표시).
  **주의: "IDE는 사라질 것"이라는 체르니 직접 인용은 존재하지 않음** — 저널리스트 프레이밍.
  발표에서는 "예측 인용"이 아니라 위 사실 4개를 담담히 나열하고 청중이 결론을 내리게 한다.
  연결 멘트: "그는 말로 예측하지 않았습니다. 그냥 지웠습니다."
  참고 인용: "The title software engineer is going to start to go away." (Lenny's, 2026-02)

### 10-karpathy-loop (flow)
- 제목: "The Karpathy Loop — 에이전트가 연구를 한다"
- 순환: "가설" → "코드 수정" → "GPU 실험" → "결과 분석" → (가설로 복귀)
- 주석 1: "이틀간 700회 실험 → 학습 11% 단축" (autoresearch · nanochat, 2026.3)
- 주석 2: "Shopify CEO도 하룻밤 37회 실험을 돌렸다"
- 펀치라인: "코드를 짜는 단계를 넘어 — 연구를 굴린다"
- 발표 노트: 시점은 **2026년 3월**(7월 아님 — 초안 정정). 단일 GPU nanochat train.py(~630줄),
  시간당 ~12실험, 유지 가치 있는 최적화 20건, 2.02h→1.80h. "Karpathy Loop" 명명은
  The New Stack의 Janakiram MSV. repo ~86k 스타. nanochat: GPT-2급을 ~$73/3h(1월),
  2019년 비용 ~$43,000 대비 약 600배 절감(스피드런 최신 기록은 99분).
  Karpathy의 4월 발표 verbatim: "Vibe coding raises the floor. Agentic engineering is
  about extrapolating the ceiling."

### 11-loop-engineering (cards)
- 제목: "올여름의 공통 어휘 — Loop Engineering"
- Boris Cherny | "I have loops prompting Claude"
- Andrew Ng | 분 · 시간 · 주 — 3중 루프로 보라
- swyx · AI Engineer 컨퍼런스 | 키노트 제목이 'Loopcraft'
- 제품들 | /loop · /goal · 서브에이전트 1,000개 — 기능으로 내장되는 중
- 펀치라인: "Prompt → Context → Loop Engineering"
- 발표 노트: Steinberger(6/7): "you shouldn't be prompting coding agents anymore. You should
  be designing loops that prompt your agents" → Addy Osmani가 'Loop Engineering'으로 명명
  (O'Reilly 재게재 6/22) → Ng의 The Batch(6/26) 3중 루프 → AIEWF 2026(6/29-7/2, ~6,000명)
  테마 "Software Factories", swyx 키노트 "Loopcraft: The Art of Stacking Loops".
  Harrison Chase(LangChain): "If you don't own your harness, you don't own your memory."

### 12-divider-counter (divider ③)
- 제목: "반대편 노트" / 보조: "회의론과 경고도 적어왔다"
- 펀치라인: "박수만 치는 컨퍼런스는 아니었다"

### 13-while-loop (banner)
- 메시지: "a while loop that calls an LLM with four tools"
- 보조: "— Mario Zechner (에이전트 Pi 만든 사람) · 에이전트의 실체"
- 두 번째 줄: "최대 낙관과 최대 냉소가 — 같은 그림에 동의한다"
- 발표 노트: Mario 블로그(2025-11-30) verbatim. State of Agentic Coding #8(7/13,
  Armin Ronacher·Ben Vinegar·Mario Zechner)의 반복 논지: 6개월 전과 뼈대가 같다, FOMO 불필요.
  Cherny의 "100줄"과 정확히 같은 사실 — 태도만 다르다.

### 14-ronacher (cards)
- 제목: "Armin Ronacher의 반론" (부제 라벨: Flask 만든 사람)
- 과적합 | 모델이 자사 도구에 맞춰져 — 남의 도구에선 스펙을 깬다
- 자율 루프 | 아끼는 코드에선 아직 재미를 못 봤다
- 토큰 청구서 | 정액제가 무너진다 — Copilot도 종량제로
- 펀치라인: "루프는 공짜가 아니다"
- 발표 노트: "Better Models: Worse Tools"(7/4) — Claude Code의 관대한 파싱에 RL이 과적합,
  타사 strict 스펙(Pi의 nested edits[])에서 실패 증가. verbatim: "Slightly malformed tool
  calls can still complete the task and receive reward." "The Coming Loop"(6/23) — 하네스
  루프의 도래는 인정하되 자율 루프 회의. 참고: 초안의 "stochastic terrorism"·DirectX 비유는
  출처 미확인이라 제외. Copilot 종량제(6/1), Fowler도 토큰 비용을 차기 엔터프라이즈 문제로 지목.

### 15-security (cards)
- 제목: "Willison의 경보 — 그리고 현실이 됐다" (부제 라벨: Django 같이 만든 사람)
- 경고 · 1월 | "a Challenger disaster" — 코딩 에이전트 보안
- 현실 · 6월 | npm 웜이 에이전트 훅 파일에 백도어
- 현실 · 6월 | 악성 README 하나로 개발 PC 장악 PoC
- 현실 · 7월 | 보안 리뷰 에이전트가 — 검사하던 악성코드를 실행
- 펀치라인: "다들 사실상 root로 돌리고 있다 — 격리가 기본값이 되는 중"
- 발표 노트: 예언 verbatim(1/8): "I think we're due a Challenger disaster with respect to
  coding agent security" · "so many people, myself included, are running these coding agents
  practically as root". 사건들: Miasma 웜(6/1-3, 57개 패키지·286+ 버전, 에이전트 훅 파일
  퍼시스턴스), Mastra 생태계 트로이잔(6/17, 90분 만에 140+ 패키지), Mozilla 0Din PoC(6/29),
  "Friendly fire"(7/9, Claude Code·Codex 보안 리뷰 모드가 악성 바이너리 실행 유도됨).
  대응: Anthropic Managed Agents Sandbox 베타(5/27), npm v12 설치 스크립트 기본 차단(7월),
  OWASP 에이전틱 보안 v2.01 — 이제 실제 CVE 카탈로그.

### 16-hassabis (cards)
- 제목: "Hassabis의 노트 — 특이점의 산기슭" (부제 라벨: Google DeepMind CEO · 노벨 화학상)
- AGI 시점 | "maybe 2030, plus or minus a year"
- 충격의 크기 | 산업혁명의 10배를 — 10배 속도로
- 제안 · 7/14 | FINRA식 감시기구 — 출시 前 30일 심사
- 아직 없는 것 | 장기 계획, 진짜 창의성
- 펀치라인: "가장 낙관적인 CEO가 — 브레이크를 함께 설계하자고 한다"
- 발표 노트: 선언문 "A Framework for Frontier AI and the Dawning of a New Age"(X, 7/14):
  AGI "probably only a few short years away", "perhaps 10x of the Industrial Revolution at
  10x the speed", 업계 자금·30일 사전 심사·업계 감속 조율 권한. 2030±1은 Stanford GSB
  대담(6/18 공개; Axios 인터뷰 아님 — 초안 정정). "warning shots"(복수형)·오픈소스 모델 내
  생물·핵 능력 18개월 경고는 Axios(7/14). Cannes Lions(6/24): AGI에 아직 없는 두 조각 =
  장기 추론·계획 + 진짜 창의성. 참고: Jack Clark "노벨상급 지능" 발언은 2025년 3월 POLITICO
  (2026년 발언 아님); 최신은 Oxford 강연(5월): "18개월 내 AI 단독 운영 회사가 수백만 달러 매출".

### 17-divider-our-work (divider ④)
- 제목: "그래서, 우리의 일은" / 보조: "지식노동자의 자리"
- 펀치라인: "구현은 싸졌다 — 이해는 비싸졌다"

### 18-jobs-walkback (contrast)
- 제목: "일자리 종말론, 1년 만의 정정"
- 좌 카드 "2025년의 경고": "신입 화이트칼라 절반이 위험 — Amodei" / "실업률 20%까지 각오" /
  "신입 일자리부터 사라진다 — Altman"
- 우 카드 "2026년의 현실" (green): "pretty wrong — 틀려서 기쁘다 (Altman)" /
  "90%가 자동화되면 남은 10%가 일의 100%가 된다 (Amodei)" / "소프트웨어 총수요가 더 빨리 늘었다"
- 펀치라인: "단, 22~25세 개발자 고용은 −20% — 진입로부터 바뀐다"
- 발표 노트: Altman(5/26 시드니, CBA CEO 대담): 기술 예측은 "roughly right", 사회·경제는
  "pretty wrong", "I'm delighted to be wrong about this". Amodei(5/5, JPMorgan 행사)
  verbatim: "If you automate 90% of the job, then everyone does the 10% of the job. And the
  10% kind of expands to be 100% of what people do and kind of 10xs their productivity."
  균형: Stanford AI Index 2026 — 22~25세 개발자 고용 2024년 이후 약 −20%(연상 개발자는 증가);
  Bloomberg(7/2) 금융·정보 섹터 월평균 28,000명 감소; Anthropic은 walkback과 동시에
  $350M 규모 인력전환 기금(6/11) — 말은 부드러워졌지만 대비는 진행 중.

### 19-understanding-bottleneck (cards)
- 제목: "새 병목은 이해다"
- 발견 | 구현 속도 ∞ — 병목은 사람의 이해 속도 (Geoffrey Litt · Notion 엔지니어)
- 처방 | 에이전트가 변경 리포트 + 퀴즈 생성 — 통과 전 머지 금지
- 핵심 | "A quiz is a speed regulator."
- 수렴 | Anthropic의 Thariq Shihipar도 같은 결론 — 사각지대 찾기 패스
- 펀치라인: "속도를 관리하지 말고 — 이해를 관리하라"
- 발표 노트: Litt "Understanding is the new bottleneck"(2026-07-02): cognitive debt,
  "My rule: I won't send code to others until I can pass the quiz." Thariq Shihipar
  (Anthropic Claude Code 팀): unknown-unknowns 4사분면 + 구현 전 blindspot pass + HTML
  리포트·퀴즈 게이트 — 두 사람이 **독립적으로** 같은 워크플로우에 도달(우연한 수렴이 포인트).
  청중 실전 팁: 배포 게이트를 '테스트 통과'에서 '사람의 이해 통과'로 한 단계 추가.
  Glean(6월): AI가 주 11시간 절약, 그중 6.4시간은 'botsitting'(검증·뒷수습)으로 재소비.

### 20-closing (banner)
- 메시지: "We are 1% done."
- 보조: "— Boris Cherny · 2026. 7. 7"
- 두 번째 줄: "나머지 99%는 — 루프를 설계하고, 이해를 지키는 사람의 몫"
- 로봇: 손 흔들기 + "Q&A"
- 발표 노트: X 원문: "This is our first time telling the story of how we first built and
  launched Claude Code... So much more to do. We are 1% done."

## 정정 노트 (초안 대비 — 슬라이드에 쓰면 안 되는 것들)

| 초안의 주장 | 검증 결과 |
|---|---|
| autoresearch는 2026년 7월 | **2026년 3월** (repo 3/6-7, Fortune 3/17) |
| "시스템 프롬프트 2,000토큰 삭제" | verbatim은 **"50% 삭제"** — 2,000토큰은 미확인 |
| "the model eats your scaffolding" (인용) | 실제 인용 아님 — 패러프레이즈로만 사용 |
| SWE-bench Verified ~75%가 최상위 | **낡음** — 벤치마크 포화, 최신 지표는 SWE-bench Pro 등 |
| Devin $500/월 | **낡음** — 2025년 4월부터 엔트리 $20/월 |
| 주니어 티켓 처리 3~4배 | **출처 없음** — 사용 금지 |
| Codex 4M 주간 사용자 / NVIDIA 고객 | 6월 기준 **5M+** / NVIDIA는 미확인( Cisco만 확정) |
| GPT-2 재현 $73 vs 2019년 $50,000 | 2019년 비용은 **~$43,000** (Karpathy 본인 계산) |
| Jack Clark "노벨급" 발언이 최근 | **2025년 3월** 발언 — 최신은 5월 Oxford 강연 |
| Hassabis AGI 2029-2030이 Axios 출처 | **Stanford GSB(6/18)** 출처 — "maybe 2030, ± a year" |
| "이해 병목" = Thariq Shihipar | 제목·퀴즈 조절기 = **Geoffrey Litt**; Thariq는 별도 프레임워크 |
| 팟캐스트 "AI Frontier Korea" / 노정석 | 덱에서 제외 (사용자 지시) |
| 체르니 "IDE는 사라진다" 예측 (인용) | verbatim 없음 — 본인 IDE 삭제(사실) + 업계 전환(정황)으로 서술 |
| Karpathy "agentic engineering raises the ceiling" | verbatim은 "…is about **extrapolating** the ceiling" |

## 생성 계획

- **차단 사유**: codex(GPT) 쿼터 소진 — 리셋 **2026-07-24 00:02** (오늘 확인한 에러 메시지 기준).
- 리셋 후: `python ~/.claude/skills/note-deck/scripts/gen_deck.py deck-spec.json --parallel 3`
  (20장 ≈ 40-60분, 장당 ~39k 토큰). 스타일 레퍼런스는 gen_deck.py가 레이아웃별 자동 첨부.
- 이후: 육안 검수 → `encode_webp.py` → viewer-template 기반 index.html → README →
  `verify_deck.py` → 라이브러리 등록(presentations/index.html + manifest 재생성).

# 핸즈오프 — AI 전파교육 대시보드 운영

> 다른 Claude 세션이 이 문서만 읽고 바로 운영을 이어받을 수 있도록 작성. 모호한 부분 발견 시 이 문서를 갱신.
>
> 마지막 갱신: 2026-10-05

---

## 0. 30초 요약

| 항목 | 값 |
|---|---|
| 메인 URL (앞으로 공유) | **https://ai-agent-edu.web.app** |
| 옛 URL (리다이렉터) | https://swdp-seminar-dashboard.web.app → `ai-agent-edu.web.app/:path*` 로 301 (경로 유지) |
| GitHub | https://github.com/nyd0512/seminar-dashboard (`main`) |
| Firebase 프로젝트 ID | `swdp-seminar-dashboard` |
| Hosting 사이트 (multi-site) | `ai-agent-edu` (target=`agent`, 실제 콘텐츠) + `swdp-seminar-dashboard` (target=`default`, `public: "redirect"` 301 리다이렉터) |
| 뷰별 URL | `/` 대문 · `/calendar` · `/timeline` · `/library` (열람실) · `/news` · `/qna` (문의) |
| Firestore DB | `(default)`, 컬렉션 `sessions` · `inquiries` · `inquiry_comments` · `visits` |
| 편집 비번 | `aijjang` (`js/data.js` `EDIT_PASSWORD`) |
| Firebase CLI 로그인 | `ringo.cozy@gmail.com` |
| 자동 배포 | ❌ 없음. `firebase deploy` 수동 |

---

## 1. 자주 쓰는 명령

### 일반 배포 (가장 자주 씀)
```powershell
firebase deploy --only hosting:agent --project swdp-seminar-dashboard
```
→ 실제 콘텐츠 사이트(ai-agent-edu)만 갱신. 옛 URL은 리다이렉터라 콘텐츠 변경 시 재배포 불필요.

### 리다이렉터 / 전체 hosting
```powershell
# 옛 URL 리다이렉터만 (redirect/ 또는 default target 설정을 바꿨을 때)
firebase deploy --only hosting:default --project swdp-seminar-dashboard

# 두 target 모두
firebase deploy --only hosting --project swdp-seminar-dashboard
```

### Firestore 보안 규칙만
```powershell
firebase deploy --only firestore:rules --project swdp-seminar-dashboard
```

### 전체 (rules + hosting 둘 다)
```powershell
firebase deploy --project swdp-seminar-dashboard
```

### 로컬 미리보기
```powershell
firebase serve --only hosting:agent
# → http://localhost:5000  (hosting:default 는 리다이렉터라 미리볼 콘텐츠 없음)
```

### GitHub 동기화 (Actions 없음 — 자동 배포 X)
```powershell
git push origin main
```

---

## 2. 표준 운영 절차

### A. 비밀번호 변경
1. `js/data.js`의 `EDIT_PASSWORD` 값 수정
2. `firebase deploy --only hosting:agent --project swdp-seminar-dashboard`
3. 사용자에게 새 비번 알림 (운영자만 공유)

### B. 디자인/기능 수정
1. 코드 수정
2. `firebase deploy --only hosting:agent --project swdp-seminar-dashboard`
3. **검증 (필수)**: Chrome MCP로 `?bust=$(timestamp)` 붙여서 새 URL 접속 → DOM/state 확인
4. commit + push (사용자가 명시적으로 원할 때만)

### C. 데이터 (교육 일정) 추가/수정/삭제
- **사용자가 사이트 UI에서 직접** 수행. Claude가 코드로 할 일 없음
- 잠금 해제 후 캘린더 셀의 `+` 또는 타임라인 `+ 새 교육 추가`

### D. 보안 규칙 변경
- `firestore.rules` 편집
- `firebase deploy --only firestore:rules --project swdp-seminar-dashboard`

### E. 새 호스팅 사이트 추가 (서브도메인 추가)
1. `firebase hosting:sites:create [이름] --project swdp-seminar-dashboard`
2. `.firebaserc` 의 `targets.swdp-seminar-dashboard.hosting` 에 새 target 추가
3. `firebase.json` 의 `hosting` array 에 새 항목 추가 (다른 target 설정 복사 후 `target` 필드만 변경)
4. `firebase deploy --only hosting --project swdp-seminar-dashboard`

### F. 호스팅 사이트 삭제
```powershell
firebase hosting:sites:delete [사이트이름] --project swdp-seminar-dashboard --force
```
삭제 후 `.firebaserc`, `firebase.json`에서 관련 target 제거.

### G. 열람실(자료실) — 다운로드 자료 추가 ⭐ 가장 자주 할 작업
- 사이드바 "열람실" = dashboard 내 view (`data-view="library"`). 자료 카드 그리드 + 다운로드
- **자료 추가 (코드 수정 0)**:
  1. `presentations/files/` 폴더에 파일 그대로 복사
  2. `firebase deploy --only hosting:agent --project swdp-seminar-dashboard`
  3. predeploy hook (`scripts/build-materials-manifest.mjs`) 이 자동으로 `presentations/files/manifest.json` 생성 → 페이지에서 카드 자동 렌더
- **파일명 규칙** (선택): `YYYY-MM-DD__카테고리__제목.확장자`
  - 예: `2026-04-23__슬라이드__AI에이전트_개론.pdf` → 카드에 날짜/카테고리/제목 분리 표시
  - 규칙 안 맞춰도 작동 (파일명 그대로 표시, 카테고리 "기타")
- **구현 파일**:
  - `js/library.js` — manifest fetch + 카드 렌더
  - `scripts/build-materials-manifest.mjs` — predeploy hook
  - `firebase.json` 의 `agent` target `predeploy: ["node scripts/build-materials-manifest.mjs"]`
- **발표자료 슬라이드 HTML** (`presentations/[slug]/index.html`): `presentations/index.html` 의 `a.item` 앵커에서 자동 수집되어 **열람실 카드로 노출**된다 (제목 · `data-month` 업로드월 · 부제). 인덱스에서 빠진 폴더도 직접 URL 로는 계속 서빙 (딥링크 보존).
- 새 슬라이드 추가: `presentations/[slug]/` 폴더 + `presentations/index.html` 에 `data-month="YYYY-MM"` 포함 카드 한 줄 추가 (라이브 덱은 "지난 교육 자료 / Archive" divider 위, 지난 덱은 그 아래 `archive/` 경로) → deploy 시 manifest 자동 반영. 폴더 rename 시 firebase.json 리다이렉트는 **bare / trailing-slash / `/:rest*` 3종 세트**로 추가해야 한다 (`:rest*` 는 빈 나머지를 매칭하지 못함 — 5e0c6d6 참고).

### H. 뉴스 — 브리핑 이슈 발행
- 데이터: `news/issues.json` (`{ updated, issues[] }`). 렌더: `js/news.js` (스키마는 파일 상단 주석)
- 발행: `issues[]` **맨 앞**에 새 이슈 추가 (+ `updated` 갱신) → `firebase deploy --only hosting:agent --project swdp-seminar-dashboard`
  - issue: `{ id, type, no, title, date, period, intro, highlights[], body[], refs[{ label, url }] }`
  - `type`: `weekly` / `biweekly` / `monthly` / `daily` (주간·격주·월간·일간 라벨)
- commit 컨벤션: `content(news): <type> briefing issue N (YYYY-MM-DD)`

### I. 문의 게시판 · 방문자 카운터
- `js/qna.js` — `inquiries` (문의 글) + `inquiry_comments` (답변 댓글, `inquiryId` 로 연결). 둘 다 onSnapshot 구독
- 글쓰기는 누구나 (이름 선택), 삭제 버튼은 편집 모드(관리자)에서만 노출
- `js/visits.js` — `visits` 컬렉션 (날짜별 문서 `YYYY-MM-DD` + `_total`), 브라우저당 하루 1회 집계, 사이드바 `#visitMeta` 에 편집 모드일 때만 표시
- 새 컬렉션을 쓰면 `firestore.rules` 에 match 블록 추가 + `firebase deploy --only firestore:rules --project swdp-seminar-dashboard`

### J. 뷰별 URL · 새 뷰 추가
- 뷰마다 고유 경로: `/` 대문 · `/calendar` · `/timeline` · `/library` (열람실) · `/news` · `/qna` (문의). 특정 뷰를 공유할 땐 그 경로를 그대로 보낸다
- 구현: `js/app.js` 의 `VIEWS` 레지스트리에 뷰마다 `path` → 뷰 전환 시 `history.pushState`. `firebase.json` (`agent` target) rewrites 가 이 경로들을 `/index.html` 로 보낸다
- 새 뷰 추가: ① `VIEWS` 에 항목 (`title` / `sub` / `render` / `path`) ② `index.html` 사이드바 `nav-item` 버튼 (`data-view`) + `data-view-content` 섹션 ③ `firebase.json` (`agent` target) rewrites 에 해당 path → `/index.html` (기존 뷰처럼 끝 슬래시 `/path/` → `/path` 301 redirect 도 함께)

---

## 3. 알려진 함정

### 브라우저/CDN 캐시
- `firebase.json` 의 css/js → `Cache-Control: no-cache`, html → `no-store`. 다음 페이지 로드는 신선
- 하지만 **이미 떠있는 페이지**는 옛 JS 사용 가능 → 사용자에게 `Ctrl+Shift+R` 안내
- Chrome MCP 검증 시 항상 URL에 `?bust=...` 붙이기

### Firebase Authentication 미활성화
- Console → Authentication 에서 "시작하기"만 누르고 Sign-in method는 미활성
- 현재 보안 모델: **Firestore Rules 누구나 read/write + 클라이언트 비번 게이트** (옛 Express 보안과 동일 수준)
- 진짜 인증 필요해지면 사용자 협조 받아 Email/Password Provider 활성화 + 사용자 추가 + Rules에 `request.auth != null` 조건

### Firestore 위치
- DB는 `(default)` (us-central, multi-region nam5). 한국 사용자 latency 약간 있지만 사용 가능 수준
- 위치 변경하려면 DB 재생성 필요 (큰 작업)

### Service Account Key 노출 이력
- 초기 deploy 시 `*-firebase-adminsdk-*.json` 키가 약 30분 호스팅에 공개됨
- 사용자에게 폐기 권장 안내함 — 새 admin 작업 필요해지면 새 키 받아서 사용
- `.gitignore` + `firebase.json` `agent` target ignore 패턴에 `*-firebase-adminsdk-*.json` 추가됨 (`default` target은 `redirect/` 만 배포)

### GitHub Actions 없음
- `git push` 자체로는 자동 배포 안 됨. `firebase deploy` 별도 실행 필수
- 사용자가 Actions 셋업을 명시적으로 거절함 ("필요없을거같다")

### 멀티사이트 배포 시 주의
- `firebase deploy --only hosting` 은 **모든** target에 배포 (agent 콘텐츠 + default 리다이렉터)
- `default` target 은 `public: "redirect"` + `/:path*` → `https://ai-agent-edu.web.app/:path*` 301. 옛 링크는 경로 그대로 새 사이트로 넘어간다
- deploy 제외 목록은 `agent` target `ignore` (`**/*.md`, `**/*.docx`, `docs/**`, `scripts/**`, `**/src-png/**`, `**/style-refs/**` 등). 로컬 전용 파일이 생기면 여기에 추가

---

## 4. Firestore 컬렉션 구조

컬렉션 4개: `sessions` (교육 일정, 아래 표) · `inquiries` / `inquiry_comments` (문의, §2.I) · `visits` (방문자 카운터). Rules는 모두 누구나 read/write.

**컬렉션**: `sessions`
**docId**: 자동 생성 (기존 13건은 `s01`~`s13` 보존)

| 필드 | 타입 | 비고 |
|---|---|---|
| `title` | string | 필수 |
| `topic` | string | 카테고리 (Agentic AI, 페어 프로그래밍, 리더십 등) |
| `date` | string | YYYY-MM-DD, 필수 |
| `startTime` | string | HH:MM, 옵션 |
| `endTime` | string | HH:MM, 옵션 |
| `isOnline` | boolean | 온라인/오프라인 |
| `location` | string | |
| `instructor` | string | |
| `audience` | string | 대상 조직 |
| `enrolled` | number | 참석 인원 |
| `capacity` | number | 정원 |
| `status` | string | `scheduled` / `ongoing` / `completed` |
| `description` | string | |

normalize / 정렬 로직: `js/schema.js`. document에 `id` 필드 저장 안 하고, 클라이언트에서 `doc.id` 를 객체 `id`로 매핑.

---

## 5. 프로젝트 폴더 구조

```
seminar-dashboard/
├── HANDOFF.md               # 이 파일 (Claude 운영 매뉴얼)
├── README.md                # 사용자/방문자용 문서
├── firebase.json            # Hosting (multi-site array) + Firestore 설정
├── .firebaserc              # default 프로젝트 + hosting targets
├── firestore.rules          # 누구나 read/write
├── firestore.indexes.json   # 빈 인덱스
├── index.html               # importmap (Firebase ESM CDN) + UI (6 nav: 대문/캘린더/타임라인/열람실/뉴스/문의)
├── package.json             # 로컬 도구 의존성만 (빌드 없음, deploy 제외)
├── redirect/                # default target(옛 URL) public — 301 리다이렉터 fallback index.html
├── news/
│   └── issues.json          # 뉴스 브리핑 이슈 (최신이 맨 앞)
├── .claude/skills/          # 프로젝트 덱 제작 스킬 (deck-authoring, note-deck-a/b/c)
├── assets/                  # hero / 단청 / 낙관 / brand-mark (한옥 일러스트)
├── presentations/
│   ├── index.html           # 발표자료 인덱스 — 라이브 6종 + Archive 9종 (`a.item`, 업로드월 data-month 표기)
│   ├── files/               # ⭐ 자료실 다운로드 파일 — 여기에 파일만 넣고 deploy
│   │   └── manifest.json    # 자동 생성 (predeploy hook, 결정론적 출력)
│   ├── ai-productivity/     # AI로 생산성은 어떻게 올랐나 (EHS 소통회)
│   ├── ai-dlc-swdp/         # SWDP 개발·운영과 AI 에이전트 적용 방향
│   ├── ai-driven-transition/# AI Driven 전환은 왜 어려운가
│   ├── working-with-agents/ # AI Agent와 일해보니 (구 ai-agent-unified)
│   ├── claude-code-playbook/# Claude Code 실전 활용법 (하이브리드: webp+HTML)
│   ├── ai-checkpoint-2026-07/ # AI, 어디까지 왔고 어디로 가는가 (구 guru-notes-2026, 노트 덱)
│   ├── archive/             # 지난 교육 덱 9종 — 열람실 "Archive" 섹션으로 노출 (39ef50f 복원, archive/README.md)
│   └── assets/              # 공유 데이터·이미지·랩·페이퍼·비디오
├── scripts/
│   └── build-materials-manifest.mjs   # predeploy: presentations/files 스캔
├── css/
│   ├── tokens.css           # design tokens (--topbar-h, colors, spacing)
│   ├── base.css
│   ├── layout.css           # sidebar/topbar/main grid
│   ├── components.css
│   └── views.css            # cover/calendar/timeline/reading 뷰
└── js/
    ├── data.js              # firebaseConfig + EDIT_PASSWORD + 상수
    ├── firebase.js          # initializeApp + getFirestore
    ├── store.js             # Firestore CRUD + onSnapshot + 비번 게이트
    ├── schema.js            # normalize / compareSessions
    ├── utils.js             # DOM/날짜 헬퍼
    ├── app.js               # 부트스트랩 + ui state + renderAll + switchView + nav/topbar/lock/toast/modal primitives
    ├── views.js             # 캘린더 + 타임라인 렌더·컨트롤
    ├── modals.js            # detail / password / session form 모달
    ├── library.js           # 자료실(열람실) manifest fetch + 카드 렌더
    ├── news.js              # 뉴스 뷰 (news/issues.json 렌더)
    ├── qna.js               # 문의 게시판 (inquiries + inquiry_comments)
    └── visits.js            # 방문자 카운터 (visits)
```

### JS 모듈 의존 그래프
```
app.js  ─┬→ views.js  ─→ modals.js
         ├→ modals.js
         └→ library.js / news.js / qna.js / visits.js
views.js / modals.js  ─→ app.js  (ui state, openModal/closeModal, toast, openPasswordModal)
                      ─→ store.js, utils.js, data.js
```
ESM cyclic import 있음 (app ↔ views, app ↔ modals). 런타임 호출 시 resolve 되므로 정상 작동. 모듈 분리 시 이 구조를 유지할 것.

---

## 6. 디자인 규칙 (지켜야 할 것)

- **사이드바 brand 영역과 topbar는 60px 정렬** (`--topbar-h`). brand 또는 topbar padding을 만지면 같이 맞춰야 함
- **사이드바 footer 텍스트**: `v2.0 · 관리자 KHM` (`index.html`의 `.sidebar-meta`; 바로 위 `#visitMeta` 는 방문자 카운터)
- **컬러/spacing**: `css/tokens.css` CSS 변수만 사용. 하드코딩 금지
- **brand-mark**: 한옥 정자 일러스트 (`assets/brand-mark.png`, 배경 투명). 36x36, object-fit: contain
- **캘린더 가시성 기준**:
  - 날짜 숫자: `--fs-md (14px)`, `--fw-bold`
  - 요일 헤더: `--fs-sm (12px)`, `--text-primary`
  - 이벤트: `--fs-sm (12px)`, `--fw-semibold`, height 24px
  - 셀 배경: `rgba(255, 252, 246, 0.94)` (불투명 ↑)
- **상단 tally 표기**: `교육 N회 · 누적 수강 X명 (동일인 누적 포함)`

---

## 7. Firebase Web SDK 버전

- ESM CDN 고정 버전: `10.14.1` (`index.html` importmap)
  - `firebase/app`, `firebase/firestore`
  - Auth 모듈 import 안 함 (사용 안 함)
- 업그레이드 시 importmap만 수정 후 재배포. breaking change는 Firebase 릴리즈 노트 확인

---

## 8. Chrome MCP 활용 패턴 (검증 시)

```
1. tabs_context_mcp                                # 탭 ID 확인
2. navigate(url + ?bust=...)                       # 캐시 우회
3. javascript_tool: setTimeout(2500) → DOM/state   # 렌더링 대기 후 확인
4. read_console_messages(pattern: 'error|store')   # 에러 모니터
```

⚠️ Firebase Console UI 자동 클릭은 selector가 자주 튀어 어려움. 사용자 직접 안내가 더 빠를 때 많음.

---

## 9. 사용자 (KHM) 협업 스타일

- **한국어로 소통**
- **자동화 강선호**: "다 해", "너가 해" → 가능한 모두 Claude가 처리
- **OAuth/브라우저 로그인** 같은 사용자 본인 액션만 안내. 그 외는 자동
- **Firebase Console UI 조작 어려워함** — 단계별 자세한 안내 필요. 자동화 가능한 건 자동
- **보안 엄격하지 않음** — 비번을 채팅에 적는 것 OK. 비번 노출 후 변경 권장
- **짧고 명확한 보고 선호** — 결과 + 다음 단계만. 긴 설명·큰 표는 필요할 때만
- 코드/CLI 우선, UI 클릭은 마지막 수단
- 진행 중에 사용자가 새 요청 끼어들면 그 요청 우선 처리

---

## 10. 진행 중 commit/push 가이드

- 코드 수정 + 배포 후 **사용자가 만족하면** commit + push
- commit 메시지 한국어 OK, 영어 OK. 일관성 유지 (현재까지 영어 prefix + 한국어 본문)
- co-author trailer 추가: 그 세션에서 실제로 쓰는 모델의 `Co-Authored-By: Claude <모델명> <noreply@anthropic.com>` (특정 모델명 고정 금지)
- main 브랜치에 직접 push (PR 안 씀)

---

## 11. 최근 주요 변경 (최신은 `git log --oneline` 으로 확인)

- `e41bc87` feat(library): 'AI로 생산성은 어떻게 올랐나' 덱 추가 — 이어서 ai-easier(`73f7b7c`)·ax-why-hard(`60f9b76`) 덱 정리
- `8382d80` / `08bdab0` / `9c44400` chore·fix(hosting): `docs/`, 로컬 리포트, `*.docx` deploy 제외
- `2933171` content(news): 격주 브리핑 5호 (2026-09-29) — 뉴스 이슈는 `content(news): ...` 로 누적
- `39ef50f` feat(library): 지난 덱 9종을 열람실 Archive 섹션으로 복원
- `365684b` feat(qna): 문의 게시판 (댓글 답변) · `585de35` 메뉴명 '문의'
- `e2d1473` fix(visits): 방문자 카운터는 편집 모드에서만 표시
- `dd1bedd` / `c6ab81a` feat(skills): 프로젝트 덱 스킬 (deck-authoring, note-deck-a/b/c)

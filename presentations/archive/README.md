# archive — 자료실 미노출 발표자료 보관소

자료실(`presentations/index.html`)에서 내려간 과거 세미나 자료를 보관한다.
라이브 덱과 섞이지 않도록 분리했을 뿐, 배포에는 그대로 포함되며
과거 공유 링크(구 슬러그·구 경로)는 firebase.json 리다이렉트로 전부 이곳으로 연결된다.

| 디렉토리 | 구 슬러그 |
|---|---|
| `agent-experience-v1/` | solution-dev-seminar |
| `agent-experience-v2/` | solution-dev-seminar-v2 |
| `ai-agent-allhands/` | all-hands-seminar |
| `ai-dev-tools-handson/` | dev-seminar-06 |
| `ai-work-basics/` | non-dev-seminar |
| `ai-work-basics-brief/` | brief-seminar |
| `claude-code-handson/` | dev-seminar |
| `controller-ai-poc/` | controller_seminar |
| `harness-engineering/` | — |
| `leadership-hands-on/` | — |
| `personal-agent-method/` | — |

- 이동 시(2026-07-18) 덱 루트 기준 `../assets/` 참조는 `../../assets/`로 일괄 보정됨
  (공유 에셋은 `presentations/assets/`에 그대로 있음).
- 자료실로 복귀시키려면: 디렉토리를 `presentations/` 루트로 되돌리고 상대경로 한 단계 원복,
  `presentations/index.html` nav에 카드 추가 후 매니페스트 재생성.

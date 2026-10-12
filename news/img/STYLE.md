# 뉴스 이슈 그림 — 원칙과 제작 절차

7호(2026-10-12) 개정. 독자 반응이 "AI가 만든 티가 난다"여서 생성 카드뉴스를 버리고 아래 방식으로 바꿨다.
그림은 `news/img/<issue id>/<name>.webp`, JSON에는 `/news/img/...` 절대경로 (스키마는 `js/news.js` 상단 주석).
배포 이미지는 immutable 캐시라 내용이 바뀌면 파일명을 바꾼다.

## 원칙

- **데이터 → 코드로 그린 차트.** 생성 이미지에 숫자·글자를 굽지 않는다.
  - 카드 하단에 `자료:` 줄을 넣고, 출처와 기준 시각(예: `10.12 11시`, `10.6 일간`)을 적는다.
  - 숫자는 본문과 출처에 있는 값만 쓴다. 계산한 값은 계산값이라고 밝힌다. 기준 시각이 없는 값에 시각을 붙이지 않는다.
  - 서로 다른 차트·플랫폼 값을 한 선으로 잇지 않는다. 시간축은 날짜 수에 비례하게 그린다.
  - 제목은 평서문으로 쓰고, 장식은 넣지 않는다. 하락은 국내 증시 관례대로 청람(파랑)으로 칠한다.
- **생성 일러스트는 한 호에 최대 1장.** 캡션·alt에 `일러스트: AI 생성`을 적는다.
  - 금지 모티프: 글자·숫자·간판, 빛남·네온·반짝이·입자·떠다니는 음표, 로봇·뇌·회로, 스포트라이트·골든아워·시네마틱 조명,
    애니·지브리풍 얼굴, 보이는 얼굴, 군중·복제된 인물, 노랗거나 따뜻한 색조, 전면 그레인 필터.
- **표지 → 타이포그래피.** 제호 · 호수 · 기간 · '이번 호' 목차 4~5줄만 넣고, 그림은 넣지 않는다.

## 차트·표지 카드 (코드 렌더)

- 1600×900, 사이트 토큰을 그대로 쓴다. 종이 `#fffcf6`, 먹 `#2b2117`, 청람 `#2a4264`, 주홍 `#b0392e`, 보조 `#6e5e4a`.
  글꼴은 Gowun Batang(제목), Pretendard(본문·숫자), IBM Plex Mono(표지 날짜). 최소 글자 크기는 22px이다.
- 소스는 `news/img/tools/`에 있다. 공통 파일은 `base.css`, `svg.js`이고, 카드는 `<issue>/<name>.html`이다(데이터가 HTML 안에 있다).
  새 호는 지난 호 폴더를 복사해 데이터와 문구만 바꾼다.
- 렌더는 headless Chrome으로 scale 2 스크린샷을 찍어 1600×900으로 줄인 뒤 webp(quality 85, method 6)로 저장한다.

```bash
python news/img/tools/render.py 2026-10-12                     # 그 호의 *.html 전부
python news/img/tools/render.py 2026-10-12 money-stocks --png-dir <scratch>/out   # 한 장만, 미리보기 위치 지정
```

- 웹폰트는 네트워크에서 받는다. 미리보기 PNG를 열어 글꼴, 한글, 숫자, 라벨 겹침을 확인한다.

## 일러스트 (생성 1장)

- 스킬은 `~/.claude/skills/openrouter-imagegen`이다(사람이 그린 2000년대 웹툰 톤). 7호에 실제로 쓴 모델은 `krea/krea-2-large`(16:9, 1376×768, 장당 $0.06)이다.
- 순서: 카탈로그 확인 → 프롬프트 파일 → `--dry-run` → 1장 생성 → 표시 크기와 원본 크기에서 검수 → 수정은 최대 2회.
- 마무리: `illust.py`로 16:9 크롭 → 1600×900 → webp. 포스터라이즈는 하지 않는다.
  밝은 영역에 색이 끼었을 때만 `--neutral`을 쓴다(7호는 중립이라 쓰지 않았다).

```bash
G=~/.claude/skills/openrouter-imagegen/scripts/generate_image.py
P=news/img/tools/2026-10-12/feature-illust.prompt.txt
python -X utf8 $G --models
python -X utf8 $G --model krea/krea-2-large --prompt-file $P --out <scratch>/illust-v1.png --aspect-ratio 16:9 --dry-run
python -X utf8 $G --model krea/krea-2-large --prompt-file $P --out <scratch>/illust-v1.png --aspect-ratio 16:9
python news/img/tools/illust.py <scratch>/illust-v1.png news/img/2026-10-12/feature-illust.webp
```

7호 프롬프트는 `feature-illust.prompt.txt`에 원문 그대로 있다. 요지는 아래와 같다.

```text
Concept: late at night, one person rides home alone on a nearly empty city bus, listening to a song through
wired earphones, seen from the seat directly behind; head turned to the window so the face is hidden;
quiet, ordinary, a little tired. Nothing dramatic happens.
Medium: original digital pen drawing in the manner of a mid-2000s Korean webcomic panel; pressure-varied
ink contours; flat color areas with a few purposeful shadow shapes; no airbrushed gradients.
Color: muted night palette, cool fluorescent light with neutral whites, one small dark red accent (scarf).
Composition: 16:9, figure medium-sized in the right third, whole head in frame, calm open space on the left.
The image contains no lettering of any kind. No other passengers. No glow effects, neon, sparkles, light rays
or floating music notes. No visible face.
```

수정 이력: v1에서는 하단에 다른 승객의 머리처럼 보이는 형체와 뺨이 나왔다. v2에서는 머리가 화면 위로 잘렸다. 그래서 v3을 채택했다.

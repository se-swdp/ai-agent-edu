# ai-dlc-swdp image set

- Generation mode: Codex built-in `imagegen` (`codex exec - --skip-git-repo-check --sandbox workspace-write --output-last-message result-<slug>.txt -i style-ref.png`, prompt via stdin heredoc)
- Strict style reference: `presentations/assets/images/solution-dev-seminar/ai-answer-vs-delegation.png` (copied as `style-ref.png` in the generation workdir)
- Presentation format: WebP q86, 1672 × 941 (16:9)
- Visual system: off-white background, navy line art, pastel blue/teal/mint, tiny yellow accent, friendly Korean office workers and small robot agents

Every prompt began with this instruction block:

```text
Use your imagegen skill (built-in image_gen tool) to generate ONE image,
then copy the final file into the current workspace directory as <파일명>.png
and report the saved path.
```

## 01-cover.webp

```text
Use case: illustration-story
Asset type: 16:9 cover background for a Korean internal seminar about applying AI agents to the development and operations of a software delivery portal
Input images: Image 1 is the strict visual style reference only
Primary request: a calm cover about a development team operating their software delivery portal together with a small AI agent
Scene/backdrop: clean off-white background with a very pale blue wash; ordinary modern office
Subject: on the right third, a friendly Korean developer and a small friendly robot agent stand in front of one large portal dashboard showing a simple three-stage pipeline (source, checks, deploy) ending in a green check mark; around the dashboard float a few small tidy work objects — a log stream panel, a database cylinder, a pull-request card — connected by thin dotted lines
Style/medium: match Image 1 exactly — crisp navy line art, flat pastel blue/teal/mint fills with a tiny yellow accent, subtle soft gradients, friendly Korean business infographic cartoon
Composition/framing: wide 16:9; keep the entire left 48 percent intentionally quiet and nearly empty for HTML title text; illustration cluster stays on the right and lower-right; generous margins
Lighting/mood: bright, calm, professional
Constraints: no written text anywhere, no logos, no watermark, no title inside the image, no speech bubbles, no dark background, no 3D, no cyberpunk
Avoid: clutter in the left half, tiny UI text, humanoid robots, dramatic lighting
```

## 04-aidlc.webp

```text
Use case: infographic-diagram
Asset type: 16:9 presentation illustration for a Korean seminar on the AI-driven development lifecycle
Input images: Image 1 is the strict visual style reference only
Primary request: the human states the intent and approves key decisions, while a small AI agent carries planning, implementation, and verification through the lifecycle from inception to operations
Scene/backdrop: clean off-white to very pale blue background
Subject: a left-to-right flow across three zones labeled "Inception", "Construction", "Operations"; on the far left a Korean product owner hands a small card labeled "의도" to a friendly small robot agent; in the middle zone the robot cycles through a small circular loop of a plan document, a code window, and a test checklist; between zones stand small approval gates where a Korean reviewer places a stamp labeled "승인"; the right zone shows a calm monitoring dashboard with a dial and a green check
Style/medium: match Image 1 exactly — crisp navy line art, flat pastel blue/teal/mint fills with a tiny yellow accent, subtle soft gradients, friendly Korean business infographic cartoon
Composition/framing: wide 16:9; upper 16 percent quiet for HTML heading; three zones with clear left-to-right progression; large objects; generous margins
Text (verbatim): "Inception", "Construction", "Operations", "의도", "승인"
Constraints: render only these short labels; no title; no subtitle; no paragraph text; no logos; no watermark; no dark background; no 3D
Avoid: humanoid robot, glowing brain, dense UI, tiny pseudo-text, portraying the robot as approving its own work — approval stamps belong to the human
```

## 11-ops-systems.webp

```text
Use case: infographic-diagram
Asset type: 16:9 presentation illustration for a Korean seminar about operating a software service
Input images: Image 1 is the strict visual style reference only
Primary request: today's operations work — one on-call engineer manually cross-checks several separate systems and carries the findings between them by hand
Scene/backdrop: clean off-white to very pale blue background; ordinary office desk
Subject: a Korean engineer at a center desk, mildly busy but calm, surrounded by five separate floating screens arranged in a loose arc: a log stream panel labeled "로그", a database cylinder labeled "DB", a metrics graph labeled "지표", an issue ticket board labeled "티켓", and a code diff window labeled "코드"; thin dotted arrows hop from screen to screen through the engineer's hands, showing manual collection and cross-checking; a small clock on the desk hints at response time
Style/medium: match Image 1 exactly — crisp navy line art, flat pastel blue/teal/mint fills with a tiny yellow accent, subtle soft gradients, friendly Korean business infographic cartoon
Composition/framing: wide 16:9; upper 16 percent quiet for HTML heading; screens arranged radially around the engineer, not in a horizontal row; generous margins
Text (verbatim): "로그", "DB", "지표", "티켓", "코드"
Constraints: render only these short labels; no title; no subtitle; no paragraph text; no logos; no watermark; no dark background; no 3D
Avoid: any robot agent in this scene, fire or alarm chaos imagery, dense UI, tiny pseudo-text, humanoid robots
```

## 20-ops-loop.webp

```text
Use case: infographic-diagram
Asset type: 16:9 presentation illustration for a Korean seminar about an operations AI agent
Input images: Image 1 is the strict visual style reference only
Primary request: an operations agent runs a continuous circular loop of observe, interpret, act, and confirm, and a human reviews the pull request before it merges
Scene/backdrop: clean off-white to very pale mint background
Subject: one large circular loop diagram in the center with four stations arranged clockwise: "관찰" with a telescope watching small log and gauge panels, "해석" with a magnifier over a code window and a ticket, "실행" with the small friendly robot writing a patch and holding a pull-request card, "확인" with a test checklist and a small green-check dashboard; the small robot travels along the loop; slightly outside the circle next to the "실행" station, a Korean reviewer receives the pull-request card and places an approval stamp before the flow continues
Style/medium: match Image 1 exactly — crisp navy line art, flat pastel blue/teal/mint fills with a tiny yellow accent, subtle soft gradients, friendly Korean business infographic cartoon
Composition/framing: wide 16:9; radial circular composition with clear clockwise arrows; upper 16 percent quiet for HTML heading; generous margins
Text (verbatim): "관찰", "해석", "실행", "확인"
Constraints: render only these short labels, each exactly once; no title; no subtitle; no paragraph text; no logos; no watermark; no dark background; no 3D
Avoid: horizontal row of cards, robot merging its own work, dense UI, tiny pseudo-text, humanoid robot
```

## 23-mcp-hub.webp

```text
Use case: infographic-diagram
Asset type: 16:9 presentation illustration for a Korean seminar about agent context connections
Input images: Image 1 is the strict visual style reference only
Primary request: the agent reasons with connected verified context — one agent hub linked to six sources of operational knowledge
Scene/backdrop: clean off-white to very pale blue background
Subject: a friendly small robot agent at the center as a hub; six evenly spaced spokes connect to six source nodes arranged in a circle around it: a database cylinder labeled "DB", a log stream panel labeled "로그", a metrics gauge labeled "지표", a code repository window labeled "코드", a ticket board labeled "업무", and an open knowledge book labeled "지식"; each spoke ends in a small standardized plug where it meets the hub, suggesting one common connection contract
Style/medium: match Image 1 exactly — crisp navy line art, flat pastel blue/teal/mint fills with a tiny yellow accent, subtle soft gradients, friendly Korean business infographic cartoon
Composition/framing: wide 16:9; symmetric hub-and-spoke radial composition; upper 16 percent quiet for HTML heading; generous margins
Text (verbatim): "DB", "로그", "지표", "코드", "업무", "지식"
Constraints: render only these short labels, each exactly once; no title; no subtitle; no paragraph text; no logos; no watermark; no dark background; no 3D
Avoid: horizontal row of cards, tangled cables, dense UI, tiny pseudo-text, humanoid robot, glowing brain
```

## 30-autonomy-ladder.webp

```text
Use case: infographic-diagram
Asset type: 16:9 presentation illustration for a Korean seminar about staged agent autonomy
Input images: Image 1 is the strict visual style reference only
Primary request: agent autonomy grows step by step as verification matures, and the human keeps the final gate before merge and deploy
Scene/backdrop: clean off-white to very pale blue background
Subject: a wide staircase of four ascending steps from lower left to upper right; on step one a small friendly robot observes small dashboards with binoculars, labeled "관찰"; on step two the robot writes a draft document, labeled "초안"; on step three the robot holds up a pull-request card with a passing test checklist, labeled "PR"; on step four the robot runs a small tidy task by itself, labeled "자동"; at the top right a Korean reviewer stands at a simple gate with a stamp, labeled "승인", guarding the path to a deploy button
Style/medium: match Image 1 exactly — crisp navy line art, flat pastel blue/teal/mint fills with a tiny yellow accent, subtle soft gradients, friendly Korean business infographic cartoon
Composition/framing: wide 16:9; ascending staircase from lower left to upper right; upper 16 percent quiet for HTML heading; generous margins
Text (verbatim): "관찰", "초안", "PR", "자동", "승인"
Constraints: render only these short labels, each exactly once; no title; no subtitle; no paragraph text; no logos; no watermark; no dark background; no 3D
Avoid: robot bypassing the gate, elevator or rocket metaphors, dense UI, tiny pseudo-text, humanoid robot
```

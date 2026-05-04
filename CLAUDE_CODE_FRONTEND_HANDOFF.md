# Claude Code Frontend Handoff

This repo is for a 2026 Museeksoul / 惠歆音樂社 event website. The next task is to plan, then likely implement, a Vite + React frontend inside this repo.

Please start in Plan Mode and use this file as an orientation guide, not as a complete substitute for reading the repo. The existing planning docs and JSON files are the source of truth.

## Project Goal

Build a static, mobile-first event website for participants and parents.

The website should be a polished preview-ready framework, not a rough wireframe. Final copy and some final assets may still change, so the implementation should keep content replaceable and avoid hardcoding duplicated data inside React components.

Confirmed scope:

- Static frontend only.
- No backend.
- No database.
- No login.
- Vite + React.
- Normal routes, not hash routes.
- Deployment target is likely Cloudflare Pages, so SPA fallback should be considered.

Routes:

- `/` for the home page.
- `/dounan` for the Dounan event page.
- `/zhubei` for the Zhubei event page.

## Read These Files First

Read in this order:

1. `project-progress.md`
   - Understand confirmed decisions, prior commits, and open discussion points.

2. `event-website-spec.md`
   - Main product requirements.
   - Especially page structure, content principles, section requirements, and first-version expectations.

3. `engineering-plan.md`
   - Engineering rationale and data/component boundaries.
   - Important warnings about not over-genericizing venue and schedule sections.

4. `visual-style-guide.md`
   - Visual direction.
   - The site should feel like an elegant grass concert invitation / program booklet.

5. Data files in `data/`
   - Treat these as implementation data sources.

Useful optional references:

- `gemini-visual-prompt.md`
  - Helpful if you need a compact summary of visual language.
- `mockups/*.svg`
  - Existing program-section UI explorations.
- `source-materials/`
  - Raw source assets. Copy frontend-used assets into `public/assets` or an equivalent public asset folder rather than referencing `source-materials` directly from production UI.

## Current Repo Shape

Important files and folders:

```txt
data/
  events.json
  venue.dounan.json
  venue.zhubei.json
  schedules.public.json
  programs.dounan.json
  contacts.json

source-materials/
  dounan/
    venue/
    schedule/
    programs/
  zhubei/
    venue/
    schedule/
    programs/

mockups/
  program-option-*.svg

event-website-spec.md
engineering-plan.md
visual-style-guide.md
project-progress.md
```

There is not yet a Vite app scaffold at the time this handoff was written.

## Data Source Boundaries

Avoid duplicating the same factual content in React components. Prefer importing JSON or using small data loader/helper modules.

Use these files as follows:

| File | Use |
| --- | --- |
| `data/events.json` | Global site identity, event title, routes, event IDs, and pointers to other data files. Do not turn this into a giant content bucket. |
| `data/venue.dounan.json` | Dounan venue details, C zone guidance, maps, coordinates, and lost-section data. |
| `data/venue.zhubei.json` | Zhubei venue details and indoor arrival process. Use placeholders for unknown business-building details. |
| `data/schedules.public.json` | Public participant-facing schedule image config for both events. Render schedule images directly. |
| `data/programs.dounan.json` | Only source for Dounan program accordion and search. |
| `data/contacts.json` | Shared contact section data. |

Important rules:

- Do not rebuild schedule images as timeline cards or duplicate text data.
- Do not display teacher/internal schedule images on the public site.
- Do not use `data/programs.dounan.json` for Zhubei.
- Do not invent missing venue details, addresses, floors, map links, LINE IDs, or contact info. Show `待補`, `待定`, or `圖片待補` where appropriate.
- Do not hide missing-but-expected contact rows just because links are not ready.

## Suggested Vite + React Structure

This is a suggested shape. Adjust if the implementation benefits from a cleaner local pattern, but keep the same conceptual boundaries.

```txt
src/
  main.jsx
  App.jsx
  styles/
    global.css
    tokens.css
  data/
    siteData.js
  pages/
    HomePage.jsx
    EventPage.jsx
  components/
    EventHero.jsx
    SectionNav.jsx
    DounanVenueSection.jsx
    ZhubeiVenueSection.jsx
    DounanScheduleSection.jsx
    ZhubeiScheduleSection.jsx
    DounanProgramSection.jsx
    ZhubeiProgramSection.jsx
    ProgramAccordion.jsx
    ScheduleImageGallery.jsx
    ImageLightbox.jsx
    DounanLostSection.jsx
    ContactSection.jsx
    MapButton.jsx
    PlaceholderBox.jsx
  utils/
    programSearch.js
    assetPath.js
```

Likely public assets:

```txt
public/
  assets/
    dounan/
      venue/
      schedule/
    zhubei/
      venue/
      schedule/
      programs/
```

## Page Model

### Home Page

Source data:

- `data/events.json`

Displays:

- `Museeksoul 惠歆音樂社`
- `2026`
- `屬於我的這首歌`
- Short helper text from existing event metadata.
- Two large mobile-friendly event entry buttons:
  - `斗南場`
  - `竹北場`

Do not put schedule, program, or venue detail on the home page. The home page is primarily a graceful event entrance and venue-selection screen.

### Dounan Event Page

Sections:

- Event top / hero.
- Sticky section nav.
- `DounanVenueSection`.
- `DounanScheduleSection`.
- `DounanProgramSection`.
- `DounanLostSection`.
- `ContactSection`.

Navigation labels:

- `場地資訊`
- `時間表`
- `節目表`
- `我迷路了`
- `聯絡我們`

### Zhubei Event Page

Sections:

- Event top / hero.
- Sticky section nav.
- `ZhubeiVenueSection`.
- `ZhubeiScheduleSection`.
- `ZhubeiProgramSection`.
- `ContactSection`.

Navigation labels:

- `場地資訊`
- `時間表`
- `節目表`
- `聯絡我們`

Do not show the lost section for Zhubei.

## Component Guidance

### Venue Sections

Use separate main components:

- `DounanVenueSection`
- `ZhubeiVenueSection`

They may share small UI components like buttons, placeholder boxes, images, or cards, but avoid one large generic `VenueSection` full of optional fields.

Dounan is outdoor grass / village-zone navigation.

Zhubei is indoor business-building arrival guidance.

### Schedule Sections

Use separate section wrappers:

- `DounanScheduleSection`
- `ZhubeiScheduleSection`

They can both use `ScheduleImageGallery` and `ImageLightbox`.

The schedule section should render the public participant-facing image from `data/schedules.public.json`.

Image behavior:

- Full container width on mobile.
- Do not crop important content.
- Tap/click opens a lightbox/modal.
- Lightbox has a clear close button.
- No carousel.
- No download button.

### Program Sections

Dounan:

- Use `data/programs.dounan.json`.
- Render as accordion.
- Default all accordion groups collapsed.
- Accordion title should make teacher and time clear.
- Expanded content shows student program details.
- If details are missing, show `節目明細待補`.
- Include search.

Dounan search:

- Search teacher name, student name, and piece title.
- Search across morning and afternoon.
- Execute search on input blur/unfocus, not on every keystroke.
- Clearing search restores the full accordion view.
- When search has results, show only matching result cards, grouped by teacher/session as appropriate.
- When there are no results, show `查無結果`.
- Keep search derived from `data/programs.dounan.json`; do not create a second search dataset.

Zhubei:

- Do not data-model the program.
- Show the existing program image:
  - `source-materials/zhubei/programs/zhubei-program-sheet-01.png`
- Copy it to a public asset path before using it in the app.
- Make it openable in the same image lightbox/modal.
- Show a small placeholder note like `節目表說明待補`.
- No search.
- No accordion.

### Contact Section

Use `data/contacts.json`.

Respect status/link behavior fields if present. If a contact method is not ready, still show it as pending instead of silently removing it.

## Visual Direction

Use `visual-style-guide.md` as the source of truth.

Core feel:

- Elegant.
- Warm.
- Formal but approachable.
- Parent-friendly.
- Music recital / program booklet.
- White or warm-white space.
- Vermilion accents.
- Fine botanical lines.
- Piano-line or music-note details.
- Classical serif headings.

Suggested colors from the guide:

- Background white: `#fffdf8`
- Warm ivory: `#f8f1e8`
- Main vermilion: `#d93616`
- Deep vermilion: `#b92d17`
- Soft orange red: `#e85b1b`
- Text black: `#1f1b18`
- Secondary brown gray: `#76685f`
- Fine-line beige brown: `#d8b9a6`
- Pale card background: `#fbf6ef`

Avoid:

- Loud colorful school-club poster feeling.
- Heavy gradients.
- Glassmorphism.
- Cartoon-heavy decoration.
- Dark nav bars.
- Overly generic SaaS dashboard styling.
- A rough wireframe look.

## Mobile-First Requirements

Prioritize mobile ergonomics throughout.

Pay special attention to:

- Home page event buttons should be large and obvious.
- Sticky nav should be horizontally scrollable or otherwise easy to tap on mobile.
- Accordion headers should be large enough to tap comfortably.
- Lightbox close button must be obvious on small screens.
- Images must not be cropped in a way that loses important information.
- Text must not overflow buttons, cards, nav tabs, or image captions.

## Implementation Planning Checklist

In Plan Mode, please inspect and decide:

1. Whether to scaffold Vite in the repo root or in a subdirectory.
   - Preferred unless there is a reason otherwise: repo root, because current data/docs are already root-level project assets.

2. How JSON files will be imported.
   - Direct imports from `../data/...` may work with Vite, but consider whether keeping data at repo root is clean enough.
   - Do not move source data unless the plan explains why.

3. Which source assets should be copied into `public/assets`.
   - Keep names English and clear.
   - Do not rely on raw `source-materials/...` paths in production UI.

4. Which components own state.
   - Search state belongs in `DounanProgramSection`.
   - Lightbox state may live in gallery/image components.
   - Page selection should come from the route.

5. How SPA fallback will be handled for Cloudflare Pages.
   - Plan for direct visits to `/dounan` and `/zhubei`.

6. What verification will be run.
   - At minimum: install/build check.
   - Prefer also running the dev server and visually checking desktop/mobile routes if available.

## First-Version Acceptance Criteria

The first implementation should satisfy:

- Vite + React app exists and runs.
- `/`, `/dounan`, and `/zhubei` routes work.
- Home page uses event data and has two strong mobile-friendly event buttons.
- Dounan and Zhubei pages have sticky section navigation.
- Dounan venue and Zhubei venue are separate components.
- Schedule images render from schedule config and open in lightbox.
- Teacher/internal schedule images are not shown.
- Dounan program renders from `data/programs.dounan.json`.
- Dounan program search works on blur.
- Zhubei program renders as an image, not as Dounan-style JSON accordion.
- Dounan lost section is prominent.
- Zhubei has no lost section.
- Contacts render from `data/contacts.json`.
- Missing content is labeled clearly instead of invented.
- Visual design follows the warm white / vermilion / elegant program-booklet direction.

## Important Non-Goals

Do not implement:

- Backend.
- Database.
- Authentication.
- Admin CMS.
- Overly complex content pipeline.
- Rebuilt schedule timeline.
- Teacher-only internal workflow content.
- Final production copy beyond what is already in JSON/docs.

## Suggested Working Style

Please first produce a plan that references the actual files you inspected. The plan should identify:

- Final project structure.
- Data import approach.
- Asset-copy approach.
- Component map.
- Search/lightbox interaction approach.
- Build and QA steps.

Then implement with scoped commits or clear file changes.

When uncertain, prefer the existing docs and JSON files over inference. If content is missing, mark it as pending in the UI rather than inventing it.

# Stagewoven

**Every cue. Every change. In sync.**

Marketing website and interactive product demonstration for Stagewoven, an AI-assisted production cue planning platform for theatre companies, touring productions and live-event teams.

- Domain: stagewoven.top
- Founder: Salim Abdulrahman
- Contact: nneka@stagewoven.top

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · React Router · Lucide React · Recharts (one chart in the workspace overview).

No API keys or backend are required. The demo runs entirely on local mock data and browser state.

## Getting started

```bash
npm install
npm run dev        # start the dev server at http://localhost:5173
npm run build      # type-check and build for production into dist/
npm run preview    # serve the production build locally
```

Requires Node 20 or later.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/product` | Product features (with demo vs. integration labels) |
| `/how-it-works` | Four-step walkthrough |
| `/use-cases` | Stage managers, designers, touring, companies |
| `/pricing` | Illustrative pricing with monthly/annual toggle |
| `/about` | Company story and principles |
| `/contact` | Contact and demo-request forms (`?type=demo`) |
| `/workspace/*` | Interactive demo: Overview, Productions, Scripts, Cue Sheets, Review Queue, Team, Settings |

The workspace is lazy-loaded so the marketing pages stay light.

## Project structure

```
src/
  components/
    layout/      Navbar, Footer, SiteLayout
    marketing/   Hero, change-detection and dashboard previews, shared blocks
    ui/          Button, Section, Field, StageScene, Logo, loading/empty/error states
  data/          Company info, navigation, roles, pricing (edit prices in pricing.ts)
  lib/           Helpers (class names, per-page title/meta)
  pages/         Marketing pages
  workspace/
    seed.ts      "The Last Train": scenes, two script drafts, cues, team
    compare.ts   Line-level revision diff and affected-cue detection
    store.tsx    Reducer + context, persisted to localStorage
    views/       Workspace screens
```

## Demo walkthrough

1. Open `/workspace` and choose **Compare Revisions** (or go to Scripts).
2. Draft 3 and draft 4 are shown side by side. Elias's line "The train has arrived." is removed, and Mara's reply is reworded.
3. SND-014 and LX-021 (anchored to the removed line) are flagged high priority; LX-022 (reworded line) is flagged medium. Each flag explains why and, where possible, suggests a new anchor.
4. In the **Review Queue**, assign the review, apply the suggested trigger, edit the cue, mark it reviewed or approve the revised cue.
5. **Cue Sheets** supports search, filters (department, scene, status), inline status changes, the cue editor and CSV export.
6. **Settings** lets you turn off browser persistence or reset the sample data.

## What is simulated

- **Change detection** is a deterministic, rule-based comparison of two seeded drafts in the browser. No AI or comparison service is connected; the UI says so wherever results appear.
- **Rehearsal transcription** is presented as integration-dependent and is not demonstrated.
- **Forms** validate on the client and simulate submission; nothing is sent. Connect a form backend in `src/pages/Contact.tsx`.
- **Pricing** figures are illustrative and live in `src/data/pricing.ts`.
- **Imagery** uses art-directed SVG scenes (`StageScene`). Pass a `src` prop to swap in licensed photography.
- Stagewoven does not control lighting desks, sound consoles or show equipment, and the site never claims it does.

## Deployment

The site is a single-page app. When hosting, rewrite all unknown paths to `index.html` so deep links such as `/workspace/review` load correctly.

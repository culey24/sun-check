# SunCheck

Web app that pairs with a UV-sensitive photochromic sticker. The app scans the
sticker's color and alerts you to reapply sunscreen when it turns dark.

See [`docs/SPEC.md`](docs/SPEC.md) for product and behavior, and
[`docs/BRAND_GUIDELINE.md`](docs/BRAND_GUIDELINE.md) for visual direction.

## Stack

React + Vite + TypeScript + TailwindCSS.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # typecheck + production build
npm run preview  # serve the production build
npm run typecheck
```

## MVP behavior

- **Home** — value prop and entry point.
- **Scan** — live camera with a circular sticker guide; if no camera is available,
  use the **Demo: light** / **Demo: dark** buttons to run the pipeline on a
  synthetic frame.
- **Result** — shows the detected state, sampled color, and confidence; shows a
  prominent reapply alert when the sticker is dark.
- **History** — recent scans stored locally in the browser.

Analysis is a heuristic (average luminance of the frame center) and is intended to
be replaced by real photochromic color detection later.

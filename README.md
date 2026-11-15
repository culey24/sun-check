# Uvie

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

Or use the Makefile: `make install`, `make dev`, `make build`, `make preview`,
`make typecheck`, `make samples`, `make clean` (`make help` lists them).

## MVP behavior

- **Home** — value prop, entry point, and the **local UV index** for Ho Chi Minh City
  (live from [Open-Meteo](https://open-meteo.com), no API key): current value and WHO
  level, hourly chart, today's peak, and a warning when UV is high (≥ 6) or will be
  later today. Refreshes every 15 minutes; the last reading is cached for offline use.
  To test the warnings at night, open any page with `?uv=9` (stays on for the tab;
  `?uv=off` resets).
- **Scan** — live camera with a circular sticker guide. Under **Test with sample
  photos**, pick a photo of the sticker on a hand (fresh → fully dark) to show it in
  the viewfinder, then tap **Capture** to run the real analysis on it.
- **Result** — shows the detected state, sampled color, and confidence; shows a
  prominent reapply alert when the sticker is dark.
- **History** — recent scans stored locally in the browser. When empty, **Load sample
  data** fills it with a day of example scans.

### Sample photos

`public/samples/*.jpg` are rendered by `scripts/generate_sample_photos.py`
(Python 3 + Pillow + NumPy). Re-run it to regenerate them; it prints the center
luminance each photo will measure (threshold: 120).

Analysis is a heuristic (average luminance of the frame center) and is intended to
be replaced by real photochromic color detection later.

## Deploy to Render

This is a static site (no server), so it deploys as a Render **Static Site**.
[`render.yaml`](render.yaml) is a Blueprint that configures it.

**1. Push to Git.** Render deploys from a Git repo, so push this project to
GitHub/GitLab/Bitbucket first.

**2. Create the service.** In the [Render Dashboard](https://dashboard.render.com):
*New* → *Blueprint*, connect the repo, and click **Apply**. Render reads
`render.yaml` and creates the site.

Equivalently, create a *Static Site* manually with:

| Setting | Value |
| --- | --- |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| Environment Variable | `NODE_VERSION=22` |

**3. SPA routing.** Client-side routes (`/scan`, `/result`, `/history`) only work if
unknown paths fall back to `index.html`. `render.yaml` sets this rewrite rule:

```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

If you create the site by hand instead of via the Blueprint, add the same rule
under the service's **Redirects/Rewrites** tab.

**Notes**

- Camera access (`getUserMedia`) requires HTTPS. Render serves HTTPS by default.
- `autoDeployTrigger: commit` redeploys on every push to the connected branch.

Validate the Blueprint locally with the [Render CLI](https://render.com/docs/cli):

```bash
render blueprints validate render.yaml
```

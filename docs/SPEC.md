# SPEC — Uvie (UV Sunscreen Sticker App)

## 1. Overview

A web app that works together with a **UV-sensitive photochromic sticker** worn on the
skin. The sticker changes color when exposed to UV light and stays in its original color
while covered by a layer of sunscreen. The app scans the sticker's color with the device
camera and, when it detects the sticker has turned dark (meaning sunscreen has worn off),
it alerts the user to **reapply sunscreen**.

- **Language:** English (UI copy in English)
- **Tech stack:** React + Vite + TailwindCSS
- **First goal (MVP):** Ship a UI that satisfies the most basic need — scan the sticker,
  read its state, and show a timely "reapply sunscreen" alert.

## 2. Mechanism

The photochromic pigment reacts to direct UV light:

- **Exposed to direct sun / UV:** the sticker **changes color** (turns dark).
- **Covered by sunscreen:** the sticker **keeps its original (light) color**, because the
  sunscreen blocks the UV rays.

App logic keyed to this behavior:

- Sticker **light** → sunscreen is still effective → OK.
- Sticker **dark** → sunscreen has worn off / UV is reaching the skin → **alert to reapply**.

## 3. Physical Sticker — Reference (Hardware Note)

This section documents how the physical sticker is made. It is context for the app, not
something the app builds.

**Materials**

- Photochromic pigment (color-changing under UV light).
- Hydrocolloid patch or transparent medical tape (as the sticker base).
- Medical gel or a dissolving solvent.

**Fabrication steps**

1. **Mix:** Blend the photochromic pigment into the medical solvent to form a thick ink.
2. **Coat:** Spread a very thin, even layer of the ink on the non-sticky face of the patch
   / medical tape.
3. **Dry & Cut:** Dry in dark room conditions (avoid direct sunlight, which would activate
   the sticker early). Use a hole punch to cut small circular stickers.

**Sample test**

- Stick a sticker on the back of the hand, apply sunscreen over it. Expose to sun (or a UV
  lamp): the sticker keeps its color because the cream blocks UV. Wipe the cream off with a
  wet cloth (simulating sweat washing it away): the sticker immediately turns dark.

## 4. MVP Scope

The MVP is **UI-first**. It must be runnable and demoable with mock data before real
color-detection is wired up.

### 4.1 Screens

1. **Home / Landing**
   - Product name and one-line value proposition.
   - Primary CTA: "Scan sticker".
   - Short "How it works" explainer.

2. **Scan**
   - Live camera viewfinder (getUserMedia) with an alignment guide over the sticker.
   - Capture button.
   - Permission and error states (no camera, denied, unsupported browser).

3. **Result**
   - Shows the detected sticker state: **Protected** (light) vs **Reapply** (dark).
   - Color swatch / sample of the detected sticker color.
   - Confidence indicator.
   - Clear call to action based on state.

4. **Alert / Reminder**
   - Prominent "Reapply sunscreen" prompt when the sticker is dark.
   - Recommended action, dismiss/snooze options.

5. **History** (basic)
   - List of past scans with timestamp and detected state.

### 4.2 Out of Scope for MVP

- Real photochromic color analysis / computer vision (mocked behind an interface first).
- User accounts, authentication, cloud sync.
- Push notifications.
- Native mobile apps.

## 5. Functional Requirements

- FR-1: User can open the camera and see a live preview.
- FR-2: User can capture a frame of the sticker and submit it for analysis.
- FR-3: The app classifies the sticker as **Protected** or **Reapply** based on color.
- FR-4: The app shows a clear alert when the state is **Reapply**.
- FR-5: The app keeps a basic local history of scans.
- FR-6: All essential flows work with mock analysis data in the MVP.

## 6. Non-Functional Requirements

- Responsive, mobile-first layout (the scanning flow is phone-centric).
- Clear, accessible UI: readable contrast, large tap targets, keyboard/screen-reader
  friendly where applicable.
- Fast first paint; simple client-side state; no backend required for the MVP.
- All UI copy in English.

## 7. Proposed Project Structure

Implemented with **TypeScript** (`.tsx`) — confirmed with the project owner.

```
src/
  main.tsx
  App.tsx
  index.css
  pages/
    Home.tsx
    Scan.tsx
    Result.tsx
    History.tsx
  components/
    Layout.tsx
    CameraView (inlined in Scan) / StickerGuide.tsx
    StatusBadge.tsx
    AlertBanner.tsx
    Card.tsx
    Button.tsx
  lib/
    types.ts            # ScanResult, StickerState
    analyzeSticker.ts   # center-sample luminance heuristic (MVP)
    capture.ts          # video frame -> JPEG data URL
    sampleFrame.ts      # synthetic frame for camera-less demos
    history.ts          # localStorage helpers
  hooks/
    useCamera.ts        # getUserMedia lifecycle
```

## 8. Design & Brand

Visual direction and tokens live in `BRAND_GUIDELINE.md`. This document defines behavior;
that document defines look and feel.

## 9. Open Questions

- What exact sticker colors define "Protected" vs "Reapply" thresholds?
- How often should the reminder repeat while the state stays dark?
- Should analysis run on-device or via a server later?
- Which reminder channels beyond in-app alerts are wanted (email, push, SMS)?

## 10. Roadmap

- **Phase 1 (done):** UI with mock analysis, all screens navigable.
- **Phase 2:** Real camera capture → color sampling → classification.
- **Phase 3:** Reminder scheduling and notification integration.
- **Phase 4:** Accounts, sync, analytics.
```

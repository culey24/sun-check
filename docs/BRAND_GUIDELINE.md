# BRAND GUIDELINE — (Working Draft)

> Temporary foundation. Expect changes as the brand matures.

## 1. Brand Name

**Uvie** — the product name.

## 2. Positioning

A simple, trustworthy companion for sun protection. The product helps people know when to
reapply sunscreen, without guesswork.

- **Tone:** Clear, calm, reassuring. No alarmism, no jargon.
- **Voice:** Direct and human. Prefer "Reapply your sunscreen" over "UV threshold exceeded".

## 3. Logo

- Not finalized. Use the wordmark "Uvie" set in the primary typeface for now.
- Keep clear space of at least the height of the "U" on all sides.
- Never stretch, recolor arbitrarily, or add effects.

## 4. Color

Colors should communicate state clearly, since the app is about a color-changing sticker.

### Core palette

| Token         | Hex       | Use                                     |
| ------------- | --------- | --------------------------------------- |
| `primary`     | `#0EA5E9` | Primary actions, links, brand accent    |
| `primary-700` | `#0369A1` | Hover / pressed states                  |
| `neutral-900` | `#0F172A` | Primary text                            |
| `neutral-600` | `#475569` | Secondary text                          |
| `neutral-100` | `#F1F5F9` | Surfaces, backgrounds                   |
| `white`       | `#FFFFFF` | Cards, base background                  |

### Status palette

| Token       | Hex       | Meaning                         |
| ----------- | --------- | ------------------------------- |
| `success`   | `#16A34A` | Protected — sunscreen effective |
| `warning`   | `#F59E0B` | Watch — borderline / low confidence |
| `danger`    | `#DC2626` | Reapply — sunscreen worn off    |

> Note: `primary` is blue, deliberately distinct from the yellow→dark sticker gradient so
> status colors are never confused with the product's accent color.

## 5. Typography

- **Primary typeface:** Inter (system fallback: `ui-sans-serif`, `system-ui`).
- **Scale:**
  - Display: 32px / 700
  - Heading: 24px / 600
  - Body: 16px / 400
  - Caption: 13px / 400

## 6. Spacing & Layout

- 8px base spacing scale (Tailwind defaults: 1 = 4px, 2 = 8px, 4 = 16px, ...).
- Mobile-first. Rounded corners (`rounded-xl`/`rounded-2xl`) for cards and buttons.
- Generous whitespace; one primary action per screen.

## 7. Components (Baseline)

- **Button:** solid primary for the main action, outline for secondary, min height 44px.
- **Card:** white surface, subtle shadow, `rounded-2xl`, 16–24px padding.
- **Status badge:** pill using status palette with an icon + label.

## 8. Imagery & Iconography

- Icons: simple line icons, 2px stroke.
- Prefer real photography of the sticker on skin over abstract graphics.

## 9. Tailwind Mapping (Starter)

```js
// tailwind.config.js (draft)
export default {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0EA5E9', 700: '#0369A1' },
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

## 10. Accessibility

- Text contrast: meet WCAG AA (4.5:1 for body text).
- Never rely on color alone — pair every status color with an icon and a text label.

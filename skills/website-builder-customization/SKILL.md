---
name: website-builder-customization
description: Build and maintain a no-code website builder SaaS with a multi-template selector, live customization panel (accent color, fonts, background image with opacity, logo upload), responsive scaled iframe previews (Desktop/Tablet/Mobile), form-based content editing, Stripe/PayMongo payments, and correct state-reset behavior when users navigate between templates. Use this skill when building or extending a website builder product that lets users pick a template, customize it visually, preview it at multiple viewport sizes, and pay to download or launch it.
---

# Website Builder Customization Skill

## Overview

This skill covers the full development loop for a website builder SaaS built on the tRPC + React + Tailwind stack. It captures battle-tested patterns for template selection, visual customization, scaled iframe previews, state management, and payment checkout.

Read `references/patterns.md` for full code examples and component patterns.

---

## Workflow

### 1. Template Selector

- Define each template as a typed object in `client/src/lib/templates.ts` with `id`, `name`, `description`, `fields[]`, and `defaultData`.
- Render a grid of cards; each card has a **Preview** button (opens `TemplatePreviewModal`) and a **Select / Selected** toggle button.
- On template change, reset `formData` to the new template's `defaultData` — never carry over form values from a previous template.

### 2. Customization Panel (`CustomizationPanel.tsx`)

The panel exposes these settings via a `CustomizationSettings` interface:

| Field | Type | Notes |
|---|---|---|
| `accentColor` | `string` | Hex; preset swatches + color picker |
| `primaryFont` | `string` | Headline font; Google Fonts dropdown |
| `secondaryFont` | `string` | Body font; Google Fonts dropdown |
| `fontColor` | `string` | Hex; preset swatches + color picker |
| `backgroundImage` | `string \| undefined` | Base64 data URL from crop |
| `backgroundOpacity` | `number` | 0–1; controls white overlay intensity |
| `logo` | `string \| undefined` | Base64 data URL from crop |

**Background image opacity** — use a white overlay (`rgba(255,255,255, 1 - opacity)`) layered on top of the image, NOT a dark overlay. Slider right (1.0) = full image visible; slider left (0.0) = fades to white. Apply the same overlay in both the panel preview and the HTML generator so they match.

**Upload button** — replace raw `<input type="file">` with a styled full-width button that triggers a hidden `<input ref>`. Show a live 16:9 thumbnail once an image is uploaded, with **Change Image** and **Remove** buttons below it.

**Logo upload** — same pattern; crop to square (1:1) using a canvas cropper before storing as base64.

### 3. HTML Generator (`htmlGenerators.ts`)

- Export `generateHTML(template, formData, customization)` returning a self-contained HTML string.
- Apply background image via a `getHeroBackground(customization)` helper that injects inline CSS plus an overlay `<div>` into the hero section:

```ts
function getHeroBackground(c: CustomizationSettings): string {
  if (!c.backgroundImage) return `background-color: ${c.accentColor};`;
  const overlayAlpha = (1 - c.backgroundOpacity).toFixed(2);
  return `background-image: url('${c.backgroundImage}'); background-size: cover; background-position: center; position: relative;`;
  // Add sibling overlay div: background: rgba(255,255,255,${overlayAlpha}); position:absolute; inset:0;
}
```

- Embed Google Fonts via `<link>` in `<head>`.
- Always include `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.

### 4. Scaled Iframe Preview (`FullPagePreviewModal.tsx`)

**Problem:** Without a fixed canonical width the Desktop iframe renders at container width, triggering different CSS breakpoints than Tablet/Mobile, making all three views look inconsistent.

**Fix:** Render each iframe at its canonical viewport width and use `transform: scale()` to fit it into the available container — the same technique used by Figma and Webflow.

| View | Canonical width | Frame |
|---|---|---|
| Desktop | 1280 px | None |
| Tablet | 768 px | Tablet bezel |
| Mobile | 375 px | Phone bezel |

Use a `ScaledIframePreview` component with a `ResizeObserver` to recalculate the scale factor on container resize:

```ts
const scale = containerWidth / canonicalWidth;
// iframe style: width=canonicalWidth, transform=`scale(${scale})`, transformOrigin='top left'
// wrapper height = (iframeNaturalHeight * scale) to prevent clipping
```

See `references/patterns.md` for the full component.

### 5. State Reset on Template Navigation

When the user clicks **"← Change Template"** (without having launched), reset ALL state. Define the default outside the component to avoid unstable references:

```ts
// Module level — outside the component
const DEFAULT_CUSTOMIZATION: CustomizationSettings = {
  accentColor: "#7a9b7f",
  primaryFont: "Merriweather",
  secondaryFont: "Lato",
  fontColor: "#2c3e50",
  backgroundOpacity: 0.9,
  logo: undefined,
  backgroundImage: undefined,
};

// Inside the component
const resetAllState = (template: TemplateType = selectedTemplate) => {
  setFormData({ ...TEMPLATES[template].defaultData });
  setCustomization({ ...DEFAULT_CUSTOMIZATION });
};

// On the "← Change Template" button
onClick={() => { resetAllState(); setShowTemplateSelector(true); }}
```

This clears: form data, accent color, fonts, font color, background image, logo, and opacity.

### 6. Payment Checkout

Two paid actions: **Download** (HTML file) and **Launch** (hosted website).

- Open `window.open("", "_blank")` **synchronously** in the click handler before any `await` — browsers block `window.open()` called after an async operation.
- After the mutation resolves, redirect the opened window to `result.checkoutUrl`.
- Pass `htmlContent` (the generated HTML string), `siteName`, and `templateId` to the checkout mutation so the server can store the file and create the payment link.
- On webhook success, retrieve the stored HTML and serve it for download or deploy it.

For Stripe: use `stripe.checkout.sessions.create()`. For PayMongo: use `createSource` or `createPaymentIntent` depending on the payment method.

---

## Common Pitfalls

**Background opacity mismatch** — if the panel uses a white overlay but the HTML generator uses a dark overlay (or vice versa), the preview and the downloaded file will look different. Always use the same overlay approach in both places.

**Iframe breakpoint mismatch** — without a fixed canonical width, the Desktop iframe renders at container width and may not trigger the same `@media` breakpoints as Tablet/Mobile. Always fix the iframe width and use `transform: scale()`.

**State not cleared on template change** — if `formData` or `customization` is not reset when the user goes back to the template selector, old data bleeds into the new template. Always call `resetAllState()` before `setShowTemplateSelector(true)`.

**Popup blocker on async checkout** — calling `window.open()` after an `await` is blocked by most browsers. Always open the window synchronously in the click handler, then redirect it after the async call resolves.

**Removing a `backgroundStyle` field** — if you previously had `backgroundStyle: "solid" | "gradient" | "image"`, removing it requires updating: the `CustomizationSettings` interface, the initial state in `Home.tsx`, `CustomizationPanel.tsx`, `htmlGenerators.ts`, and any preview modals that pass a default customization object. Missing any one of these causes TypeScript errors.

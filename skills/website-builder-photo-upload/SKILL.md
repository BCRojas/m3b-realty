---
name: website-builder-photo-upload
description: "Add photo upload slots to templates in the Website Builder SaaS app (project: website_builder). Covers the full end-to-end workflow: extending CustomizationSettings, CropperTarget, CROPPER_ASPECTS/LABELS, useRef/inputRefs, toast labels, CustomizationPanel JSX cards, htmlGenerators.ts CSS+HTML, and Home.tsx DEFAULT_CUSTOMIZATION. Use this skill whenever a user asks to add, replace, or remove photo upload fields in any website builder template (Restaurant, Coffee Shop, Professionals, Portfolio, etc.)."
---

# Website Builder — Photo Upload Slot Workflow

## Overview

Adding a photo upload slot to a template touches **6 files** in a fixed order. Complete all 6 steps for every new photo field; skipping any step causes TypeScript errors or missing UI.

| Step | File | What to change |
|------|------|----------------|
| 1 | `client/src/lib/htmlGenerators.ts` | Add field to `CustomizationSettings` interface |
| 2 | `client/src/components/CustomizationPanel.tsx` | Add to `CustomizationSettings`, `CropperTarget`, `CROPPER_ASPECTS`, `CROPPER_LABELS`, `useRef`, `inputRefs`, toast labels |
| 3 | `client/src/components/CustomizationPanel.tsx` | Add `PhotoSlot` JSX card (conditionally shown by `templateId`) |
| 4 | `client/src/lib/htmlGenerators.ts` | Add CSS classes + HTML for the photo grid/layout in the relevant generator function |
| 5 | `client/src/pages/Home.tsx` | Add field(s) to `DEFAULT_CUSTOMIZATION` with value `undefined` |
| 6 | Run `pnpm test` | Confirm all 19 tests still pass |

---

## Step 1 — Extend `CustomizationSettings` in `htmlGenerators.ts`

Locate the `CustomizationSettings` interface (near the top of the file) and add a comment block + optional fields:

```ts
// <Template>: <description> (<ratio>)
myPhoto1?: string;
myPhoto2?: string;
```

Group related fields under one comment. All photo fields are `string | undefined` (base-64 data URLs).

---

## Step 2 — Wire the cropper in `CustomizationPanel.tsx`

Five locations must be updated in sequence. Use `grep -n` to find exact line numbers before editing.

### 2a. `CustomizationSettings` interface (top of file, mirrored from htmlGenerators)
Add the same optional fields.

### 2b. `CropperTarget` union type
```ts
type CropperTarget =
  | "logo"
  | "background"
  // ... existing entries ...
  | "myPhoto1"
  | "myPhoto2";
```

### 2c. `CROPPER_ASPECTS` record
```ts
const CROPPER_ASPECTS: Record<CropperTarget, number> = {
  // ... existing entries ...
  myPhoto1: 1,        // 1:1 square
  myPhoto2: 3 / 4,   // 3:4 portrait
  // myPhoto: 4 / 3  // 4:3 landscape
};
```

### 2d. `CROPPER_LABELS` record
```ts
const CROPPER_LABELS: Record<CropperTarget, string> = {
  // ... existing entries ...
  myPhoto1: "My Photo 1",
  myPhoto2: "My Photo 2",
};
```

### 2e. `useRef` declarations + `inputRefs` map
```ts
const myPhoto1Ref = useRef<HTMLInputElement>(null);
const myPhoto2Ref = useRef<HTMLInputElement>(null);

const inputRefs: Record<CropperTarget, React.RefObject<HTMLInputElement | null>> = {
  // ... existing entries ...
  myPhoto1: myPhoto1Ref,
  myPhoto2: myPhoto2Ref,
};
```

### 2f. Toast labels map (inside `handleCropComplete`)
```ts
const labels: Record<string, string> = {
  // ... existing entries ...
  myPhoto1: "My photo 1 applied",
  myPhoto2: "My photo 2 applied",
};
```

---

## Step 3 — Add the `PhotoSlot` JSX card

Insert a new `<Card>` block inside the return JSX, **before the final `</div>`**. Gate it with `templateId`:

```tsx
{/* ── <Template>: <Section Name> Photos ─────────────────────────────── */}
{templateId === "<templateKey>" && (
  <Card className="border-[#e8e4d9] shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-[#2c3e50]">
        <ImageIcon className="w-5 h-5" />
        <Section Name> Photos
      </CardTitle>
      <CardDescription>
        Upload your photos.{" "}
        <span className="font-semibold text-[#2c3e50]">1:1 square ratio</span> — displayed as a grid.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-3">
        <PhotoSlot
          label="Photo 1"
          value={settings.myPhoto1}
          target="myPhoto1"
          aspect={1}
          aspectLabel="1:1 Square"
        />
        <PhotoSlot
          label="Photo 2"
          value={settings.myPhoto2}
          target="myPhoto2"
          aspect={3 / 4}
          aspectLabel="3:4 Portrait"
        />
      </div>
    </CardContent>
  </Card>
)}
```

**Aspect ratio reference:**

| Ratio | Value | Use case |
|-------|-------|----------|
| 1:1 | `1` | Profile photos, square dishes, food thumbnails |
| 3:4 | `3 / 4` | Portrait drinks, menu cards |
| 4:3 | `4 / 3` | Story/interior landscape shots |
| 16:9 | `16 / 9` | Hero backgrounds, banners |

**templateId keys:** `"elegant"`, `"portfolio"`, `"business"` (Coffee Shop), `"restaurant"`, `"professionals"`

---

## Step 4 — Update the HTML generator

### 4a. Add CSS classes

Inside the `<style>` block of the relevant `generate*HTML` function, add grid/layout CSS:

```css
/* 1:1 square photo grid */
.my-photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.my-photo-item {
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f0ede6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}
.my-photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 300ms ease;
}
.my-photo-item:hover img { transform: scale(1.04); }

/* Responsive */
@media (max-width: 640px) {
  .my-photo-grid { grid-template-columns: repeat(2, 1fr); }
}
```

For **circular profile photos** (Professionals/Portfolio):

```css
.hero-profile-photo {
  width: 150px; height: 150px;
  border-radius: 50%; overflow: hidden; flex-shrink: 0;
  border: 4px solid ${accent};
  box-shadow: 0 4px 24px rgba(0,0,0,0.14);
}
.hero-profile-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.hero-inner-prof { display: flex; align-items: center; justify-content: center; gap: 2.5rem; flex-wrap: wrap; }
.hero-text-prof { text-align: left; }
.hero-text-prof.centered { text-align: center; }
```

### 4b. Add HTML section

```html
<section id="my-section">
  <h2 class="section-title">${data.mySectionTitle}</h2>
  <div class="my-photo-grid">
    ${[1,2,3].map(i => {
      const photo = (customization as any)[`myPhoto${i}`];
      return photo
        ? `<div class="my-photo-item"><img src="${photo}" alt="Photo ${i}" /></div>`
        : `<div class="my-photo-item">📷</div>`;
    }).join('\n    ')}
  </div>
</section>
```

For **circular profile photo beside name** (hero layout):

```html
<section class="hero">
  <div class="hero-inner-prof">
    ${customization.profilePhoto
      ? `<div class="hero-profile-photo"><img src="${customization.profilePhoto}" alt="Profile Photo" /></div>`
      : ''}
    <div class="hero-text-prof${customization.profilePhoto ? '' : ' centered'}">
      <h1>${data.heroTitle}</h1>
      <p>${data.heroDescription}</p>
    </div>
  </div>
</section>
```

---

## Step 5 — Add to `DEFAULT_CUSTOMIZATION` in `Home.tsx`

Find the `DEFAULT_CUSTOMIZATION` constant and add each new field as `undefined`:

```ts
const DEFAULT_CUSTOMIZATION: CustomizationSettings = {
  // ... existing fields ...
  myPhoto1: undefined,
  myPhoto2: undefined,
};
```

---

## Step 6 — Run tests

```bash
cd /home/ubuntu/website_builder && pnpm test
```

All 19 tests must pass. If TypeScript errors appear, the most common causes are:

- Missing field in `CropperTarget` union → add to `CROPPER_ASPECTS` and `CROPPER_LABELS` records
- Missing `useRef` declaration or `inputRefs` entry
- Field added to `CustomizationPanel.tsx` but not to `htmlGenerators.ts` (or vice versa)

---

## Removing a Photo Section

To remove an existing photo section, reverse all 6 steps: delete the fields from `CustomizationSettings`, remove from `CropperTarget`/`CROPPER_ASPECTS`/`CROPPER_LABELS`, delete the `useRef` and `inputRefs` entries, remove the toast label, delete the JSX card, remove the CSS and HTML from the generator, and remove from `DEFAULT_CUSTOMIZATION`. Run `pnpm test` after each file to catch errors early.

---

## Common Pitfalls

- **JSX comment syntax**: Use `{/* comment */}` inside JSX, never `// comment` on a standalone line inside the return block — it causes Babel parse errors.
- **Trailing commas in records**: Every entry in `CROPPER_ASPECTS` and `CROPPER_LABELS` must have a trailing comma; TypeScript records require all keys to be present.
- **`inputRefs` completeness**: The `inputRefs` object is typed as `Record<CropperTarget, ...>` — every `CropperTarget` member must have a corresponding `useRef` entry or TypeScript will error.
- **Template key vs display name**: The `templateId` prop uses the internal key (`"business"` for Coffee Shop, `"professionals"` for Professionals) — not the display name shown in the selector.

---
name: website-builder-template
description: "Add, replace, or remove a website template in the Website Builder SaaS app (project: website_builder). Covers the full end-to-end workflow: defining template fields in templates.ts, writing the HTML generator in htmlGenerators.ts, wiring photo upload slots in CustomizationPanel, updating DEFAULT_CUSTOMIZATION in Home.tsx, generating a thumbnail, and cleaning up old template references. Use this skill whenever a user asks to add a new template, replace an existing one, or remove a template from the website builder."
---

# Website Builder — Add / Replace / Remove a Template

## Overview

Adding a template touches **6 files** in a fixed order. Do them in sequence; each step depends on the previous one.

| Step | File | What changes |
|------|------|-------------|
| 1 | `client/src/lib/templates.ts` | Template definition (fields, sections, default data, thumbnail) |
| 2 | `client/src/lib/htmlGenerators.ts` | `CustomizationSettings` interface + HTML generator function |
| 3 | `client/src/components/CustomizationPanel.tsx` | Photo upload slots + `CropperTarget` union + aspect/label maps |
| 4 | `client/src/pages/Home.tsx` | `DEFAULT_CUSTOMIZATION` + default selected template |
| 5 | `client/src/components/TemplateSelector.tsx` | (Usually auto-driven by templates.ts — verify no hardcoded refs) |
| 6 | Other files | `packages.test.ts`, `Pricing.tsx`, any hardcoded template name strings |

**Before starting:** run `grep -rn "<OldTemplateName>" /home/ubuntu/website_builder/client /home/ubuntu/website_builder/server` to find every reference that must be updated.

---

## Step 1 — Define the template in `templates.ts`

File: `client/src/lib/templates.ts`

```ts
"mytemplate": {
  id: "mytemplate",
  name: "My Template",
  description: "Short description shown in the selector.",
  icon: "https://cdn-url/template-mytemplate-thumb.png",  // placeholder until Step 4b
  fields: [
    { name: "siteName",  label: "Site Name",  type: "text",     section: "Basic Info", placeholder: "Acme Corp" },
    { name: "headline",  label: "Headline",   type: "text",     section: "Hero",       placeholder: "Your tagline here" },
    { name: "bodyText",  label: "Body Text",  type: "textarea", section: "About",      placeholder: "Tell your story..." },
    // Add all form fields the user will fill in
  ],
  defaultData: {
    siteName: "Sample Org",
    headline: "Together We Create Change",
    // Pre-fill every field so the preview looks polished immediately
  },
}
```

**Rules:**
- `section` groups fields into tabs — keep sections to 2–5 fields each.
- Every field in `fields` must have a matching key in `defaultData`.
- `TemplateType` is a union of all template IDs — TypeScript will error if the new ID is missing.

---

## Step 2 — Write the HTML generator

File: `client/src/lib/htmlGenerators.ts`

### 2a — Add photo fields to `CustomizationSettings`

```ts
export interface CustomizationSettings {
  // ... existing fields ...
  // MyTemplate: hero photo (16:9)
  myTemplateHeroPhoto?: string;
  // MyTemplate: gallery photos (4:3 landscape)
  myTemplateGallery1?: string;
  myTemplateGallery2?: string;
}
```

### 2b — Write the generator function

```ts
export function generateMyTemplateHTML(data: FormData, customization: CustomizationSettings): string {
  const accent = customization.accentColor;
  const heroBackground = getHeroBackground(customization);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.siteName}</title>
  ${getFontLink(customization)}
  <style>
    ${getBaseStyles(customization)}
    /* ... template-specific CSS ... */
    ${getFontOverrideStyles(customization)}
  </style>
</head>
<body>
  <header>
    ${customization.logo ? `<img src="${customization.logo}" alt="Logo" class="logo-image" />` : ''}
    ${data.siteName}
  </header>
  <!-- ... sections ... -->
  <script>${getScrollSpyScript()}</script>
</body>
</html>`;
}
```

**Always use these helpers** (already defined in the file):
- `getBaseStyles(customization)` — resets, font, link colors
- `getFontLink(customization)` — Google Fonts `<link>` tag
- `getFontOverrideStyles(customization)` — user font/accent color overrides
- `getScrollSpyScript()` — nav active-link scroll spy
- `getHeroBackground(customization)` — CSS `background` value using `backgroundImage` + `backgroundOpacity`

### 2c — Register in the `generateHTML` switch

```ts
case "mytemplate": return generateMyTemplateHTML(data, customization);
```

**Common pitfall:** Python/sed replacement scripts can introduce an escaped backtick (`` \` ``) at the closing line of a template literal. Always verify the closing backtick is bare after any scripted replacement.

---

## Step 3 — Add photo slots to `CustomizationPanel`

File: `client/src/components/CustomizationPanel.tsx`

Read the file before editing — it has a specific structure that must be preserved.

### 3a — Extend `CropperTarget` union

```ts
type CropperTarget =
  | "logo" | "background"
  | "profilePhoto"
  | "myTemplateHeroPhoto"
  | "myTemplateGallery1" | "myTemplateGallery2";
```

### 3b — Add aspect ratios and labels

```ts
const CROPPER_ASPECTS: Record<CropperTarget, number> = {
  myTemplateHeroPhoto: 16 / 9,
  myTemplateGallery1: 4 / 3,
  myTemplateGallery2: 4 / 3,
};

const CROPPER_LABELS: Record<CropperTarget, string> = {
  myTemplateHeroPhoto: "Hero Photo",
  myTemplateGallery1: "Gallery Photo 1",
  myTemplateGallery2: "Gallery Photo 2",
};
```

### 3c — Add `useRef` and `inputRefs`

```ts
const myTemplateHeroPhotoRef = useRef<HTMLInputElement>(null);

const inputRefs: Record<CropperTarget, React.RefObject<HTMLInputElement | null>> = {
  myTemplateHeroPhoto: myTemplateHeroPhotoRef,
};
```

### 3d — Add the upload card JSX

Wrap the card in `{template === "mytemplate" && ( ... )}` so it only shows for this template.

Use `compact` prop on `<PhotoSlot>` for square/portrait photos. Omit `compact` for full-width landscape slots.

```tsx
{template === "mytemplate" && (
  <Card>
    <CardHeader><CardTitle>Hero Photo</CardTitle></CardHeader>
    <CardContent>
      <PhotoSlot
        label="Hero Photo"
        image={settings.myTemplateHeroPhoto}
        onUpload={() => triggerFileInput("myTemplateHeroPhoto")}
        onRemove={() => handleRemovePhoto("myTemplateHeroPhoto")}
        compact
      />
      <input ref={myTemplateHeroPhotoRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => makeFileChangeHandler("myTemplateHeroPhoto")(e)} />
    </CardContent>
  </Card>
)}
```

### 3e — Map `handleCropComplete` target → settings key

Inside `handleCropComplete`, add a case for each new target:

```ts
case "myTemplateHeroPhoto":
  setSettings(prev => ({ ...prev, myTemplateHeroPhoto: croppedImage }));
  break;
```

**Critical bug to avoid:** The `background` target maps to `backgroundImage` (not `background`) in `CustomizationSettings`. This is the only mismatch — all other targets map 1:1 to their settings key. If you forget this mapping, uploaded background images will silently not appear in the preview.

---

## Step 4 — Update `Home.tsx`

File: `client/src/pages/Home.tsx`

### 4a — Add new photo fields to `DEFAULT_CUSTOMIZATION`

```ts
const DEFAULT_CUSTOMIZATION: CustomizationSettings = {
  // ...existing...
  myTemplateHeroPhoto: undefined,
  myTemplateGallery1: undefined,
  myTemplateGallery2: undefined,
};
```

### 4b — Generate and upload a thumbnail, then update `templates.ts`

Use the `generate` tool to create a thumbnail image, save it to `/home/ubuntu/webdev-static-assets/`, then upload:

```bash
manus-upload-file --webdev /home/ubuntu/webdev-static-assets/template-mytemplate-thumb.png
```

Update the `icon` field in `templates.ts` with the returned CDN URL.

### 4c — Optionally set as default template

```ts
const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("mytemplate");
```

---

## Step 5 — Remove an old template (when replacing)

Run this sweep first:

```bash
grep -rn "oldtemplate\|OldTemplate" /home/ubuntu/website_builder/client /home/ubuntu/website_builder/server
```

Files that typically need updating when removing a template:

| File | What to change |
|------|---------------|
| `templates.ts` | Delete the template entry; remove from `TemplateType` union |
| `htmlGenerators.ts` | Delete the generator function; remove from `generateHTML` switch; remove photo fields from `CustomizationSettings` |
| `CustomizationPanel.tsx` | Remove `CropperTarget` values, aspect/label entries, refs, inputRefs entries, JSX card |
| `Home.tsx` | Remove photo fields from `DEFAULT_CUSTOMIZATION`; change default template if needed |
| `packages.test.ts` | Update any hardcoded template ID strings |
| `Pricing.tsx` | Update template name in description text if present |

**Use Python for large replacements** — sed can introduce escaped backticks in template literals. Always verify the closing backtick of any template literal after a scripted replacement.

---

## Step 6 — Verify

```bash
cd /home/ubuntu/website_builder
npx tsc --noEmit          # Must show 0 errors
pnpm test                 # Must pass all tests
grep -rn "oldtemplate" client server  # Must return 0 results
```

Also open the preview in the browser and confirm:
- Template appears in the selector with correct thumbnail
- Photo upload slots appear only for the correct template
- Background image and logo render correctly in the preview
- Generated HTML downloads/launches without errors

---

## Reference Files

- **`references/html-generator-patterns.md`** — CSS patterns, section templates, and common HTML structures used across all templates. Read when writing a new HTML generator.
- **`references/photo-slot-checklist.md`** — Complete checklist for adding a new photo slot type (all 5 locations that must be updated). Read when adding photo upload slots.

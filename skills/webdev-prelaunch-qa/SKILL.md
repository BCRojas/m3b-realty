---
name: webdev-prelaunch-qa
description: "Full end-to-end QA audit workflow for the Website Builder SaaS app (project: website_builder) before launch. Covers template HTML quality, responsive layout, preview/live mismatch, Pre-Launch Checklist wiring, payment flows, admin panel accuracy, and pricing page correctness. Use this skill when the user asks to QA the website builder, check it before launch, verify everything works, or audit for glitches."
---

# Pre-Launch QA Skill — Website Builder App

Systematic QA audit process for the Website Builder app (`/home/ubuntu/website_builder`). Covers every layer — from generated HTML quality to payment flows — with automated scripts to speed up the audit.

---

## When to Use This Skill

Use when the user asks to: "Check the website before launch", "Make sure everything works", "QA the app", "Audit for glitches", "Verify the templates look correct", or "Make sure it's ready to publish."

---

## Audit Process (7 Areas)

Work through these areas in order. Use `references/qa_checklist.md` for the full itemized checklist per area.

### 1. Run the Automated CSS Audit First

```bash
python3 /home/ubuntu/skills/webdev-prelaunch-qa/scripts/audit_responsive_css.py \
  /home/ubuntu/website_builder/client/src/lib/htmlGenerators.ts
```

Catches instantly: missing viewport/description meta tags, grids without mobile breakpoints, large font sizes without mobile overrides, missing `overflow-x: hidden`.

### 2. Generate Template HTMLs for Visual Inspection

Copy the generator script into the project root and run:

```bash
cd /home/ubuntu/website_builder
cp /home/ubuntu/skills/webdev-prelaunch-qa/scripts/generate_audit_htmls.ts ./gen_audit.ts
npx tsx gen_audit.ts
```

Open each file at `file:///tmp/template_audit/` in the browser. Toggle DevTools viewports: **375px** (mobile), **768px** (tablet), **1280px** (desktop). Look for: overlapping elements, horizontal scroll, cropped images, broken grids, invisible text.

### 3. Check the Live Dev Server Visually

Navigate to the dev server URL and test:
- Template selector → all 4 cards load with correct thumbnails
- Customization panel → color, font, logo, photo upload all update the preview
- Preview modal → Desktop / Tablet / Mobile views match the live output
- Pre-Launch Checklist → triggers on Launch Website, Download, and Update Live Site

### 4. Verify Generated HTML Head Section (all 4 templates)

```bash
grep -c "meta name=\"viewport\"\|meta name=\"description\"\|overflow-x: hidden" \
  /home/ubuntu/website_builder/client/src/lib/htmlGenerators.ts
```

Each template must have exactly one `viewport` and one `description` meta tag. Count should be 4 for each.

### 5. Audit the Pricing Page

```bash
grep -n "premium templates\|[0-9] templates" \
  /home/ubuntu/website_builder/client/src/pages/Pricing.tsx
```

Template count in feature lists must match `Object.keys(TEMPLATES).length` in `client/src/lib/templates.ts`.

### 6. Audit Admin Panel Stats Logic

In `client/src/pages/Admin.tsx`, verify:
- `downloadCount` filters by `p.action === "download"` AND `p.status === "completed"`
- `totalRevenue` sums only `completed` payments (not pending)

### 7. Run the Full Test Suite

```bash
cd /home/ubuntu/website_builder && pnpm test
```

All tests must pass before marking the audit complete.

---

## Most Common Issues Found (and Fixes)

| Issue | Root Cause | Fix |
|---|---|---|
| Dark template shows light background in preview | `getFontOverrideStyles` applies `color !important` to all elements | Pass `darkTheme: true` to `getFontOverrideStyles` in the restaurant generator |
| Hero shows cream gradient instead of template's dark color | `getHeroBgCSS` falls back to light gradient | Pass `fallbackBg: '#1a1008'` to `getHeroBgCSS` in the restaurant generator |
| Horizontal scroll on mobile | No `overflow-x: hidden` on body | Add to `getBaseStyles()` body block — applies to all templates |
| Grid too narrow on tablet | No `@media (max-width: 768px)` breakpoint | Add tablet breakpoint to collapse to 2 columns |
| Pricing page shows wrong template count | Hardcoded number not updated | Update feature list strings in `Pricing.tsx` |
| Pre-Launch Checklist not triggering on a button | Button calling `openPaymentChooserDirect()` | Route through `openPaymentChooser()` which calls `withChecklist()` |
| Meta description missing from generated HTML | Not added to template `<head>` | Add `<meta name="description" content="${data.tagline \|\| data.siteName}">` after `<title>` |

---

## Key Files

| File | What to Audit |
|---|---|
| `client/src/lib/htmlGenerators.ts` | Generated HTML/CSS — responsive layout, meta tags, dark theme |
| `client/src/lib/templates.ts` | Template definitions — field names, default data, template count |
| `client/src/pages/Home.tsx` | Pre-Launch Checklist wiring, all launch/download/update button handlers |
| `client/src/pages/Pricing.tsx` | Template count in feature lists, price display |
| `client/src/pages/Admin.tsx` | Stats computation, payment filtering logic |
| `server/routers.ts` | Payment procedures, webhook handler, admin procedures |

---

## Delivering the QA Report

After all 7 areas, write a summary table and save a checkpoint:

```
| Area | Finding | Status |
|---|---|---|
| Viewport meta tag | Present in all 4 templates | ✅ |
| Meta description | Missing — added to all 4 | ✅ Fixed |
| Pricing page | Wrong template count — corrected | ✅ Fixed |
| Responsive layout | All 4 templates pass at 375/768/1280px | ✅ |
| Pre-Launch Checklist | Triggers on all 3 action buttons | ✅ |
| Admin stats | Correctly counts completed payments only | ✅ |
| Test suite | All tests passing | ✅ |
```

---

## Reference Files

- `references/qa_checklist.md` — Full itemized checklist for all 7 audit areas
- `scripts/audit_responsive_css.py` — Automated CSS issue scanner (run first)
- `scripts/generate_audit_htmls.ts` — Generates all 4 template HTMLs for visual inspection

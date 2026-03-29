# Pre-Launch QA Checklist — Website Builder App

Use this checklist as a systematic audit guide. Work through each section in order.
Mark each item ✅ (pass), ❌ (fail — fix required), or ⚠️ (minor issue — note it).

---

## 1. Core App Flows

### Template Selection
- [ ] All 4 template cards display with correct thumbnails
- [ ] Clicking a card selects it (visual highlight/checkmark appears)
- [ ] "Use Template" / "Continue" button navigates to customization page
- [ ] Template name and description are accurate on each card

### Customization Panel
- [ ] Accent color picker updates preview in real time
- [ ] Font selector (primary/secondary) updates preview
- [ ] Background style options (gradient/solid/image) work correctly
- [ ] Background opacity slider works when image is selected
- [ ] Logo upload accepts image files and displays in preview
- [ ] Photo upload slots accept images and display in preview
- [ ] All customization changes persist when switching tabs

### Form Fields
- [ ] All required fields are marked and validated
- [ ] Textarea fields accept multi-line input
- [ ] Character limits (if any) are enforced
- [ ] Default placeholder values are present for all fields
- [ ] Switching between form tabs preserves previously entered data

### Preview Modal
- [ ] "Preview Website" button opens the modal
- [ ] Desktop (1280px) view renders correctly
- [ ] Tablet (768px) view renders correctly
- [ ] Mobile (375px) view renders correctly
- [ ] No horizontal scrollbar appears at any viewport
- [ ] No element overlap or cropping at any viewport
- [ ] Preview matches what the live site will look like (no theme leakage)
- [ ] "Open Full Preview" / external link opens in new tab

---

## 2. Generated HTML Quality

For each of the 4 templates, generate the HTML and verify:

### Head Section
- [ ] `<meta charset="UTF-8">` present
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1.0">` present
- [ ] `<meta name="description">` present with site tagline or name
- [ ] `<title>` uses the site name
- [ ] Google Fonts link is present and correct
- [ ] No duplicate meta tags

### Body / Layout
- [ ] `body { overflow-x: hidden }` applied (no horizontal scroll on mobile)
- [ ] Hero section shows full background image (no cropping) when image is uploaded
- [ ] Hero background falls back to template's own color scheme (not generic light gradient) when no image
- [ ] Navigation links are correct and functional
- [ ] Hamburger menu appears and works on mobile (≤768px)
- [ ] All sections render: Hero, About/Story, Services/Menu, Gallery/Photos, Contact/Reservation, Footer

### Responsive Layout (check at 375px, 768px, 1280px)
- [ ] Multi-column grids collapse to 1 column on mobile (≤480px)
- [ ] Multi-column grids collapse to 2 columns on tablet (≤768px)
- [ ] Font sizes scale down on mobile (no oversized headings)
- [ ] Section padding reduces on mobile (no excessive whitespace)
- [ ] No fixed-width elements that overflow their container
- [ ] Images use `max-width: 100%` and don't overflow

### Dark-Themed Templates (Restaurant / Gourmet Kitchen)
- [ ] Hero background is dark (`#1a1008`) when no image is uploaded
- [ ] Body text is cream/light (`#f5ede0`), not dark navy
- [ ] `getFontOverrideStyles` does NOT override template's own text colors
- [ ] Preview and live output match exactly

---

## 3. Launch Flows

### Pre-Launch Checklist
- [ ] Checklist triggers when "Launch Website" is clicked
- [ ] Checklist triggers when "Update Live Site" is clicked
- [ ] Checklist triggers when "Download Website" is clicked
- [ ] Missing required fields are listed correctly
- [ ] "Go Back & Fix Issues" closes the modal
- [ ] "Proceed Anyway" bypasses the checklist and continues to payment
- [ ] Checklist passes silently when all required fields are filled

### Payment Flow
- [ ] Stripe checkout session opens in a new tab
- [ ] Toast notification appears ("Redirecting to checkout...")
- [ ] Success redirect returns user to the app
- [ ] Cancel redirect returns user to the app
- [ ] Payment status updates to "completed" after successful payment (via webhook)

### Download Flow
- [ ] After successful payment, HTML file downloads automatically
- [ ] Downloaded file is valid HTML (opens correctly in browser)
- [ ] Downloaded file includes all customization (colors, fonts, photos, content)

### Launch Live Flow
- [ ] After successful payment, site is deployed to CDN
- [ ] Live URL is displayed to the user
- [ ] Live URL is accessible publicly (no auth required)
- [ ] "Update Live Site" button appears after first launch
- [ ] Update flow re-deploys with latest content

---

## 4. Admin Panel

- [ ] Admin panel is accessible only to users with `role = 'admin'`
- [ ] Non-admin users see "Access Denied" message
- [ ] Stats cards show correct counts (Total Users, Total Orders, Downloads, Revenue)
- [ ] Payments table shows all payment records with correct status
- [ ] Users table shows all registered users
- [ ] Service config (pricing) can be updated and saves correctly
- [ ] Price changes reflect immediately on the Pricing page

---

## 5. Pricing Page

- [ ] Download price displays correctly (fetched from DB, not hardcoded)
- [ ] Launch price displays correctly (fetched from DB, not hardcoded)
- [ ] Template count in feature lists matches actual number of templates
- [ ] "Start Building Free" buttons navigate to the builder
- [ ] Page is accessible without login

---

## 6. Authentication

- [ ] Sign In button redirects to Manus OAuth login
- [ ] After login, user is redirected back to the app
- [ ] User name/avatar appears in the header after login
- [ ] Sign Out clears the session and returns to the home page
- [ ] Protected routes (admin panel) redirect unauthenticated users

---

## 7. Cross-Browser & Device

- [ ] Chrome (desktop) — no layout issues
- [ ] Safari (desktop) — no layout issues  
- [ ] Chrome (mobile) — no layout issues, no horizontal scroll
- [ ] Safari (mobile/iOS) — no layout issues
- [ ] All 4 templates tested on real mobile device or browser DevTools

---

## Common Issues & Fixes

| Symptom | Likely Cause | Fix |
|---|---|---|
| Preview shows light background for dark template | `getFontOverrideStyles` overriding template colors | Add `darkTheme: true` flag to `getFontOverrideStyles` call |
| Hero shows cream gradient instead of template color | `getHeroBgCSS` using default light fallback | Pass `fallbackBg` param with template's own background color |
| Horizontal scroll on mobile | Fixed-width element or missing `overflow-x: hidden` | Add to `getBaseStyles()` body block |
| Grid columns too narrow on tablet | Missing `@media (max-width: 768px)` breakpoint | Add tablet breakpoint to collapse grid |
| Pricing page shows wrong template count | Hardcoded number not updated | Update feature list strings in `Pricing.tsx` |
| Meta description missing | Not added to template `<head>` | Add `<meta name="description" content="${data.tagline || data.siteName}">` |
| Pre-Launch Checklist not triggering | Button calling `openPaymentChooserDirect()` instead of `openPaymentChooser()` | Route through `openPaymentChooser()` which calls `withChecklist()` |

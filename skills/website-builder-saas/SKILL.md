---
name: website-builder-saas
description: Build a full-stack no-code website builder SaaS app with template selection, live preview, customization panel, Stripe payments, credit-based access control, and an admin panel for managing packages and users. Use this skill when building a website builder product, a template-based SaaS app, or any app that lets users visually create and download/publish websites. Covers iframe preview patterns, non-clickable preview overlays, scrollable modal containers, monetization with one-time payments and credit systems, and a price/package management admin panel.
---

# Website Builder SaaS Skill

## Overview

Building a website builder SaaS involves these phases:

1. **Template system** — Define templates with fields, default data, and HTML generators
2. **Template selector UI** — Grid of cards with Preview and Select buttons
3. **Preview modal** — Non-clickable iframe with working scrollbar
4. **Customization panel** — Colors, fonts, backgrounds, logo upload
5. **Monetization** — Stripe one-time payments, credit system, webhook handler
6. **Admin panel** — Manage packages, view users, track orders
7. **Auth gate** — Protect download/publish behind credit check

---

## Phase 1: Template System

Define each template in `client/src/lib/templates.ts` with:

```ts
export type TemplateType = "elegant" | "portfolio" | "blog" | ...;

export interface TemplateField {
  name: string;
  label: string;
  type: "text" | "textarea" | "url";
  placeholder: string;
  section: string; // groups fields into tabs
}

export interface Template {
  id: TemplateType;
  name: string;
  description: string;
  icon: string;
  fields: TemplateField[];
  defaultData: Record<string, string>;
}

export const TEMPLATES: Record<TemplateType, Template> = { ... };
```

Create `client/src/lib/htmlGenerators.ts` with a `generateHTML(templateId, formData, customization)` function that returns a full self-contained HTML string (inline CSS + JS, no external dependencies). Each template is a separate generator function.

---

## Phase 2: Template Selector UI

`TemplateSelector` component renders a grid of cards. Each card has:
- Template icon, name, description
- **Preview** button → opens `TemplatePreviewModal`
- **Select** button → selects template AND navigates to Customize section

```tsx
// Select button triggers both selection and navigation
<Button onClick={() => {
  onSelectTemplate(template.id);
  onNavigateToCustomize();  // scroll/show customize section
}}>
  {selectedTemplate === template.id ? "Selected" : "Select"}
</Button>
```

Pass `onNavigateToCustomize` down from the parent `Home.tsx` which controls `showTemplateSelector` state.

---

## Phase 3: Preview Modal — Non-Clickable Iframe with Working Scrollbar

This is the most technically tricky part. The goal: show the full template HTML in a modal, allow scrolling, but block all clicks on links/buttons inside.

**The correct pattern:**

```tsx
{/* Outer container: handles scrolling */}
<div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#faf8f3] relative">
  {/* Transparent overlay: blocks all clicks */}
  <div className="absolute inset-0 z-10" style={{ cursor: "default" }} />
  {/* Iframe: fixed tall height, no internal scrolling */}
  <iframe
    srcDoc={previewHTML}
    title="Preview"
    className="w-full border-0"
    style={{ height: "2000px", display: "block", pointerEvents: "none" }}
    scrolling="no"
  />
</div>
```

**Why this works:**
- The outer `div` with `overflow-y-auto` owns the scrollbar — users scroll the container, not the iframe
- The transparent `div` overlay with `z-10` intercepts all mouse events before they reach the iframe
- `pointerEvents: "none"` on the iframe is a second layer of protection
- `scrolling="no"` + fixed `height: 2000px` prevents the iframe from having its own scrollbar

**Common mistakes to avoid:**
- Do NOT use `h-full` on the iframe — it won't scroll
- Do NOT use `overflow-auto` on the iframe wrapper — the iframe won't have content to scroll
- Do NOT rely on `pointer-events-none` CSS class alone — the overlay div is required to block browser-level iframe focus

The `DialogContent` wrapper must use `flex flex-col` with `h-[90vh]` so the preview container can flex-grow and the footer stays fixed at the bottom.

---

## Phase 4: Customization Panel

`CustomizationPanel` component exposes:

```ts
interface CustomizationSettings {
  accentColor: string;       // hex color picker
  primaryFont: string;       // serif font name
  secondaryFont: string;     // sans-serif font name
  backgroundStyle: "solid" | "gradient" | "pattern";
  backgroundOpacity: number; // 0–1
  logo?: string;             // base64 data URL
}
```

The live preview iframe in the editor uses `srcDoc={generateHTML(template, formData, customization)}` — it re-renders on every change automatically.

---

## Phase 5: Monetization with Stripe

### Database Schema (drizzle/schema.ts)

Add these tables alongside the default `users` table:

```ts
// Packages (editable by admin)
export const packages = mysqlTable("packages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  price: int("price").notNull(),          // in smallest currency unit (centavos)
  credits: int("credits").notNull(),      // websites this package grants
  isActive: boolean("isActive").default(true).notNull(),
  stripePriceId: varchar("stripePriceId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Purchases (one row per completed payment)
export const purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  packageId: int("packageId").notNull().references(() => packages.id),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 256 }),
  stripeSessionId: varchar("stripeSessionId", { length: 256 }),
  amountPaid: int("amountPaid").notNull(),
  creditsGranted: int("creditsGranted").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "refunded"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Website credits (running balance per user)
export const userCredits = mysqlTable("userCredits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id).unique(),
  creditsRemaining: int("creditsRemaining").default(0).notNull(),
  totalCreditsEarned: int("totalCreditsEarned").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
```

### Stripe Checkout Flow

```ts
// server/routers.ts — createCheckoutSession procedure
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [{ price_data: {
    currency: "php",
    product_data: { name: pkg.name, description: pkg.description },
    unit_amount: pkg.price,  // already in centavos
  }, quantity: 1 }],
  mode: "payment",
  allow_promotion_codes: true,
  customer_email: ctx.user.email ?? undefined,
  client_reference_id: ctx.user.id.toString(),
  metadata: {
    user_id: ctx.user.id.toString(),
    package_id: pkg.id.toString(),
    credits: pkg.credits.toString(),
  },
  success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/pricing`,
});
return { url: session.url };
```

Frontend opens checkout in new tab:
```ts
window.open(result.url, "_blank");
toast.info("Redirecting to checkout...");
```

### Webhook Handler

Register BEFORE `express.json()` in `server/_core/index.ts`:

```ts
import { stripeWebhook } from "../stripeWebhook";
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);
```

In `server/stripeWebhook.ts`:

```ts
// CRITICAL: always handle test events first
if (event.id.startsWith("evt_test_")) {
  return res.json({ verified: true });
}

if (event.type === "checkout.session.completed") {
  const session = event.data.object as Stripe.Checkout.Session;
  const userId = parseInt(session.metadata?.user_id ?? "0");
  const credits = parseInt(session.metadata?.credits ?? "0");
  // upsert userCredits, insert purchase record
}
```

### Seed Default Packages on Server Start

```ts
// In server startup (server/_core/index.ts or db.ts)
await seedDefaultPackages();

async function seedDefaultPackages() {
  const existing = await db.select().from(packages).limit(1);
  if (existing.length > 0) return;
  await db.insert(packages).values([
    { name: "Starter Package", description: "3 website credits", price: 150000, credits: 3, isActive: true },
    { name: "Additional Website", description: "1 extra website credit", price: 50000, credits: 1, isActive: true },
  ]);
  console.log("[DB] Default packages seeded.");
}
```

> Note: Philippine Peso amounts are stored in centavos (₱1,500 = 150000 centavos). Display as `₱${(price/100).toLocaleString()}`.

---

## Phase 6: Admin Panel

Route: `/admin` — protected by `role === "admin"` check (owner is auto-promoted via `OWNER_OPEN_ID` env var).

Admin panel tabs:
1. **Packages** — CRUD for packages (name, description, price, credits, active toggle)
2. **Users** — List all users with credit balances
3. **Orders** — All purchases with status, amount, user info

All admin procedures use `adminProcedure`:
```ts
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx });
});
```

---

## Phase 7: Auth Gate on Download

Before allowing HTML download, check credits:

```ts
// server: deductCredit procedure
const credit = await getUserCredits(ctx.user.id);
if (!credit || credit.creditsRemaining <= 0) {
  throw new TRPCError({ code: "FORBIDDEN", message: "No credits remaining" });
}
await decrementCredits(ctx.user.id);
return { success: true };
```

Frontend: call `deductCredit` mutation before triggering the download blob. If it throws, show a toast with a link to `/pricing`.

---

## Navigation Flow Summary

```
Home (template selector)
  ├── Preview button → TemplatePreviewModal
  │     └── "Use This Template" → close modal + navigate to Customize
  ├── Select button → select template + navigate to Customize
  └── Continue button → navigate to Customize

Customize section
  ├── Edit tab → form fields by section (tabs)
  ├── Preview tab → live iframe preview (non-clickable, scrollable)
  └── Download button → deduct credit → generate HTML blob → download
```

---

## Key Pitfalls

| Pitfall | Solution |
|---|---|
| Iframe content is clickable in preview | Use transparent overlay `div` with `z-10` + `pointerEvents: none` on iframe |
| Scrollbar not working in modal | Set fixed height on iframe (e.g., `2000px`), `scrolling="no"`, and `overflow-y-auto` on outer container |
| Stripe webhook fails test events | Always check `event.id.startsWith("evt_test_")` and return `{ verified: true }` |
| Prices display as raw integers | Store in centavos, display as `₱${(price/100).toLocaleString()}` |
| Admin route accessible to all users | Use `adminProcedure` middleware that checks `ctx.user.role === "admin"` |
| Template selector "Choose" vs "Select" | Use "Select" — it's more action-oriented and consistent with e-commerce UX |
| `Use This Template` not navigating | Wrap state updates + navigation in `setTimeout(() => { onClose(); onNavigateToCustomize(); }, 0)` |

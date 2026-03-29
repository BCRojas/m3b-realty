/**
 * generate_audit_htmls.ts
 *
 * Generates all 4 template HTML files with default data for visual QA auditing.
 * Run from the website_builder project root:
 *   npx tsx generate_audit_htmls.ts
 *
 * Output: /tmp/template_audit/{organization,coffee,professionals,restaurant}.html
 */

import { generateHTML, CustomizationSettings } from "./client/src/lib/htmlGenerators";
import { TEMPLATES } from "./client/src/lib/templates";
import * as fs from "fs";
import * as path from "path";

const outDir = "/tmp/template_audit";
fs.mkdirSync(outDir, { recursive: true });

const defaultCustomization: CustomizationSettings = {
  accentColor: "#7a9b7f",
  primaryFont: "Merriweather",
  secondaryFont: "Lato",
  backgroundStyle: "gradient",
  backgroundOpacity: 0.9,
  logo: undefined,
};

const templateKeys = ["elegant", "coffee", "professionals", "restaurant"] as const;
const fileNames: Record<string, string> = {
  elegant: "organization",
  coffee: "coffee_shop",
  professionals: "professionals",
  restaurant: "restaurant",
};

for (const key of templateKeys) {
  const template = TEMPLATES[key];
  const data = { ...template.defaultData };
  const html = generateHTML(key, data, defaultCustomization);
  const outPath = path.join(outDir, `${fileNames[key]}.html`);
  fs.writeFileSync(outPath, html, "utf8");
  console.log(`✅ Generated: ${outPath}`);
}

console.log(`\nOpen in browser: file://${outDir}/organization.html`);
console.log("Use browser DevTools to toggle viewport sizes: 375px, 768px, 1280px");

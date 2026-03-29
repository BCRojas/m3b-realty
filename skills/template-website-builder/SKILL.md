---
name: template-website-builder
description: "Build template-based website builders with multiple design templates, customizable colors/fonts, background styles, logo upload, social media links, and responsive hamburger menus. Use for creating no-code website builders, multi-template website generators, form-to-website applications, or template-driven content platforms."
---

# Template Website Builder Skill

## Overview

This skill enables building production-ready website builders where users select from predefined templates, customize content and appearance, and generate complete websites. It combines React component architecture, dynamic HTML generation, real-time preview, and comprehensive design customization into a cohesive workflow.

The skill provides proven patterns for:
- **Template System**: Multiple website templates (Elegant, Portfolio, Blog, Business, Agency, Restaurant, Nonprofit) with distinct layouts
- **Customization Panel**: Color picker, font selector, background customization, and logo upload
- **Form Management**: Dynamic form fields organized by template section
- **Live Preview**: Real-time website preview with full-page modal preview
- **HTML Generation**: Template-aware HTML generators that apply customizations
- **Download Functionality**: Export complete, standalone HTML files
- **Responsive Navigation**: Hamburger menu for mobile devices
- **Social Media Integration**: LinkedIn, Twitter, Instagram links in footer
- **Professional Branding**: Logo display, custom backgrounds, and social media links

## Core Capabilities

### 1. Multi-Template Architecture

Implement a template configuration system that defines:
- Template metadata (name, description, icon, default data)
- Template-specific form fields organized by section
- Default content for each template
- Template-specific HTML generation logic

**Key Pattern**: Store templates in `lib/templates.ts` with a `TEMPLATES` object mapping template IDs to configurations. Each template includes:
```typescript
interface Template {
  name: string;
  description: string;
  icon: string;
  defaultData: Record<string, string>;
  fields: TemplateField[];
}
```

### 2. Customization System

Provide users with design control through:
- **Color Picker**: 8 curated accent colors with visual swatches
- **Font Selector**: Multiple headline and body font options
- **Background Customization**: Solid, gradient, or custom image backgrounds with opacity control
- **Logo Upload**: Allow users to upload and display their logo in the header
- **Live Application**: Customizations apply instantly to preview

**Implementation**: Create a `CustomizationPanel` component that manages `CustomizationSettings`:
```typescript
interface CustomizationSettings {
  accentColor: string;
  primaryFont: string;
  secondaryFont: string;
  backgroundStyle: 'solid' | 'gradient' | 'image';
  backgroundImage?: string; // base64 encoded
  backgroundOpacity: number; // 0-100
  logo?: string; // base64 encoded
}
```

Pass customization settings to all HTML generators so they embed selected colors, fonts, and backgrounds via CSS variables and Google Fonts links.

### 3. Dynamic HTML Generation

Generate complete, standalone HTML files that:
- Include all customizations (colors, fonts, backgrounds, logo) in inline styles
- Load fonts from Google Fonts API
- Contain responsive CSS for mobile/desktop
- Include hamburger menu JavaScript for mobile navigation
- Work without external dependencies

**Pattern**: Create separate generator functions for each template type (`generateElegantHTML`, `generatePortfolioHTML`, etc.) that accept both form data and customization settings. Use template literals to inject user content and styling.

### 4. Template Preview Modal & Full-Page Preview

Display full-page previews before and after template selection:
- **Template Selection Preview**: Show complete website design with sample data before choosing
- **Editor Full-Page Preview**: Display entire website in large modal during editing
- **Live Updates**: Both previews update in real-time as user edits content
- **Responsive Design**: Preview shows responsive HTML with hamburger menu on mobile
- Use iframe to isolate preview styles
- Display template name, description, and action buttons

### 5. Form Field Organization

Group form fields by section for better UX:
- Organize fields into logical sections (Site Information, Hero Section, About Section, etc.)
- Use tabs to switch between sections
- Show only relevant fields for each template
- Provide sensible placeholder text and default values

### 6. Responsive Navigation

Implement mobile-friendly navigation:
- Three-line hamburger icon on screens < 768px
- Full horizontal navigation on desktop
- Smooth toggle animation
- Auto-close menu when navigation link is clicked
- JavaScript handles menu state and animations

### 7. Social Media & Branding

Enable professional branding features:
- Logo upload and display in header
- Social media links (LinkedIn, Twitter, Instagram) in footer
- Customizable background styles (solid, gradient, image)
- Professional color and font customization

## Workflow: Building a Website Builder

### Step 1: Define Templates

Create a `templates.ts` file with all template configurations:

```typescript
export const TEMPLATES: Record<TemplateType, Template> = {
  elegant: {
    name: "Elegant Site",
    description: "Sophisticated editorial design with refined typography",
    icon: "✨",
    defaultData: { /* default form values */ },
    fields: [ /* form field definitions */ ]
  },
  portfolio: { /* ... */ },
  blog: { /* ... */ },
  business: { /* ... */ }
};
```

**What to include in each template:**
- Meaningful default values that show template potential
- All form fields needed for that template type
- Logical field grouping by section
- Clear field labels and placeholders
- Social media fields (linkedinUrl, twitterUrl, instagramUrl) in Contact Information section

### Step 2: Create HTML Generators

Implement `htmlGenerators.ts` with:

1. **Base styles function**: Generates CSS that uses customization settings
   ```typescript
   const getBaseStyles = (customization: CustomizationSettings) => `
     body { font-family: '${customization.secondaryFont}', sans-serif; }
     h1, h2, h3 { font-family: '${customization.primaryFont}', serif; }
     a { color: ${customization.accentColor}; }
   `;
   ```

2. **Font link generator**: Loads fonts from Google Fonts
   ```typescript
   const getFontLink = (customization: CustomizationSettings) => {
     const primary = customization.primaryFont.replace(/ /g, '+');
     const secondary = customization.secondaryFont.replace(/ /g, '+');
     return `<link href="https://fonts.googleapis.com/css2?family=${primary}:wght@400;700&family=${secondary}:wght@400;600&display=swap" rel="stylesheet">`;
   };
   ```

3. **Background style generator**: Handles solid, gradient, and image backgrounds
   ```typescript
   const getHeroBackground = (customization: CustomizationSettings) => {
     if (customization.backgroundStyle === 'image' && customization.backgroundImage) {
       const opacity = customization.backgroundOpacity / 100;
       return `background-image: url('${customization.backgroundImage}'); opacity: ${opacity};`;
     } else if (customization.backgroundStyle === 'gradient') {
       return `background: linear-gradient(135deg, ${customization.accentColor}20 0%, ${customization.accentColor}10 100%);`;
     }
     return `background-color: #faf8f3;`;
   };
   ```

4. **Template-specific generators**: Each returns complete HTML with:
   - Proper DOCTYPE and meta tags
   - Embedded font links and styles
   - User content injected into template structure
   - Responsive CSS for mobile/desktop
   - Hamburger menu HTML and JavaScript
   - Social media icons in footer
   - Logo display in header
   - Semantic HTML structure

5. **Main generator function**: Routes to correct template generator
   ```typescript
   export function generateHTML(
     templateType: TemplateType,
     data: FormData,
     customization: CustomizationSettings
   ): string { /* ... */ }
   ```

### Step 3: Build UI Components

Create these React components:

**TemplateSelector**
- Display template cards with icon, name, description
- Show "Preview" button for full-page preview
- Show "Choose" button for quick selection
- Highlight currently selected template

**TemplatePreviewModal**
- Render full-page preview in iframe
- Display template metadata
- Include "Use This Template" button
- Provide close button

**FullPagePreviewModal**
- Large modal showing complete website
- Header with site name and close button
- Scrollable content area
- Responsive design preview

**CustomizationPanel**
- Color picker with 8 curated color options
- Font dropdowns for headline and body fonts
- Background style selector (Solid, Gradient, Image)
- Background opacity slider
- Logo upload with preview and remove button
- Show live preview of font selections
- Update parent state on selection

**Home Page**
- Manage template selection state
- Manage form data state
- Manage customization state
- Organize form fields by section using tabs
- Display live preview in iframe
- Provide download button
- Provide full-page preview button

### Step 4: Implement State Management

In the main Home component:

```typescript
const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("elegant");
const [formData, setFormData] = useState<Record<string, string>>({});
const [customization, setCustomization] = useState<CustomizationSettings>({
  accentColor: "#7a9b7f",
  primaryFont: "Merriweather",
  secondaryFont: "Lato",
  backgroundStyle: "solid",
  backgroundOpacity: 100,
});
```

Initialize form data with template defaults when template changes:
```typescript
const initializedFormData = useMemo(() => {
  if (Object.keys(formData).length === 0) {
    return { ...currentTemplate.defaultData };
  }
  return formData;
}, [selectedTemplate, formData, currentTemplate.defaultData]);
```

### Step 5: Add Download Functionality

Implement download by:
1. Generating HTML with current template, form data, and customization
2. Creating a blob from the HTML string
3. Creating a download link and triggering it
4. Cleaning up the link

```typescript
const downloadHTML = () => {
  const html = generateHTML(selectedTemplate, initializedFormData, customization);
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(html));
  element.setAttribute("download", `${initializedFormData.siteName}.html`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
```

## Advanced Features

### Logo Upload

Allow users to upload logos (PNG/SVG) that display in the website header:
- Convert image to base64 for embedding in HTML
- Display logo preview in customization panel
- Include remove button to clear logo
- Recommended size: 100x100px minimum
- Display logo at 40px height in header with proper spacing

### Social Media Links

Add optional social media integration:
- LinkedIn, Twitter, Instagram URL inputs in Contact Information section
- Display as clickable icons in website footer
- Icons styled with accent color and hover effects
- Only show icons for URLs that are provided
- Use text icons: "in" for LinkedIn, "𝕏" for Twitter, "📷" for Instagram

### Responsive Hamburger Menu

Implement mobile-friendly navigation:
- Three-line hamburger icon on screens < 768px
- Full horizontal navigation on desktop
- Smooth toggle animation
- Auto-close menu when navigation link is clicked
- JavaScript handles menu state and animations
- Include hamburger button HTML and event listeners in generated HTML

### Full-Page Preview Modal

Provide immersive website preview:
- Large modal showing complete website
- Header with site name and close button
- Scrollable content area
- Responsive design preview
- Accessible with keyboard navigation

## Design System: Editorial Sophistication

The reference implementation uses this design philosophy:

- **Color Palette**: Warm cream (#faf8f3) background, deep slate (#2c3e50) text, muted sage green (#7a9b7f) accents
- **Typography**: Merriweather serif for headlines, Lato sans-serif for body text
- **Layout**: Asymmetric two-column design (form left, preview right) on desktop; tab-based on mobile
- **Interactions**: Understated, elegant transitions (250ms ease-in-out)
- **Spacing**: Generous whitespace, consistent padding/margins

Adapt this to match your brand, but maintain the principle of **intentional design** over generic templates.

## Customization Options

### Color Palette

Provide 8 curated colors that work well together:
- Sage Green (#7a9b7f)
- Ocean Blue (#4a90a4)
- Warm Terracotta (#c97a5c)
- Deep Plum (#6b5b7d)
- Forest Green (#2d5a3d)
- Burnt Orange (#b85c2f)
- Slate Blue (#5a6b8f)
- Dusty Rose (#a87a7a)

### Font Options

**Headline Fonts** (serif for elegance):
- Merriweather
- Playfair Display
- Lora
- Crimson Text
- Abril Fatface

**Body Fonts** (sans-serif for readability):
- Lato
- Inter
- Open Sans
- Poppins
- Source Sans Pro

## Common Patterns

### Organizing Form Fields

Group fields by template section for clarity:

```typescript
const fieldsBySection = useMemo(() => {
  const grouped: Record<string, TemplateField[]> = {};
  currentTemplate.fields.forEach((field) => {
    if (!grouped[field.section]) {
      grouped[field.section] = [];
    }
    grouped[field.section].push(field);
  });
  return grouped;
}, [currentTemplate.fields]);
```

Then render with tabs:
```typescript
<Tabs defaultValue={Object.keys(fieldsBySection)[0]}>
  <TabsList>
    {Object.keys(fieldsBySection).map((section) => (
      <TabsTrigger key={section} value={section}>{section}</TabsTrigger>
    ))}
  </TabsList>
  {Object.entries(fieldsBySection).map(([section, fields]) => (
    <TabsContent key={section} value={section}>
      {fields.map((field) => (
        /* render input for field */
      ))}
    </TabsContent>
  ))}
</Tabs>
```

### Real-Time Preview

Use iframe with `srcDoc` prop to display generated HTML:

```typescript
<iframe
  srcDoc={generateHTML(selectedTemplate, initializedFormData, customization)}
  title="Website Preview"
  className="w-full h-full border-0"
/>
```

This automatically updates whenever form data or customization changes.

### Template Field Definition

Define fields with all necessary metadata:

```typescript
interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "email" | "tel";
  section: string;
  rows?: number; // for textarea
}
```

### Logo Upload Handler

Convert image files to base64 for embedding:

```typescript
const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCustomization({ ...customization, logo: base64 });
    };
    reader.readAsDataURL(file);
  }
};
```

### Background Image Upload Handler

Similar to logo upload, convert background images to base64:

```typescript
const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCustomization({ ...customization, backgroundImage: base64 });
    };
    reader.readAsDataURL(file);
  }
};
```

## References

See bundled references for:
- **component-patterns.md**: Reusable React component patterns
- **html-generation-guide.md**: Best practices for HTML generation with customization
- **template-examples.md**: Complete template implementations (Elegant, Portfolio, Blog, Business)

## Implementation Checklist

When building a website builder with this skill:

- [ ] Define 5-7 templates with distinct purposes (Elegant, Portfolio, Blog, Business, Agency, Restaurant, Nonprofit)
- [ ] Implement color picker with 8 curated colors
- [ ] Add font selector with headline and body font options
- [ ] Create background customization (solid, gradient, image)
- [ ] Implement logo upload with base64 encoding
- [ ] Add social media link inputs (LinkedIn, Twitter, Instagram)
- [ ] Build responsive hamburger menu for mobile
- [ ] Create full-page preview modal
- [ ] Organize form fields by template section with tabs
- [ ] Implement real-time live preview
- [ ] Add download HTML functionality
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Validate form inputs and provide helpful error messages
- [ ] Ensure all customizations embed properly in generated HTML
- [ ] Test hamburger menu functionality on mobile
- [ ] Verify social media links work correctly
- [ ] Test logo display in header

## Next Steps

After building the core website builder:

1. **Export Formats**: Support ZIP export with separate CSS/JS files for easier hosting and customization
2. **Template Duplication**: Allow users to duplicate and modify templates
3. **Save & Load**: Upgrade to web-db-user for project persistence and auto-save
4. **Custom Domain Publishing**: Enable one-click publishing to custom domains
5. **Template Library**: Add 10+ industry-specific templates
6. **Analytics Integration**: Add optional analytics code injection
7. **Favicon Upload**: Allow custom favicon upload for browser tabs
8. **Mobile Device Preview**: Add device preview toggle (mobile/tablet/desktop) in editor
9. **Template Variants**: Create multiple layout options within each template
10. **Advanced Customization**: Add more design options (border styles, shadow effects, spacing controls)

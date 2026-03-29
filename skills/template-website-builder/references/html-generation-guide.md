# HTML Generation Guide for Template Website Builders

## Overview

HTML generation is the core of a template website builder. Each template must generate complete, standalone HTML files that:
- Include all user content (form data)
- Apply all customizations (colors, fonts)
- Work without external dependencies
- Are responsive and mobile-friendly
- Have proper semantic structure

## Architecture

### CustomizationSettings Interface

```typescript
interface CustomizationSettings {
  accentColor: string;      // Hex color code (e.g., "#7a9b7f")
  primaryFont: string;      // Headline font name (e.g., "Merriweather")
  secondaryFont: string;    // Body font name (e.g., "Lato")
}
```

### Generator Function Signature

```typescript
export function generateHTML(
  templateType: TemplateType,
  data: FormData,
  customization: CustomizationSettings
): string {
  // Return complete HTML string
}
```

## Core Components

### 1. Font Loading

Always load fonts from Google Fonts in the HTML head:

```typescript
const getFontLink = (customization: CustomizationSettings): string => {
  const primary = customization.primaryFont.replace(/ /g, "+");
  const secondary = customization.secondaryFont.replace(/ /g, "+");
  return `<link href="https://fonts.googleapis.com/css2?family=${primary}:wght@400;700&family=${secondary}:wght@400;600&display=swap" rel="stylesheet">`;
};
```

### 2. Base Styles

Create CSS that uses customization settings:

```typescript
const getBaseStyles = (customization: CustomizationSettings): string => `
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --accent-color: ${customization.accentColor};
      --primary-font: '${customization.primaryFont}', serif;
      --secondary-font: '${customization.secondaryFont}', sans-serif;
    }

    body {
      font-family: var(--secondary-font);
      line-height: 1.6;
      color: #2c3e50;
      background-color: #faf8f3;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--primary-font);
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    a {
      color: var(--accent-color);
      text-decoration: none;
      transition: opacity 0.3s ease;
    }

    a:hover {
      opacity: 0.8;
    }

    button {
      background-color: var(--accent-color);
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-family: var(--secondary-font);
      transition: opacity 0.3s ease;
    }

    button:hover {
      opacity: 0.9;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }
    }
  </style>
`;
```

### 3. Meta Tags

Include essential meta tags for responsiveness and SEO:

```typescript
const getMetaTags = (title: string): string => `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Website created with Template Website Builder">
  <title>${title}</title>
`;
```

### 4. Responsive CSS Grid

Use CSS Grid for responsive layouts:

```typescript
const getResponsiveGridCSS = (): string => `
  <style>
    .grid {
      display: grid;
      gap: 2rem;
    }

    .grid-2 {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .grid-3 {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    @media (max-width: 768px) {
      .grid-2,
      .grid-3 {
        grid-template-columns: 1fr;
      }
    }
  </style>
`;
```

## Template-Specific Generators

### Elegant Site Template

```typescript
export function generateElegantHTML(
  data: ElegantFormData,
  customization: CustomizationSettings
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      ${getMetaTags(data.siteName)}
      ${getFontLink(customization)}
      ${getBaseStyles(customization)}
      <style>
        header {
          background-color: #faf8f3;
          padding: 2rem 0;
          border-bottom: 1px solid #e8e4d9;
        }

        nav a {
          margin-right: 2rem;
          color: #2c3e50;
        }

        .hero {
          background: linear-gradient(135deg, #faf8f3 0%, #f5f1e8 100%);
          padding: 4rem 0;
          text-align: center;
        }

        .hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .hero p {
          font-size: 1.25rem;
          color: #666;
          margin-bottom: 2rem;
        }

        .section {
          padding: 4rem 0;
        }

        .section h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
        }

        footer {
          background-color: #2c3e50;
          color: white;
          padding: 2rem 0;
          text-align: center;
          margin-top: 4rem;
        }

        footer a {
          color: var(--accent-color);
        }
      </style>
    </head>
    <body>
      <header>
        <div class="container">
          <h1>${data.siteName}</h1>
          <p>${data.tagline}</p>
        </div>
      </header>

      <section class="hero">
        <div class="container">
          <h2>${data.heroTitle}</h2>
          <p>${data.heroDescription}</p>
          <button>Get Started</button>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2>${data.aboutTitle}</h2>
          <p>${data.aboutContent}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2>Services</h2>
          <div class="grid grid-3">
            <div>
              <h3>${data.service1}</h3>
              <p>Professional service offering</p>
            </div>
            <div>
              <h3>${data.service2}</h3>
              <p>Professional service offering</p>
            </div>
            <div>
              <h3>${data.service3}</h3>
              <p>Professional service offering</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div class="container">
          <p>Email: <a href="mailto:${data.email}">${data.email}</a></p>
          <p>Phone: <a href="tel:${data.phone}">${data.phone}</a></p>
          <p>&copy; 2024 ${data.siteName}. All rights reserved.</p>
        </div>
      </footer>
    </body>
    </html>
  `;
}
```

### Portfolio Template

```typescript
export function generatePortfolioHTML(
  data: PortfolioFormData,
  customization: CustomizationSettings
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      ${getMetaTags(data.portfolioName)}
      ${getFontLink(customization)}
      ${getBaseStyles(customization)}
      <style>
        header {
          background-color: white;
          padding: 2rem 0;
          border-bottom: 1px solid #e8e4d9;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .hero {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          padding: 6rem 0;
          text-align: center;
        }

        .hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .projects {
          padding: 4rem 0;
        }

        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .project-card {
          background: white;
          border: 1px solid #e8e4d9;
          border-radius: 0.5rem;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-5px);
        }

        .project-card h3 {
          padding: 1.5rem;
          background-color: var(--accent-color);
          color: white;
        }

        .project-card p {
          padding: 1.5rem;
        }

        .skills {
          padding: 4rem 0;
          background-color: #f5f1e8;
        }

        .skill-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 2rem;
        }

        .skill-tag {
          background-color: var(--accent-color);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.9rem;
        }

        footer {
          background-color: #2c3e50;
          color: white;
          padding: 2rem 0;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <header>
        <div class="container">
          <h1>${data.portfolioName}</h1>
          <p>${data.tagline}</p>
        </div>
      </header>

      <section class="hero">
        <div class="container">
          <h2>${data.heroTitle}</h2>
          <p>${data.heroDescription}</p>
        </div>
      </section>

      <section class="projects">
        <div class="container">
          <h2>Featured Projects</h2>
          <div class="project-grid">
            <div class="project-card">
              <h3>${data.project1}</h3>
              <p>Description of your project</p>
            </div>
            <div class="project-card">
              <h3>${data.project2}</h3>
              <p>Description of your project</p>
            </div>
            <div class="project-card">
              <h3>${data.project3}</h3>
              <p>Description of your project</p>
            </div>
          </div>
        </div>
      </section>

      <section class="skills">
        <div class="container">
          <h2>Skills</h2>
          <div class="skill-list">
            <span class="skill-tag">${data.skill1}</span>
            <span class="skill-tag">${data.skill2}</span>
            <span class="skill-tag">${data.skill3}</span>
          </div>
        </div>
      </section>

      <footer>
        <div class="container">
          <p>Email: <a href="mailto:${data.email}">${data.email}</a></p>
          <p>Phone: <a href="tel:${data.phone}">${data.phone}</a></p>
          <p>&copy; 2024 ${data.portfolioName}. All rights reserved.</p>
        </div>
      </footer>
    </body>
    </html>
  `;
}
```

## Best Practices

### 1. Escape User Input

Always escape user input to prevent XSS attacks:

```typescript
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Use when injecting user data:
<h1>${escapeHtml(data.siteName)}</h1>
```

### 2. Optimize CSS

Inline all CSS to avoid external dependencies:

```typescript
// Good: Inline styles
<style>
  body { font-family: var(--secondary-font); }
</style>

// Avoid: External stylesheets
<link rel="stylesheet" href="styles.css">
```

### 3. Responsive Images

Use responsive image techniques:

```typescript
<img
  src="image.jpg"
  alt="Description"
  style="max-width: 100%; height: auto; display: block;"
>
```

### 4. Semantic HTML

Use semantic HTML5 elements:

```typescript
<header>...</header>
<nav>...</nav>
<main>...</main>
<section>...</section>
<article>...</article>
<footer>...</footer>
```

### 5. Mobile-First CSS

Start with mobile styles, then add desktop enhancements:

```typescript
<style>
  /* Mobile styles (default) */
  .container { padding: 1rem; }

  /* Desktop styles */
  @media (min-width: 768px) {
    .container { padding: 2rem; }
  }
</style>
```

## Testing Generated HTML

### 1. Validate Structure

Ensure the HTML is valid:
- Proper DOCTYPE declaration
- Matching opening/closing tags
- Valid meta tags
- Semantic structure

### 2. Test Responsiveness

Check on multiple screen sizes:
- Mobile (320px - 480px)
- Tablet (481px - 768px)
- Desktop (769px+)

### 3. Test Customizations

Verify customizations apply correctly:
- Colors render as expected
- Fonts load and display correctly
- Accent color appears in buttons, links, etc.

### 4. Test Content Injection

Ensure user content displays correctly:
- Text content renders without HTML injection
- Line breaks and formatting preserved
- Special characters escaped properly

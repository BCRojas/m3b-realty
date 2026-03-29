# Template Examples

This reference contains complete, working examples of all four template types with their form data structures and HTML generation logic.

## Template Data Structures

### Elegant Site Template

**Form Data:**
```typescript
interface ElegantFormData {
  // Site Information
  siteName: string;
  tagline: string;

  // Hero Section
  heroTitle: string;
  heroDescription: string;

  // About Section
  aboutTitle: string;
  aboutContent: string;

  // Services Section
  service1: string;
  service2: string;
  service3: string;

  // Contact Information
  email: string;
  phone: string;
}
```

**Default Data:**
```typescript
{
  siteName: "My Elegant Site",
  tagline: "Crafting Digital Experiences",
  heroTitle: "Welcome to Excellence",
  heroDescription: "Discover a refined approach to web design and digital storytelling.",
  aboutTitle: "About Us",
  aboutContent: "We create beautiful, functional digital experiences that inspire and engage.",
  service1: "Web Design",
  service2: "Development",
  service3: "Consulting",
  email: "hello@example.com",
  phone: "+1 (555) 123-4567"
}
```

**Form Fields:**
```typescript
[
  {
    id: "siteName",
    label: "Site Name",
    placeholder: "My Elegant Site",
    type: "text",
    section: "Site Information"
  },
  {
    id: "tagline",
    label: "Tagline",
    placeholder: "Your tagline here",
    type: "text",
    section: "Site Information"
  },
  {
    id: "heroTitle",
    label: "Hero Title",
    placeholder: "Welcome to Excellence",
    type: "text",
    section: "Hero Section"
  },
  {
    id: "heroDescription",
    label: "Hero Description",
    placeholder: "Describe your value proposition",
    type: "textarea",
    section: "Hero Section",
    rows: 3
  },
  {
    id: "aboutTitle",
    label: "About Section Title",
    placeholder: "About Us",
    type: "text",
    section: "About Section"
  },
  {
    id: "aboutContent",
    label: "About Content",
    placeholder: "Tell your story",
    type: "textarea",
    section: "About Section",
    rows: 4
  },
  {
    id: "service1",
    label: "Service 1",
    placeholder: "Web Design",
    type: "text",
    section: "Services Section"
  },
  {
    id: "service2",
    label: "Service 2",
    placeholder: "Development",
    type: "text",
    section: "Services Section"
  },
  {
    id: "service3",
    label: "Service 3",
    placeholder: "Consulting",
    type: "text",
    section: "Services Section"
  },
  {
    id: "email",
    label: "Email",
    placeholder: "your@email.com",
    type: "email",
    section: "Contact Information"
  },
  {
    id: "phone",
    label: "Phone",
    placeholder: "+1 (555) 123-4567",
    type: "tel",
    section: "Contact Information"
  }
]
```

### Portfolio Template

**Form Data:**
```typescript
interface PortfolioFormData {
  // Site Information
  portfolioName: string;
  tagline: string;

  // Hero Section
  heroTitle: string;
  heroDescription: string;

  // Projects
  project1: string;
  project2: string;
  project3: string;

  // Skills
  skill1: string;
  skill2: string;
  skill3: string;

  // Contact
  email: string;
  phone: string;
}
```

**Default Data:**
```typescript
{
  portfolioName: "Creative Studio",
  tagline: "Showcasing work and projects",
  heroTitle: "Showcase Your Work",
  heroDescription: "Display your best projects and attract new clients",
  project1: "Project One",
  project2: "Project Two",
  project3: "Project Three",
  skill1: "Web Design",
  skill2: "Development",
  skill3: "Strategy",
  email: "hello@example.com",
  phone: "+1 (555) 123-4567"
}
```

**Form Fields:**
```typescript
[
  {
    id: "portfolioName",
    label: "Portfolio Name",
    placeholder: "Creative Studio",
    type: "text",
    section: "Site Information"
  },
  {
    id: "tagline",
    label: "Tagline",
    placeholder: "Your professional tagline",
    type: "text",
    section: "Site Information"
  },
  {
    id: "heroTitle",
    label: "Hero Title",
    placeholder: "Showcase Your Work",
    type: "text",
    section: "Hero Section"
  },
  {
    id: "heroDescription",
    label: "Hero Description",
    placeholder: "Brief description of your work",
    type: "textarea",
    section: "Hero Section",
    rows: 3
  },
  {
    id: "project1",
    label: "Project 1 Name",
    placeholder: "Project Name",
    type: "text",
    section: "Projects"
  },
  {
    id: "project2",
    label: "Project 2 Name",
    placeholder: "Project Name",
    type: "text",
    section: "Projects"
  },
  {
    id: "project3",
    label: "Project 3 Name",
    placeholder: "Project Name",
    type: "text",
    section: "Projects"
  },
  {
    id: "skill1",
    label: "Skill 1",
    placeholder: "Your skill",
    type: "text",
    section: "Skills"
  },
  {
    id: "skill2",
    label: "Skill 2",
    placeholder: "Your skill",
    type: "text",
    section: "Skills"
  },
  {
    id: "skill3",
    label: "Skill 3",
    placeholder: "Your skill",
    type: "text",
    section: "Skills"
  },
  {
    id: "email",
    label: "Email",
    placeholder: "your@email.com",
    type: "email",
    section: "Contact"
  },
  {
    id: "phone",
    label: "Phone",
    placeholder: "+1 (555) 123-4567",
    type: "tel",
    section: "Contact"
  }
]
```

### Blog Template

**Form Data:**
```typescript
interface BlogFormData {
  // Site Information
  blogTitle: string;
  tagline: string;

  // Featured Article
  article1Title: string;
  article1Description: string;

  // Categories
  category1: string;
  category2: string;
  category3: string;

  // About
  aboutContent: string;

  // Contact
  email: string;
  phone: string;
}
```

**Default Data:**
```typescript
{
  blogTitle: "My Blog",
  tagline: "Sharing thoughts and insights",
  article1Title: "Welcome to My Blog",
  article1Description: "This is where I share my thoughts, insights, and stories",
  category1: "Technology",
  category2: "Design",
  category3: "Business",
  aboutContent: "Welcome to my blog where I share insights on web development and design.",
  email: "hello@example.com",
  phone: "+1 (555) 123-4567"
}
```

**Form Fields:**
```typescript
[
  {
    id: "blogTitle",
    label: "Blog Title",
    placeholder: "My Blog",
    type: "text",
    section: "Site Information"
  },
  {
    id: "tagline",
    label: "Tagline",
    placeholder: "Your blog tagline",
    type: "text",
    section: "Site Information"
  },
  {
    id: "article1Title",
    label: "Featured Article Title",
    placeholder: "Article title",
    type: "text",
    section: "Featured Article"
  },
  {
    id: "article1Description",
    label: "Featured Article Description",
    placeholder: "Brief article description",
    type: "textarea",
    section: "Featured Article",
    rows: 4
  },
  {
    id: "category1",
    label: "Category 1",
    placeholder: "Category name",
    type: "text",
    section: "Categories"
  },
  {
    id: "category2",
    label: "Category 2",
    placeholder: "Category name",
    type: "text",
    section: "Categories"
  },
  {
    id: "category3",
    label: "Category 3",
    placeholder: "Category name",
    type: "text",
    section: "Categories"
  },
  {
    id: "aboutContent",
    label: "About Content",
    placeholder: "Tell readers about yourself",
    type: "textarea",
    section: "About",
    rows: 4
  },
  {
    id: "email",
    label: "Email",
    placeholder: "your@email.com",
    type: "email",
    section: "Contact"
  },
  {
    id: "phone",
    label: "Phone",
    placeholder: "+1 (555) 123-4567",
    type: "tel",
    section: "Contact"
  }
]
```

### Business Template

**Form Data:**
```typescript
interface BusinessFormData {
  // Site Information
  companyName: string;
  tagline: string;

  // Hero Section
  heroTitle: string;
  heroDescription: string;

  // Services
  service1: string;
  service1Description: string;
  service2: string;
  service2Description: string;
  service3: string;
  service3Description: string;

  // Testimonials
  testimonial1: string;
  testimonial1Author: string;
  testimonial2: string;
  testimonial2Author: string;

  // Contact
  email: string;
  phone: string;
}
```

**Default Data:**
```typescript
{
  companyName: "Business Solutions",
  tagline: "Professional services for your business",
  heroTitle: "Grow Your Business",
  heroDescription: "We provide comprehensive business solutions tailored to your needs",
  service1: "Consulting",
  service1Description: "Expert business consulting services",
  service2: "Development",
  service2Description: "Custom software development solutions",
  service3: "Support",
  service3Description: "24/7 professional support",
  testimonial1: "Great service and professional team!",
  testimonial1Author: "John Doe",
  testimonial2: "Highly recommend their solutions",
  testimonial2Author: "Jane Smith",
  email: "hello@example.com",
  phone: "+1 (555) 123-4567"
}
```

**Form Fields:**
```typescript
[
  {
    id: "companyName",
    label: "Company Name",
    placeholder: "Business Solutions",
    type: "text",
    section: "Site Information"
  },
  {
    id: "tagline",
    label: "Tagline",
    placeholder: "Your company tagline",
    type: "text",
    section: "Site Information"
  },
  {
    id: "heroTitle",
    label: "Hero Title",
    placeholder: "Grow Your Business",
    type: "text",
    section: "Hero Section"
  },
  {
    id: "heroDescription",
    label: "Hero Description",
    placeholder: "Describe your value proposition",
    type: "textarea",
    section: "Hero Section",
    rows: 3
  },
  {
    id: "service1",
    label: "Service 1 Name",
    placeholder: "Service name",
    type: "text",
    section: "Services"
  },
  {
    id: "service1Description",
    label: "Service 1 Description",
    placeholder: "Service description",
    type: "textarea",
    section: "Services",
    rows: 2
  },
  {
    id: "service2",
    label: "Service 2 Name",
    placeholder: "Service name",
    type: "text",
    section: "Services"
  },
  {
    id: "service2Description",
    label: "Service 2 Description",
    placeholder: "Service description",
    type: "textarea",
    section: "Services",
    rows: 2
  },
  {
    id: "service3",
    label: "Service 3 Name",
    placeholder: "Service name",
    type: "text",
    section: "Services"
  },
  {
    id: "service3Description",
    label: "Service 3 Description",
    placeholder: "Service description",
    type: "textarea",
    section: "Services",
    rows: 2
  },
  {
    id: "testimonial1",
    label: "Testimonial 1",
    placeholder: "Client testimonial",
    type: "textarea",
    section: "Testimonials",
    rows: 2
  },
  {
    id: "testimonial1Author",
    label: "Testimonial 1 Author",
    placeholder: "Client name",
    type: "text",
    section: "Testimonials"
  },
  {
    id: "testimonial2",
    label: "Testimonial 2",
    placeholder: "Client testimonial",
    type: "textarea",
    section: "Testimonials",
    rows: 2
  },
  {
    id: "testimonial2Author",
    label: "Testimonial 2 Author",
    placeholder: "Client name",
    type: "text",
    section: "Testimonials"
  },
  {
    id: "email",
    label: "Email",
    placeholder: "your@email.com",
    type: "email",
    section: "Contact"
  },
  {
    id: "phone",
    label: "Phone",
    placeholder: "+1 (555) 123-4567",
    type: "tel",
    section: "Contact"
  }
]
```

## Implementation Checklist

When implementing a new template, ensure:

- [ ] Define form data interface with all required fields
- [ ] Create default data object with sensible sample values
- [ ] Define form fields array with proper section grouping
- [ ] Implement HTML generator function
- [ ] Test with sample data and all customization options
- [ ] Verify responsive layout on mobile/tablet/desktop
- [ ] Check that customization colors apply correctly
- [ ] Verify fonts load and display correctly
- [ ] Ensure user input is properly escaped
- [ ] Test download functionality
- [ ] Validate HTML structure and semantics

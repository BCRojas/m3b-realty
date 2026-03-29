# HTML Generator Patterns

Common CSS and HTML patterns used across all templates in the website builder.

## Table of Contents
- [Sticky Header with Hamburger Nav](#sticky-header)
- [Hero Section with Background Image](#hero-section)
- [Section Wrapper](#section-wrapper)
- [Card Grid](#card-grid)
- [Team Member Card](#team-member-card)
- [Photo Gallery Grid](#photo-gallery-grid)
- [Footer](#footer)
- [Responsive Breakpoints](#responsive-breakpoints)

---

## Sticky Header with Hamburger Nav

```css
header {
  background-color: #1a2744;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0,0,0,0.18);
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
}
.logo-image { height: 38px; width: auto; max-width: 110px; object-fit: contain; }
.nav-links { display: flex; gap: 2rem; list-style: none; }
.nav-links a {
  color: rgba(255,255,255,0.82);
  font-size: 0.9rem;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  padding-bottom: 0.2rem;
  transition: color 200ms, border-color 200ms;
}
.nav-links a:hover, .nav-links a.active { color: #fff; border-bottom-color: ${accent}; }
/* Hamburger — hidden on desktop */
.hamburger { display: none !important; flex-direction: column; cursor: pointer; gap: 0.35rem; background: none; border: none; padding: 0.5rem; }
.hamburger span { width: 24px; height: 2px; background-color: #fff; border-radius: 2px; transition: all 280ms ease; }
.hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(8px,8px); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(6px,-6px); }
@media (max-width: 768px) {
  .hamburger { display: flex !important; }
  header { position: relative; }
  .nav-links-wrap { position: absolute; top: 68px; left: 0; right: 0; background-color: #1a2744; max-height: 0; overflow: hidden; opacity: 0; transition: max-height 320ms ease, opacity 320ms ease; }
  .nav-links-wrap.active { max-height: 400px; opacity: 1; }
  .nav-links { flex-direction: column; gap: 0; padding: 0.5rem 2rem 1rem; }
}
```

HTML:
```html
<header>
  <div class="header-inner">
    <div class="logo">
      ${customization.logo ? `<img src="${customization.logo}" alt="Logo" class="logo-image" />` : ''}
      ${data.siteName}
    </div>
    <button class="hamburger" id="hamburger-btn" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
    <div class="nav-links-wrap" id="nav-menu">
      <ul class="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
  </div>
</header>
```

Script (add inside `<script>` at end of body):
```js
const hamburgerBtn = document.getElementById('hamburger-btn');
const navMenu = document.getElementById('nav-menu');
hamburgerBtn.addEventListener('click', () => {
  hamburgerBtn.classList.toggle('active');
  navMenu.classList.toggle('active');
});
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburgerBtn.classList.remove('active');
    navMenu.classList.remove('active');
  });
});
```

---

## Hero Section with Background Image

```css
.hero {
  background: ${heroBackground};  /* from getHeroBackground() */
  background-size: cover;
  background-position: center;
  padding: 7rem 2rem 5rem;
  text-align: center;
}
.hero h1 { font-size: 3rem; color: #1a2744; margin-bottom: 1rem; }
.hero p { font-size: 1.15rem; color: #5a6a7a; max-width: 640px; margin: 0 auto 2.5rem; line-height: 1.75; }
.hero-cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.btn-primary {
  background-color: ${accent};
  color: #fff;
  padding: 0.85rem 2rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: opacity 200ms;
}
.btn-primary:hover { opacity: 0.88; color: #fff; }
.btn-outline {
  border: 2px solid ${accent};
  color: ${accent};
  padding: 0.85rem 2rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 200ms;
}
.btn-outline:hover { background-color: ${accent}; color: #fff; }
```

---

## Section Wrapper

```css
.section-wrap { padding: 5rem 2rem; }
.section-wrap > * { max-width: 1200px; margin: 0 auto; }
.section-title {
  font-size: 2rem;
  color: #1a2744;
  text-align: center;
  margin-bottom: 0.75rem;
  position: relative;
  padding-bottom: 1rem;
}
.section-title::after {
  content: '';
  position: absolute;
  bottom: 0; left: 50%; transform: translateX(-50%);
  width: 48px; height: 3px;
  background-color: ${accent};
  border-radius: 2px;
}
.section-subtitle {
  text-align: center;
  color: #5a6a7a;
  font-size: 1.05rem;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.7;
}
```

---

## Card Grid

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(26,39,68,0.07);
  transition: transform 220ms, box-shadow 220ms;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(26,39,68,0.12); }
```

---

## Team Member Card

```css
.team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem; }
.team-card { background: #fff; border-radius: 10px; padding: 2rem 1.5rem; text-align: center; box-shadow: 0 2px 12px rgba(26,39,68,0.07); transition: transform 220ms; }
.team-card:hover { transform: translateY(-3px); }
.team-photo { width: 90px; height: 90px; border-radius: 50%; overflow: hidden; margin: 0 auto 1rem; border: 3px solid ${accent}; background-color: #e8edf5; display: flex; align-items: center; justify-content: center; }
.team-photo img { width: 100%; height: 100%; object-fit: cover; }
.team-photo-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: ${accent}; }
.team-name { font-size: 1.05rem; color: #1a2744; margin-bottom: 0.25rem; }
.team-role { font-size: 0.85rem; color: ${accent}; font-weight: 600; }
```

HTML:
```html
<div class="team-card">
  <div class="team-photo">
    ${customization.myMemberPhoto
      ? `<img src="${customization.myMemberPhoto}" alt="${data.member1Name}" />`
      : `<div class="team-photo-placeholder">👤</div>`}
  </div>
  <div class="team-name">${data.member1Name || 'Team Member'}</div>
  <div class="team-role">${data.member1Role || 'Role'}</div>
  <p>${data.member1Bio || ''}</p>
</div>
```

---

## Photo Gallery Grid

```css
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
.gallery-item {
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background-color: #e8edf5;
}
.gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 350ms ease; }
.gallery-item:hover img { transform: scale(1.04); }
.gallery-placeholder {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 0.5rem; color: #8a9ab8; font-size: 0.8rem; text-align: center; padding: 1rem;
}
@media (max-width: 640px) { .gallery-grid { grid-template-columns: repeat(2, 1fr); } }
```

HTML (6-slot gallery):
```html
<div class="gallery-grid">
  ${customization.gallery1
    ? `<div class="gallery-item"><img src="${customization.gallery1}" alt="Photo 1" /></div>`
    : '<div class="gallery-item"><div class="gallery-placeholder">📷 Upload a photo</div></div>'}
  <!-- repeat for gallery2 ... gallery6 -->
</div>
```

---

## Footer

```css
footer { background-color: #111d36; color: #c8d4e8; padding: 3rem 2rem; text-align: center; }
.footer-inner { max-width: 1200px; margin: 0 auto; }
.footer-links { display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
.footer-links a { color: #8a9ab8; font-size: 0.9rem; transition: color 200ms; }
.footer-links a:hover { color: ${accent}; }
.social-links { display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem; }
.social-links a { display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; background-color: rgba(255,255,255,0.08); color: #c8d4e8; font-size: 1rem; transition: all 200ms; }
.social-links a:hover { background-color: ${accent}; color: #fff; transform: translateY(-2px); }
.footer-copy { font-size: 0.82rem; color: #5a6a7a; margin-top: 0.5rem; }
```

---

## Responsive Breakpoints

Standard breakpoints used across all templates:

```css
@media (max-width: 768px) {
  .hero h1 { font-size: 2rem; }
  .section-title { font-size: 1.7rem; }
}
@media (max-width: 640px) {
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .card-grid { grid-template-columns: 1fr; }
}
```

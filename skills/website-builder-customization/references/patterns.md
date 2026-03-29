# Code Patterns Reference

## ScaledIframePreview Component

Full component for rendering an iframe at a fixed canonical width and scaling it to fit the container:

```tsx
import { useRef, useEffect, useState, useCallback } from "react";

interface ScaledIframePreviewProps {
  srcDoc: string;
  canonicalWidth: number;   // e.g. 1280, 768, 375
  canonicalHeight?: number; // default 900
  className?: string;
}

export function ScaledIframePreview({
  srcDoc,
  canonicalWidth,
  canonicalHeight = 900,
  className,
}: ScaledIframePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const recalculate = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    setScale(containerWidth / canonicalWidth);
  }, [canonicalWidth]);

  useEffect(() => {
    recalculate();
    const observer = new ResizeObserver(recalculate);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [recalculate]);

  const scaledHeight = canonicalHeight * scale;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: scaledHeight, overflow: "hidden", position: "relative" }}
    >
      <iframe
        srcDoc={srcDoc}
        style={{
          width: canonicalWidth,
          height: canonicalHeight,
          border: "none",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          pointerEvents: "none",
        }}
        sandbox="allow-scripts"
        title="preview"
      />
    </div>
  );
}
```

Usage in the preview modal:

```tsx
// Desktop
<ScaledIframePreview srcDoc={htmlContent} canonicalWidth={1280} canonicalHeight={900} />

// Tablet (inside a bezel wrapper)
<ScaledIframePreview srcDoc={htmlContent} canonicalWidth={768} canonicalHeight={1024} />

// Mobile (inside a phone bezel wrapper)
<ScaledIframePreview srcDoc={htmlContent} canonicalWidth={375} canonicalHeight={812} />
```

---

## Background Image Opacity — White Overlay Pattern

### In the HTML generator

```ts
function getHeroBackground(c: CustomizationSettings): string {
  if (!c.backgroundImage) {
    return `background-color: ${c.accentColor};`;
  }
  const overlayAlpha = (1 - c.backgroundOpacity).toFixed(2);
  return `background-image: url('${c.backgroundImage}'); background-size: cover; background-position: center; position: relative;`;
}

// Hero section HTML structure
function heroSection(c: CustomizationSettings, data: Record<string, string>): string {
  const bgStyle = getHeroBackground(c);
  const overlayAlpha = c.backgroundImage ? (1 - c.backgroundOpacity).toFixed(2) : "0";
  const overlay = c.backgroundImage
    ? `<div style="position:absolute;inset:0;background:rgba(255,255,255,${overlayAlpha});pointer-events:none;"></div>`
    : "";
  return `
    <section style="${bgStyle}">
      ${overlay}
      <div style="position:relative;z-index:1;">
        <!-- hero content -->
      </div>
    </section>
  `;
}
```

### In the React panel preview

```tsx
// Live preview div inside CustomizationPanel
<div
  style={{
    backgroundImage: settings.backgroundImage ? `url(${settings.backgroundImage})` : undefined,
    backgroundColor: settings.backgroundImage ? undefined : settings.accentColor,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  }}
>
  {settings.backgroundImage && (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `rgba(255,255,255,${(1 - settings.backgroundOpacity).toFixed(2)})`,
      }}
    />
  )}
  <div style={{ position: "relative", zIndex: 1 }}>
    {/* preview content */}
  </div>
</div>
```

---

## Upload Button Pattern

Replace raw `<input type="file">` with a styled button that triggers a hidden input:

```tsx
const bgInputRef = useRef<HTMLInputElement>(null);

// Button
<Button
  variant="outline"
  className="w-full"
  onClick={() => bgInputRef.current?.click()}
>
  <Upload className="w-4 h-4 mr-2" />
  Upload Background Image
</Button>

// Hidden input
<input
  ref={bgInputRef}
  type="file"
  accept="image/png,image/jpeg,image/jpg,image/webp"
  className="hidden"
  onChange={handleBackgroundImageUpload}
/>

// Thumbnail once uploaded
{settings.backgroundImage && (
  <div className="mt-3 space-y-2">
    <div className="aspect-video rounded-md overflow-hidden border">
      <img src={settings.backgroundImage} className="w-full h-full object-cover" />
    </div>
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={() => bgInputRef.current?.click()}>
        Change Image
      </Button>
      <Button size="sm" variant="outline" onClick={() => onSettingsChange({ ...settings, backgroundImage: undefined })}>
        Remove
      </Button>
    </div>
  </div>
)}
```

---

## State Reset Pattern

```ts
// ✅ Define outside the component to avoid unstable references
const DEFAULT_CUSTOMIZATION: CustomizationSettings = {
  accentColor: "#7a9b7f",
  primaryFont: "Merriweather",
  secondaryFont: "Lato",
  fontColor: "#2c3e50",
  backgroundOpacity: 0.9,
  logo: undefined,
  backgroundImage: undefined,
};

// ✅ Inside the component
const resetAllState = (template: TemplateType = selectedTemplate) => {
  setFormData({ ...TEMPLATES[template].defaultData });
  setCustomization({ ...DEFAULT_CUSTOMIZATION });
};

// ✅ "← Change Template" button
<Button
  variant="outline"
  onClick={() => {
    resetAllState();
    setShowTemplateSelector(true);
  }}
>
  ← Change Template
</Button>
```

---

## Popup-Safe Checkout

```ts
// ✅ Open window synchronously BEFORE the async call
const handleCheckout = async () => {
  const newWindow = window.open("", "_blank"); // must be synchronous
  try {
    const result = await checkoutMutation.mutateAsync({ htmlContent, siteName });
    if (newWindow) newWindow.location.href = result.checkoutUrl;
  } catch (err) {
    if (newWindow) newWindow.close();
    toast.error("Checkout failed. Please try again.");
  }
};
```

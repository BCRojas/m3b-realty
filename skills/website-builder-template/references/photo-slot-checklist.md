# Photo Slot Checklist

When adding a new photo upload slot to any template, update all 5 locations below. Missing any one will cause TypeScript errors or silent failures.

## Checklist

### 1. `CustomizationSettings` interface — `htmlGenerators.ts`

```ts
// Add the new field with a comment showing template name and aspect ratio
// MyTemplate: hero photo (16:9)
myTemplateHeroPhoto?: string;
```

### 2. `CropperTarget` union — `CustomizationPanel.tsx`

```ts
type CropperTarget =
  | "logo" | "background"
  // ... existing ...
  | "myTemplateHeroPhoto";   // ← add here
```

### 3. `CROPPER_ASPECTS` map — `CustomizationPanel.tsx`

```ts
const CROPPER_ASPECTS: Record<CropperTarget, number> = {
  // ... existing ...
  myTemplateHeroPhoto: 16 / 9,   // ← add here
};
```

### 4. `CROPPER_LABELS` map — `CustomizationPanel.tsx`

```ts
const CROPPER_LABELS: Record<CropperTarget, string> = {
  // ... existing ...
  myTemplateHeroPhoto: "Hero Photo",   // ← add here
};
```

### 5. `useRef` + `inputRefs` — `CustomizationPanel.tsx`

```ts
// Add ref declaration near other refs:
const myTemplateHeroPhotoRef = useRef<HTMLInputElement>(null);

// Add to inputRefs object:
const inputRefs: Record<CropperTarget, React.RefObject<HTMLInputElement | null>> = {
  // ... existing ...
  myTemplateHeroPhoto: myTemplateHeroPhotoRef,
};
```

### 6. `handleCropComplete` case — `CustomizationPanel.tsx`

```ts
case "myTemplateHeroPhoto":
  setSettings(prev => ({ ...prev, myTemplateHeroPhoto: croppedImage }));
  break;
```

**Note:** The `background` target is the only one that maps to a different key (`backgroundImage`). All other targets map 1:1.

### 7. JSX upload card — `CustomizationPanel.tsx`

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
        compact   {/* use compact for square/portrait; omit for full-width landscape */}
      />
      <input
        ref={myTemplateHeroPhotoRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => makeFileChangeHandler("myTemplateHeroPhoto")(e)}
      />
    </CardContent>
  </Card>
)}
```

### 8. `DEFAULT_CUSTOMIZATION` — `Home.tsx`

```ts
const DEFAULT_CUSTOMIZATION: CustomizationSettings = {
  // ... existing ...
  myTemplateHeroPhoto: undefined,
};
```

### 9. HTML generator — `htmlGenerators.ts`

```ts
// In the template's HTML body, render the photo or a placeholder:
${customization.myTemplateHeroPhoto
  ? `<img src="${customization.myTemplateHeroPhoto}" alt="Hero" class="hero-photo" />`
  : '<div class="hero-photo-placeholder">Upload a photo</div>'}
```

---

## Aspect Ratio Reference

| Slot type | Ratio | Use case |
|-----------|-------|----------|
| Profile / team member | 1:1 | Circular avatar crops |
| Gallery / story photo | 4:3 | Landscape event photos |
| Hero / banner | 16:9 | Wide hero banners |
| Menu / product card | 3:4 | Portrait product shots |
| Logo | free | Logos vary — use free crop |

---

## Removing a Photo Slot

Reverse all 9 steps above. Also search for the field name across the codebase:

```bash
grep -rn "myTemplateHeroPhoto" /home/ubuntu/website_builder/client
```

Ensure 0 results remain after removal.

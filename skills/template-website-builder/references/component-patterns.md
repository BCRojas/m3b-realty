# Component Patterns for Template Website Builders

## TemplateSelector Component

Displays available templates as selectable cards with preview and selection options.

### Props
```typescript
interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onSelectTemplate: (template: TemplateType) => void;
}
```

### Key Features
- Card-based layout with template icon, name, description
- "Preview" button opens full-page preview modal
- "Choose" button selects template immediately
- Visual indication of currently selected template
- Responsive grid layout (1-4 columns based on screen size)

### Implementation Pattern
```typescript
export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  const [previewTemplate, setPreviewTemplate] = useState<TemplateType | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(TEMPLATES).map(([id, template]) => (
        <Card key={id} className={selectedTemplate === id ? "border-accent" : ""}>
          <CardHeader>
            <div className="text-3xl mb-2">{template.icon}</div>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={() => setPreviewTemplate(id as TemplateType)} variant="outline">
              Preview
            </Button>
            <Button onClick={() => onSelectTemplate(id as TemplateType)}>
              {selectedTemplate === id ? "Selected" : "Choose"}
            </Button>
          </CardContent>
        </Card>
      ))}
      {previewTemplate && (
        <TemplatePreviewModal
          isOpen={!!previewTemplate}
          templateId={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={onSelectTemplate}
        />
      )}
    </div>
  );
}
```

## TemplatePreviewModal Component

Displays a full-page preview of a template in a modal dialog.

### Props
```typescript
interface TemplatePreviewModalProps {
  isOpen: boolean;
  templateId: TemplateType | null;
  onClose: () => void;
  onSelect: (template: TemplateType) => void;
}
```

### Key Features
- Full-screen modal with scrollable preview
- Displays template name and description at top
- Shows complete website design with default data
- "Use This Template" button for direct selection
- Close button to dismiss modal

### Implementation Pattern
```typescript
export function TemplatePreviewModal({
  isOpen,
  templateId,
  onClose,
  onSelect,
}: TemplatePreviewModalProps) {
  if (!templateId) return null;

  const template = TEMPLATES[templateId];
  const defaultCustomization: CustomizationSettings = {
    accentColor: "#7a9b7f",
    primaryFont: "Merriweather",
    secondaryFont: "Lato",
  };
  const previewHTML = generateHTML(templateId, template.defaultData, defaultCustomization);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 flex flex-col">
        <DialogHeader className="border-b px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{template.name}</DialogTitle>
              <DialogDescription>{template.description}</DialogDescription>
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <iframe
            srcDoc={previewHTML}
            title={`${template.name} Preview`}
            className="w-full h-full border-0"
          />
        </div>
        <div className="border-t px-6 py-4 flex-shrink-0 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              onSelect(templateId);
              onClose();
            }}
          >
            Use This Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## CustomizationPanel Component

Provides color and font customization controls.

### Props
```typescript
interface CustomizationPanelProps {
  settings: CustomizationSettings;
  onSettingsChange: (settings: CustomizationSettings) => void;
}
```

### Key Features
- Color picker with 8 curated color swatches
- Font selectors for headline and body fonts
- Live preview of font selections
- Visual feedback for selected options
- Organized into two sections: Accent Color and Typography

### Implementation Pattern
```typescript
const COLOR_OPTIONS = [
  { name: "Sage Green", value: "#7a9b7f" },
  { name: "Ocean Blue", value: "#4a90a4" },
  { name: "Warm Terracotta", value: "#c97a5c" },
  { name: "Deep Plum", value: "#6b5b7d" },
  { name: "Forest Green", value: "#2d5a3d" },
  { name: "Burnt Orange", value: "#b85c2f" },
  { name: "Slate Blue", value: "#5a6b8f" },
  { name: "Dusty Rose", value: "#a87a7a" },
];

const HEADLINE_FONTS = ["Merriweather", "Playfair Display", "Lora", "Crimson Text", "Abril Fatface"];
const BODY_FONTS = ["Lato", "Inter", "Open Sans", "Poppins", "Source Sans Pro"];

export function CustomizationPanel({
  settings,
  onSettingsChange,
}: CustomizationPanelProps) {
  return (
    <div className="space-y-6">
      {/* Accent Color Section */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Accent Color</Label>
        <div className="grid grid-cols-4 gap-3">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color.value}
              onClick={() => onSettingsChange({ ...settings, accentColor: color.value })}
              className={`w-full aspect-square rounded-lg border-2 transition-all ${
                settings.accentColor === color.value
                  ? "border-gray-900 ring-2 ring-offset-2"
                  : "border-gray-200"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Typography Section */}
      <div>
        <Label htmlFor="primary-font" className="text-base font-semibold mb-3 block">
          Headline Font
        </Label>
        <Select value={settings.primaryFont} onValueChange={(value) =>
          onSettingsChange({ ...settings, primaryFont: value })
        }>
          <SelectTrigger id="primary-font">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HEADLINE_FONTS.map((font) => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 mt-2">
          <span style={{ fontFamily: settings.primaryFont }}>
            Preview: The quick brown fox jumps over the lazy dog
          </span>
        </p>
      </div>

      <div>
        <Label htmlFor="secondary-font" className="text-base font-semibold mb-3 block">
          Body Font
        </Label>
        <Select value={settings.secondaryFont} onValueChange={(value) =>
          onSettingsChange({ ...settings, secondaryFont: value })
        }>
          <SelectTrigger id="secondary-font">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BODY_FONTS.map((font) => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 mt-2">
          <span style={{ fontFamily: settings.secondaryFont }}>
            Preview: The quick brown fox jumps over the lazy dog
          </span>
        </p>
      </div>
    </div>
  );
}
```

## Form Field Organization Pattern

Organize form fields by section using tabs for better UX.

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

return (
  <Tabs defaultValue={Object.keys(fieldsBySection)[0]} className="w-full">
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Object.keys(fieldsBySection).map((section) => (
        <TabsTrigger key={section} value={section}>
          {section}
        </TabsTrigger>
      ))}
    </TabsList>

    {Object.entries(fieldsBySection).map(([section, fields]) => (
      <TabsContent key={section} value={section} className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{section}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={handleInputChange}
                    rows={field.rows || 3}
                  />
                ) : (
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={handleInputChange}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    ))}
  </Tabs>
);
```

## Live Preview Pattern

Display real-time preview using iframe with `srcDoc`:

```typescript
<div className="border rounded-lg overflow-hidden bg-white h-[600px]">
  <iframe
    srcDoc={generateHTML(selectedTemplate, initializedFormData, customization)}
    title="Website Preview"
    className="w-full h-full border-0"
  />
</div>
```

The iframe automatically updates whenever:
- Form data changes
- Customization settings change
- Template selection changes

## Download Pattern

Implement download functionality:

```typescript
const downloadHTML = () => {
  const html = generateHTML(selectedTemplate, initializedFormData, customization);
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(html));
  element.setAttribute(
    "download",
    `${initializedFormData.siteName.replace(/\s+/g, "-").toLowerCase()}.html`
  );
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
```

This creates a data URL, triggers a download, and cleans up the DOM element.

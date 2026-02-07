# Typography

## Font Families

### Headings: Anton
- **Font**: Anton (Google Fonts)
- **Usage**: All headings (h1, h2, h3, h4, h5, h6)
- **Weight**: 400 (regular - Anton only has one weight)
- **Style**: Bold, condensed, impactful
- **Character**: Strong, modern, professional

### Body Text: Manrope
- **Font**: Manrope (Google Fonts)
- **Usage**: Paragraphs, body text, UI elements
- **Weights**: 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)
- **Style**: Clean, readable, modern sans-serif
- **Character**: Friendly, approachable, professional

## Font Loading

### Google Fonts Import

```html
<!-- In index.html or main layout -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### CSS Variables (Tailwind/Vue)

```css
:root {
  --font-heading: 'Anton', sans-serif;
  --font-body: 'Manrope', sans-serif;
}

body {
  font-family: var(--font-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 400; /* Anton only has one weight */
  letter-spacing: 0.5px;
}
```

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: ['Anton', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
    },
  },
}
```

## Typography Scale

### Headings (Anton)

| Element | Size | Line Height | Letter Spacing | Usage |
|---------|------|-------------|----------------|-------|
| h1 | 48px (3rem) | 1.1 | 1px | Page titles, hero headings |
| h2 | 36px (2.25rem) | 1.2 | 0.5px | Section headings |
| h3 | 30px (1.875rem) | 1.3 | 0.5px | Subsection headings |
| h4 | 24px (1.5rem) | 1.4 | 0.5px | Card titles, small headings |
| h5 | 20px (1.25rem) | 1.5 | 0.5px | Minor headings |
| h6 | 18px (1.125rem) | 1.5 | 0.5px | Smallest headings |

### Body Text (Manrope)

| Element | Size | Line Height | Weight | Usage |
|---------|------|-------------|--------|-------|
| Large | 18px (1.125rem) | 1.6 | 400 | Lead paragraphs, emphasis |
| Base | 16px (1rem) | 1.6 | 400 | Body text, paragraphs |
| Small | 14px (0.875rem) | 1.5 | 400 | Captions, helper text |
| XSmall | 12px (0.75rem) | 1.4 | 400 | Labels, fine print |

### UI Elements (Manrope)

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| Button Large | 16px | 600 | Primary buttons |
| Button Base | 14px | 600 | Standard buttons |
| Button Small | 12px | 600 | Small buttons |
| Input | 16px | 400 | Form inputs |
| Label | 14px | 500 | Form labels |
| Link | 16px | 500 | Links |

## Usage Guidelines

### Headings (Anton)

**Do's:**
- ✅ Use for all heading levels (h1-h6)
- ✅ Use for logo text
- ✅ Use for prominent call-to-action text
- ✅ Maintain consistent letter spacing
- ✅ Use sparingly for maximum impact

**Don'ts:**
- ❌ Don't use for body text
- ❌ Don't use for long paragraphs
- ❌ Don't use multiple weights (only 400 available)
- ❌ Don't use all caps unnecessarily (font is already bold)

### Body Text (Manrope)

**Do's:**
- ✅ Use for all body text and paragraphs
- ✅ Use for form inputs and labels
- ✅ Use for buttons and UI elements
- ✅ Use appropriate weights (400, 500, 600, 700)
- ✅ Maintain good line height for readability

**Don'ts:**
- ❌ Don't use for headings
- ❌ Don't use weights below 400
- ❌ Don't use excessive letter spacing

## Examples

### Heading Examples

```html
<h1 class="font-heading text-5xl">Welcome to CADANS</h1>
<h2 class="font-heading text-4xl">Grading Sessions</h2>
<h3 class="font-heading text-3xl">Meeting Details</h3>
```

### Body Text Examples

```html
<p class="font-body text-base">
  This is body text using Manrope. It's clean, readable, and professional.
</p>

<p class="font-body text-lg font-medium">
  This is emphasized text with medium weight.
</p>

<p class="font-body text-sm text-gray-600">
  This is small helper text or captions.
</p>
```

### Button Examples

```html
<button class="font-body text-base font-semibold">
  Submit Grade
</button>

<button class="font-body text-sm font-semibold">
  Cancel
</button>
```

## Logo Typography

### Text Logo
- **Font**: Anton
- **Size**: 40px (or scalable)
- **Weight**: 400
- **Letter Spacing**: 2px
- **Color**: `#1e293b` (light mode), `#f1f5f9` (dark mode)

### Logo Tagline
- **Font**: Manrope
- **Size**: 8-9px
- **Weight**: 500
- **Letter Spacing**: 1-1.2px
- **Color**: `#64748b` (light mode), `#94a3b8` (dark mode)

## Responsive Typography

### Mobile
- Reduce heading sizes by 20-30%
- Maintain body text at 16px minimum
- Adjust line heights for smaller screens

### Tablet
- Slightly reduce heading sizes
- Maintain comfortable reading sizes

### Desktop
- Full typography scale
- Generous spacing and line heights

## Accessibility

### Font Sizes
- Minimum 16px for body text (WCAG AA)
- Scalable with user zoom (up to 200%)
- Clear hierarchy with heading sizes

### Line Heights
- Minimum 1.5 for body text
- 1.1-1.2 for headings (Anton is tall)
- Adequate spacing for readability

### Contrast
- Ensure sufficient contrast with background
- Test with color contrast tools
- Support dark mode with appropriate colors

## Implementation in Vue.js

### Global Styles

```css
/* main.css or App.vue */
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@400;500;600;700&display=swap');

:root {
  --font-heading: 'Anton', sans-serif;
  --font-body: 'Manrope', sans-serif;
}

* {
  font-family: var(--font-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 400;
  letter-spacing: 0.5px;
}
```

### Component Usage

```vue
<template>
  <div>
    <h1 class="font-heading text-5xl">Page Title</h1>
    <p class="font-body text-base">Body text content here.</p>
  </div>
</template>
```

## Resources

- [Anton on Google Fonts](https://fonts.google.com/specimen/Anton)
- [Manrope on Google Fonts](https://fonts.google.com/specimen/Manrope)
- [Font Loading Best Practices](https://web.dev/font-best-practices/)


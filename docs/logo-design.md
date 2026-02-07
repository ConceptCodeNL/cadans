# CADANS Logo Design

## Design Concept

The CADANS logo combines multiple concepts:
- **Cadence/Pulse**: The heartbeat-like waveform represents rhythm and continuous assessment
- **Chart/Grade**: The bar chart represents grading and performance tracking
- **Company/Professional**: Clean, modern design suitable for professional use

## Logo Files

### Main Logo (Horizontal)
- **File**: `logo-horizontal.svg`
- **Dimensions**: 240×50px
- **Usage**: Header, navigation, marketing materials
- **Features**: Full logo with pulse waveform, chart bars, and text

### Compact Logo
- **File**: `logo.svg`
- **Dimensions**: 200×60px
- **Usage**: Smaller spaces, mobile navigation
- **Features**: Slightly condensed version

### Icon Only
- **File**: `logo-icon.svg`
- **Dimensions**: 60×60px
- **Usage**: Favicon, app icon, small spaces
- **Features**: Just the pulse/chart graphic

### Text Only
- **File**: `logo-text-only.svg` (light mode), `logo-text-only-dark.svg` (dark mode)
- **Dimensions**: 180×50px (scalable)
- **Usage**: Text-only branding, when icon isn't needed
- **Features**: CADANS text using Anton font, no graphics

### Dark Mode
- **File**: `logo-dark.svg`
- **Dimensions**: 240×50px
- **Usage**: Dark mode theme
- **Features**: Lighter colors for dark backgrounds

## Color Palette

### Primary Colors (Pastel Green)
- **Light Mode**: `#86efac` (Green-300) - pulse/chart elements
- **Dark Mode**: `#6ee7b7` (Emerald-300) - pulse/chart elements
- **Slate Dark**: `#1e293b` (text, light mode)
- **Slate Light**: `#f1f5f9` (text, dark mode)
- **Slate Gray**: `#64748b` (tagline, light mode)
- **Slate Gray Light**: `#94a3b8` (tagline, dark mode)

### Color Variations
- **Primary Hover**: `#6ee7b7` (light), `#86efac` (dark)
- **Primary Active**: `#4ade80` (light), `#34d399` (dark)
- **Primary Light**: `#a7f3d0` (subtle accents)

## Design Elements

### Pulse Waveform
- Represents cadence, rhythm, continuous monitoring
- Smooth, flowing lines
- Medical monitor/heartbeat aesthetic
- 3.5px stroke width for visibility

### Chart Bars
- Represents grading, assessment, performance
- Varying heights show progression
- Rounded corners (1.5px radius) for modern look
- 3.5px width with spacing

### Typography
- **Main Text (CADANS)**: Anton font, 400 weight, 32-40px size, 2px letter spacing
- **Tagline**: Manrope font, 500 weight, 8px size, 1.2px letter spacing
- **Anton**: Bold, condensed, impactful - perfect for brand identity
- **Manrope**: Clean, readable, professional - complements Anton well

### Tagline
**"CHECK-INS THAT MATTER"** ✅ (Selected)

- Emphasizes meaningful, valuable check-ins
- Purposeful and value-driven
- Professional and memorable
- Used in all logo variations
- See [Tagline Documentation](./taglines.md) for details

## Usage Guidelines

### Light Mode
- Use `logo-horizontal.svg` or `logo.svg` on light backgrounds
- Text color: `#1e293b` (dark slate)
- Accent color: `#6366f1` (indigo)

### Dark Mode
- Use `logo-dark.svg` on dark backgrounds
- Text color: `#f1f5f9` (light slate)
- Accent color: `#818cf8` (light indigo)

### Minimum Sizes
- **Full logo**: Minimum 120px width
- **Icon**: Minimum 32px × 32px
- **Favicon**: 32px × 32px or 16px × 16px

### Spacing
- Maintain clear space around logo (minimum 20px)
- Don't place other elements too close to logo
- Keep aspect ratio when resizing

## Implementation

### In Vue.js Application

```vue
<template>
  <!-- Light mode -->
  <img src="/logo-horizontal.svg" alt="CADANS" class="logo" />
  
  <!-- Dark mode -->
  <img src="/logo-dark.svg" alt="CADANS" class="logo" v-if="isDark" />
  
  <!-- Text only -->
  <img src="/logo-text-only.svg" alt="CADANS" class="logo-text" />
  
  <!-- Icon only -->
  <img src="/logo-icon.svg" alt="CADANS" class="logo-icon" />
</template>
```

### CSS Usage

```css
.logo {
  height: 40px;
  width: auto;
}

.logo-icon {
  width: 32px;
  height: 32px;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .logo {
    content: url('/logo-dark.svg');
  }
}
```

### Favicon

Convert `logo-icon.svg` to favicon formats:
- `favicon.ico` (16×16, 32×32, 48×48)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180×180)

## Customization

### Colors
The logo uses CSS variables for easy theming:
- Primary color can be changed via CSS custom properties
- Text colors adapt to light/dark mode

### Sizing
- SVG format allows scaling without quality loss
- Use CSS to control size
- Maintain aspect ratio

## Brand Guidelines

### Do's
- ✅ Use provided SVG files
- ✅ Maintain clear space around logo
- ✅ Use appropriate version for light/dark mode
- ✅ Scale proportionally

### Don'ts
- ❌ Don't modify the logo design
- ❌ Don't stretch or distort
- ❌ Don't use low-resolution versions
- ❌ Don't place on busy backgrounds
- ❌ Don't change colors arbitrarily

## Alternative Versions

If needed, we can create:
- Monochrome versions (black/white)
- Reversed versions (for dark backgrounds)
- Simplified versions (text only)
- Stacked versions (vertical layout)


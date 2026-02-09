# Accessibility Requirements

## Overview

CADANS is committed to providing an accessible platform that can be used by everyone, including people with disabilities. We aim for WCAG 2.1 Level AA compliance.

## Standards

- **WCAG 2.1 Level AA**: Primary accessibility standard
- **Section 508**: Compliance where applicable
- **EN 301 549**: European accessibility standard

## Keyboard Navigation

### Requirements

**All functionality must be keyboard accessible:**
- No mouse-only interactions
- All interactive elements reachable via keyboard
- Logical tab order throughout the application

**Keyboard Shortcuts:**
- `Tab` / `Shift+Tab`: Navigate forward/backward through interactive elements
- `Enter` / `Space`: Activate buttons, submit forms, select items
- `Escape`: Close modals, dismiss notifications, cancel actions
- `Arrow keys`: Navigate within components (radio groups, dropdowns, sliders)
- `Home` / `End`: Navigate to first/last item in lists
- `Page Up` / `Page Down`: Scroll through long content

**Focus Management:**
- Visible focus indicators on all interactive elements (2px solid outline, high contrast)
- Focus order follows visual order
- Focus trap in modals (cannot tab outside modal)
- Focus restoration when closing modals (return to trigger element)
- Skip links to main content

**Implementation:**
- Use native HTML elements where possible (`<button>`, `<a>`, `<input>`)
- For custom components, ensure proper keyboard event handlers
- Use `tabindex` appropriately (0 for focusable, -1 for programmatic focus)
- Never use `tabindex > 0`

## Screen Reader Support

### Requirements

**Semantic HTML:**
- Use proper HTML5 semantic elements
- `<nav>` for navigation
- `<main>` for main content
- `<article>` for content sections
- `<section>` for distinct sections
- `<header>` and `<footer>` for page structure
- `<button>` for buttons, not `<div>` or `<span>`
- `<a>` for links with proper `href` attributes

**ARIA Labels and Roles:**
- `aria-label`: Provide accessible names for elements without visible text
- `aria-labelledby`: Reference visible text as label
- `aria-describedby`: Reference descriptive text (help text, error messages)
- `aria-live`: Announce dynamic content changes
  - `aria-live="polite"`: Announce when user is idle
  - `aria-live="assertive"`: Announce immediately (use sparingly)
- `aria-required`: Indicate required form fields
- `aria-invalid`: Indicate form field errors
- `aria-expanded`: Indicate expandable/collapsible state
- `aria-selected`: Indicate selected items
- `aria-checked`: Indicate checkbox/radio state
- `aria-disabled`: Indicate disabled state
- `aria-busy`: Indicate loading state

**ARIA Patterns:**
- **Modals**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` for title
- **Dropdowns**: `role="combobox"` or `role="listbox"` with proper ARIA attributes
- **Navigation**: `role="navigation"` with `aria-label` or `aria-labelledby`
- **Breadcrumbs**: `role="navigation"` with `aria-label="Breadcrumb"`
- **Alerts**: `role="alert"` for important messages
- **Status**: `role="status"` for non-critical updates

**Content Announcements:**
- Form errors announced immediately via `aria-live="polite"`
- Success messages announced via `aria-live="polite"`
- Loading states announced via `aria-busy="true"` and `aria-live="polite"`
- Page title changes announced (via `<title>` element)

## Color and Contrast

### Requirements

**Contrast Ratios (WCAG AA):**
- **Normal text** (under 18pt): Minimum 4.5:1 contrast ratio
- **Large text** (18pt+ or 14pt+ bold): Minimum 3:1 contrast ratio
- **UI components** (buttons, form controls): Minimum 3:1 contrast ratio
- **Focus indicators**: Minimum 3:1 contrast against background

**Color Usage:**
- **Don't rely solely on color**: Use color plus text, icons, or patterns
- **Error states**: Red color + error icon + error text
- **Success states**: Green color + success icon + success text
- **Links**: Underlined or high contrast (not just color difference)

**Testing:**
- Use contrast checking tools (WebAIM Contrast Checker, axe DevTools)
- Test with color blindness simulators
- Test in grayscale mode

## Visual Accessibility

### Requirements

**Text Scaling:**
- Support up to 200% zoom without horizontal scrolling
- Text remains readable at all zoom levels
- Layout adapts gracefully to zoom

**Font and Typography:**
- Minimum 16px font size for body text (or user-adjustable)
- Line height minimum 1.5 for readability
- Adequate letter spacing
- Clear, readable font family

**Spacing:**
- Minimum 8px spacing between interactive elements
- Adequate padding in buttons and form controls
- Clear visual separation between sections

**Responsive Design:**
- Works on all screen sizes (mobile, tablet, desktop)
- Touch targets minimum 44x44px on mobile
- No horizontal scrolling on any device

## Animation and Motion

### Requirements

**Respect User Preferences:**
- Check `@media (prefers-reduced-motion: reduce)`
- Disable or significantly reduce animations for users who prefer reduced motion
- Still maintain functional transitions (e.g., fade instead of slide)

**Animation Guidelines:**
- Keep animation duration under 5 seconds
- No flashing content (more than 3 flashes per second)
- Smooth, easing animations (not jarring)
- Provide option to disable animations

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Form Accessibility

### Requirements

**Labels:**
- All form inputs have visible, associated `<label>` elements
- Use `for` attribute on label matching `id` on input
- Or use `aria-labelledby` for complex labeling

**Error Handling:**
- Clear, specific error messages near the relevant field
- Use `aria-describedby` to associate error messages with inputs
- Use `aria-invalid="true"` on inputs with errors
- Announce errors immediately via `aria-live="polite"`

**Required Fields:**
- Indicate with `aria-required="true"`
- Visual indicator (asterisk) with text explanation
- "Required" text in label or nearby

**Help Text:**
- Use `aria-describedby` to associate help text with inputs
- Place help text near the input
- Make help text accessible to screen readers

**Validation:**
- Real-time validation with clear error announcements
- Success states for valid inputs (optional)
- Clear indication of form completion status

## Component-Specific Requirements

### Buttons
- Use `<button>` element, not `<div>` or `<span>`
- Provide accessible name (`aria-label` if no visible text)
- Indicate disabled state with `aria-disabled="true"`
- Show loading state with `aria-busy="true"`

### Links
- Use `<a>` with proper `href` attributes
- Descriptive link text (not "click here" or "read more")
- Indicate external links with `aria-label` or icon with text
- Visited state should be distinguishable

### Modals/Dialogs
- `role="dialog"` or `<dialog>` element
- `aria-modal="true"`
- `aria-labelledby` pointing to title
- `aria-describedby` pointing to description (if applicable)
- Focus trap (cannot tab outside)
- Focus restoration on close
- `Escape` key closes modal

### Dropdowns/Selects
- Use native `<select>` where possible
- For custom dropdowns, use proper ARIA combobox or listbox pattern
- `aria-expanded` to indicate open/closed state
- `aria-selected` for selected items
- Keyboard navigation with arrow keys

### Radio Groups
- Use `<fieldset>` and `<legend>` for grouping
- `role="radiogroup"` if custom implementation
- `aria-checked` for checked state
- Arrow keys navigate between options

### Checkboxes
- Use native `<input type="checkbox">` where possible
- `aria-checked` for checked/unchecked/indeterminate states
- Associated label with checkbox

### Tables
- Use `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` properly
- `scope` attribute on `<th>` elements
- `aria-label` or `<caption>` for table description
- For complex tables, use `aria-describedby`

### Loading States
- `aria-busy="true"` on loading container
- `aria-live="polite"` to announce loading start/end
- Loading text: "Loading..." or descriptive text
- Skeleton loaders should have `aria-hidden="true"`

## Testing Requirements

### Automated Testing
- **axe DevTools**: Run on all pages and components
- **WAVE**: Web Accessibility Evaluation Tool
- **Lighthouse**: Accessibility audit (aim for 100 score)
- **Pa11y**: Command-line accessibility testing
- Integrate into CI/CD pipeline

### Manual Testing
- **Keyboard-only navigation**: Test entire application with keyboard only
- **Screen reader testing**: 
  - NVDA (Windows, free)
  - JAWS (Windows, paid)
  - VoiceOver (macOS/iOS, built-in)
  - TalkBack (Android, built-in)
- **Browser testing**: Test in Chrome, Firefox, Safari, Edge
- **Mobile testing**: Test on iOS and Android with screen readers

### User Testing
- Test with users who have disabilities
- Gather feedback on accessibility barriers
- Iterate based on user feedback

## Accessibility Statement

### Requirements

**Provide an accessibility statement page that includes:**
- Commitment to accessibility
- WCAG compliance level (AA)
- Known accessibility issues
- Contact method for accessibility concerns
- Feedback mechanism
- Date of last review

**Example Structure:**
1. Our commitment
2. Conformance status
3. Known issues
4. Feedback and contact
5. Last updated date

## Implementation Checklist

### Development
- [ ] Semantic HTML used throughout
- [ ] All interactive elements keyboard accessible
- [ ] ARIA labels and roles where needed
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible and high contrast
- [ ] Forms have proper labels and error handling
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Images have alt text
- [ ] Links have descriptive text

### Testing
- [ ] Automated accessibility testing passes
- [ ] Keyboard-only navigation works
- [ ] Screen reader testing completed
- [ ] Color contrast verified
- [ ] Mobile accessibility tested
- [ ] Browser compatibility tested

### Documentation
- [ ] Accessibility statement created
- [ ] Known issues documented
- [ ] Contact method provided
- [ ] Last review date updated

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)



# CADANS - Student Grading Platform

A privacy-focused student grading platform built with Supabase and Vue.js. Track and evaluate student performance through structured meeting-based grading, competency assessment, and end grade calculation. Students are identified only by unique 6-character codes - no personal data stored.

## Documentation

All project documentation is available in the [`docs/`](./docs/) directory:

- **[Documentation Index](./docs/README.md)** - Start here for an overview
- **[Requirements Overview](./docs/requirements-overview.md)** - Project scope and key features
- **[Technical Specifications](./docs/technical-specifications.md)** - Data models, architecture, and implementation details
- **[Suggestions & Recommendations](./docs/suggestions.md)** - Review notes and improvement suggestions

### Epics

- [Epic 1: Authentication & User Management](./docs/epic-1-authentication.md)
- [Epic 2: Student Management](./docs/epic-2-student-management.md)
- [Epic 2.5: Grading Session Management](./docs/epic-2-5-grading-session-management.md)
- [Epic 3: Meeting Grading](./docs/epic-3-weekly-checkins.md)
- [Epic 4: End Grade](./docs/epic-4-end-grade.md)
- [Epic 6: Dashboards & Reporting](./docs/epic-6-dashboards.md)
- [Epic 7: Notifications & Reminders](./docs/epic-7-notifications.md)
- [Epic 8: Settings & Configuration](./docs/epic-8-settings.md)
- [Epic 9: Legal Compliance & Multilingual](./docs/epic-9-legal-compliance.md)

## Tech Stack

- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Frontend**: Vue.js 3 (Composition API) + shadcn-vue + Tailwind CSS
- **State Management**: Pinia
- **Internationalization**: Vue I18n (English/Dutch)
- **Email**: Brevo (transactional emails)
- **PDF**: Client-side with print CSS
- **Hosting**: Vercel (frontend), Supabase Cloud (backend)
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions + Vercel automatic deployments
- **Accessibility**: WCAG 2.1 AA compliant

## Quick Start

1. Review the [Requirements Overview](./docs/requirements-overview.md)
2. Check [Technical Specifications](./docs/technical-specifications.md) for implementation details
3. Review [Suggestions](./docs/suggestions.md) for recommendations
4. Start with Phase 1 (MVP) features as outlined in suggestions

## Logo

The CADANS logo combines:
- **Pulse/Cadence**: Heartbeat waveform representing continuous assessment
- **Chart/Grade**: Bar chart representing grading and performance tracking
- **Professional**: Clean, modern design for company use

Logo files are available in `/public/`:
- `logo-horizontal.svg` - Full horizontal logo (with pulse/chart graphics)
- `logo-text-only.svg` - Text-only logo using Anton font
- `logo-icon.svg` - Icon only (for favicon, app icon)
- `logo-dark.svg` - Dark mode version
- `logo-text-only-dark.svg` - Text-only logo (dark mode)

**Tagline**: "Check-ins That Matter" - Used in all logo variations

## Typography

- **Headings**: Anton (Google Fonts) - Bold, impactful, modern
- **Body Text**: Manrope (Google Fonts) - Clean, readable, professional

## Theming

- **Light Theme**: Clean, professional light interface with pastel green accents
- **Dark Theme**: Comfortable dark mode with pastel green highlights
- **Color Palette**: Pastel green (#86efac light, #6ee7b7 dark) as primary brand color
- **Theme Toggle**: User preference with system detection
- **Accessibility**: WCAG AA compliant contrast in both themes

See [Typography Documentation](./docs/typography.md) for font guidelines, [Theme Design System](./docs/theme-design.md) for color palettes and implementation, [Logo Design Documentation](./docs/logo-design.md) for logo usage, and [Tagline Suggestions](./docs/taglines.md) for brand tagline options.